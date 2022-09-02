'''
NOTE: THIS FILE MUST BE RUN FROM THE ROOT DIRECTORY! USE "python ./core/data/<filename>.py"
'''

import sys
import os

delete = False
add = True 
my_path = os.path.join("raw_data", "") # "generated_data/"
house_id = 4
num_monitors = 8
year = 2022
# coords should be in a straight line along one water line based on AudioT documentation. linear rather than 2d
my_waterline_pos = 11 # x position

import django
sys.path[0] = os.path.join(sys.path[0], "..", "..")
# print(sys.path)
os.environ['DJANGO_SETTINGS_MODULE'] = 'server.settings'
django.setup()

import pandas as pd
from enum import Enum
from django.db import models
from django.contrib.auth.models import User
from core.models import *
import numpy as np
import datetime as dt
rootpath = "./core/data/"
format = '%Y-%m-%d %H:%M:%S'

# Find paths to CSVs
def get_paths(p = f"{rootpath}{my_path}", show = False):
	entries = os.listdir(p)
	for i in range(len(entries)):
		entries[i] = f"{p}{entries[i]}"
	paths = []
	i = 0
	while i < len(entries):
		entry = entries[i]
		if (os.path.isdir(entry)):
			nested = os.listdir(entry)
			for j in range(len(nested)):
				nested[j] = os.path.join(entry, nested[j])
				entries.append(nested[j])
		else:
			paths.append(entry)
		i += 1
	for p in paths:
		if ('.csv' not in p):
			paths.remove(p)
		# strs = p.split('mic')
		# print(strs)
		# second = strs[2]
		# print(second)
		# chars = int(second[0:2])
		# print(chars)
		# print(p)
	# Mic specific key here \/ first segment, then number. 'mic' is in both the directory path and the filename
	paths.sort(key = lambda x: int(x.split('mic')[2][0:2]))
	if show:
		print("Recursively found files: ", paths)
	return paths

# Return a dictionary of database models
def get_models(show = False):
	mods = {}
	u = User.objects.all()
	mods["User"] = u
	c = Complex.objects.all()
	mods["Complex"] = Complex.objects.all()
	f = Farm.objects.all()
	mods["Farm"] = f
	h = House.objects.all()
	mods["House"] = h
	m = Monitor.objects.all()
	mods["Monitor"] = m
	d = Data.objects.all()
	mods["Data"] = d
	if show:
		print(f"Existing Users ({len(u)}): {u}")
		print(f"Existing Complexes ({len(c)}): {c}")
		print(f"Existing Farms ({len(f)}): {f}")
		print(f"Existing Houses ({len(h)}): {h}")
		print(f"Existing Monitors ({len(m)}): {m}")
		print(f"Existing Data ({len(d)}): {d}")
	return mods

# Populate a database House with Monitors and Data entries based on my_path and house_id
def add_data(house : House, init_models : dict):
    # Check args
	if (house is None):
		return 1

	# Generate coordinate points
	interval = int(house.length / num_monitors)
	coords = []
	for i in range(num_monitors):
		coords.append((my_waterline_pos, int(interval/2) + (interval * i)))
	for c in coords:
		x, y = c
		if ((y < 1 or x < 1) or (y > house.length) or (x > house.width)):
			return 1

	# Create monitors and corresponding data
	paths = get_paths()
	# print("Paths")

	# Dictionaries to hold monitors and timestamped data entries
	generated_monitors = {}
	generated_entries = {}

	# Start with max date
	min_date = dt.datetime(2100, 1, 1)

	# Iterate through files, each of which represents one day
	# print(f"range: {range(min(len(paths), num_monitors, len(coords)))}")
	for i in range(len(paths)):

		# Get path
		p = paths[i]
		print(p)
		df = pd.read_csv(p)

		# Establish when to create a new monitor based on the CSV data
		mic_internal_num = int(p.split('mic')[2][0:2])
		if (not mic_internal_num in generated_monitors):
			# print(f"new mic generated with key {mic_internal_num}")
			
			# Create monitor model (holding to convention of range from [1,n] rather than [0, n) )
			x, y = coords[len(generated_monitors.keys())]
			generated_monitors[mic_internal_num] = Monitor(house = init_models["House"][house_id],
                                                  posX = x, posY = y,
                                                  name = f"{house}: Monitor {len(generated_monitors.keys())}")
		
		m = generated_monitors[mic_internal_num]
		
		# Iterate through dataframe rows
		for index, row in df.iterrows():
			
			# parse date
			csv_date_time = row["date_time"]
			date_time = dt.datetime.strptime(csv_date_time, format)
			if date_time < min_date:
				min_date = date_time

			# Bin times into intervals of 5 minutes
			date_time_bucket = dt.datetime(date_time.year, date_time.month, date_time.day,
										   date_time.hour, int(date_time.minute / 5) * 5)
			dtm_key = (date_time_bucket, mic_internal_num)

			# Entries in 'generated_entries' are arrays containing 
			# [0, alerts1, alerts2, alerts3, alerts4, alerts5]
			# such that the Data object may be created using both the 
			# key and the array information
			if (not dtm_key in generated_entries.keys()):
				generated_entries[dtm_key] = [0, 0, 0, 0, 0, 0]

			# Gets alert type of entry
			alert_type = 0
			try:
				alert_type = int(row[f"event_label"])
			except KeyError:
				return 1
			generated_entries[dtm_key][alert_type] += 1

	generated_data_models = []
	for k in generated_entries.keys():
		generated_data_models.append(
			Data(
				monitor = generated_monitors[k[1]],
				timestamp = k[0],
				events_1 = generated_entries[k][1],
				events_2 = generated_entries[k][2],
				events_3 = generated_entries[k][3],
				events_4 = generated_entries[k][4],
				events_5 = generated_entries[k][5]
		))

	# NOTE: be careful lol
	print(f"Do you wish to add these values?")
	print(f"{len(generated_entries)} Data entries,\n\tbeginning at date {min_date},\
			\n\tto house {house},\n\twith {len(generated_monitors.keys())} monitors {generated_monitors.keys()}?")
	print("\'Y\' or \'N\'")
	prompt = input()
	if (prompt == 'Y'):
		for m in generated_monitors.keys():	
			generated_monitors[m].save()
		for obj in generated_data_models:
			obj.save()
		house.lastFlockEntry = min_date
		house.save()

	return 0

# Delete a database House's Monitors and HourlyData entries based on house_id
def delete_data(house : House):
	mons = Monitor.objects.filter(house = house)
	hdss = []
	for m in mons:
		hdss.append(Data.objects.filter(monitor = m))
	print(f"Delete HourlyData {hdss[0][0:3]}... and associated monitors? \n 'Y' or 'N'")
	prompt = input()
	if (prompt == 'Y'):
		for hds in hdss:
			hds.delete()
		mons.delete()
	return 0

# Call add and delete methods
def main():
	# Get db models
	init_models = get_models(show=True)

	if (not (add or delete)):
		print("Models displayed; terminating")
		return 0

	house = init_models["House"][house_id]
 
	if delete:
		delete_data(house)
	get_models(show=True)

	if add:
		add_data(house, init_models)
	get_models(show=True)
	return 0

# Call main()
if __name__ == "__main__":
	main()
	# get_paths(show = True)
