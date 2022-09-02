import sys, os

import numpy as np
from core.models import *
import matplotlib.pyplot as plt
import datetime as dt
from .data import utilities

xtickformat = '%m/%d %H:00'

def _get_alerts_list(house: House, days = 1) -> list:
    '''
    Gives back data in a time range from [last entry - (1 day), last entry]. 
    Should be called after a Heatmap call (by an external request) updates lastTimestampProcessed.
    However, this convention is not strictly necessary.

    '''

    start = dt.datetime.today()
    if (house.lastDataTimestampProcessed is not None):
        start = house.lastDataTimestampProcessed
    else:
        start = house.lastFlockEntry
    end = dt.datetime.today()
    # Safe margin of one day; not optimal but accounts for the way lastDataTimestampProcessed is used by Heatmap.compile_gif()
    datas = Data.objects.filter(timestamp__range = [start - dt.timedelta(days = 1),
                                                    end + dt.timedelta(minutes = 1)],
                                monitor__in = house.monitors)
    datas = list(datas)
    datas.sort(key = lambda x: x.timestamp, reverse = True)
    # print(datas)
    last_found_date = datas[0].timestamp
    one_day_prior = last_found_date - dt.timedelta(days = days) + dt.timedelta(hours = 17)
    i = 0
    while (last_found_date > one_day_prior and i < len(datas)):
        last_found_date = datas[i].timestamp
        i += 1
    # print(f'data entries: {len(datas)}; isolated final day entries: {i}')
    datas = datas[:i]
    datas.reverse()
    # print(datas)
    return datas
        
def _plot_bar_chart_hour(datas: list, filename: str, ext = '.png'):
    '''
    Plots a segmented bar for each hour of the night, showing all 5 levels in each bar

    '''

    dates = []
    e1 = []
    e2 = []
    e3 = []
    e4 = []
    e5 = []
    for n in datas:
        dates.append(n.timestamp)
        e1.append(n.events_1)
        e2.append(n.events_2)
        e3.append(n.events_3)
        e4.append(n.events_4)
        e5.append(n.events_5)

    binned = {}
    i = 0
    while (i < len(dates)):
        d = dates[i]
        key = dt.datetime(d.year, d.month, d.day, d.hour)
        if (key not in binned):
            binned[key] = np.array([e1[i],
                                    e2[i],
                                    e3[i],
                                    e4[i],
                                    e5[i]])
        else:
            binned[key] += np.array([e1[i],
                                     e2[i],
                                     e3[i],
                                     e4[i],
                                     e5[i]])
        i += 1

    dates = list(binned.keys())
    e1 = []
    e2 = []
    e3 = []
    e4 = []
    e5 = []
    for key in dates:
        e1.append(binned[key][0])
        e2.append(binned[key][1])
        e3.append(binned[key][2])
        e4.append(binned[key][3])
        e5.append(binned[key][4])
    e1 = np.array(e1)
    e2 = np.array(e2)
    e3 = np.array(e3)
    e4 = np.array(e4)
    e5 = np.array(e5)
    
    
    plt.switch_backend('Agg')       

    plt.figure(figsize=(6,6))
    w = 1/26
    plt.bar(dates, e1, color='#54DB59', label='Level 1', width=w)
    plt.bar(dates, e2, bottom=e1, color='#0B6214', label='Level 2', width=w)
    plt.bar(dates, e3, bottom=e1+e2, color='#FAE702', label='Level 3', width=w)
    plt.bar(dates, e4, bottom=e1+e2+e3, color='#F18F02', label='Level 4', width=w)
    plt.bar(dates, e5, bottom=e1+e2+e3+e4, color='#C60A06', label='Level 5', width=w)

    plt.xticks(dates, [d.strftime(xtickformat) for d in dates], rotation = 45)
    plt.xlabel('Time')
    plt.ylabel('Number of Alerts')
    plt.title(f'Last Night\'s Alerts Per Hour', pad=15)
    plt.legend(loc=0)
    plt.tight_layout()
    plt.savefig(f'{filename}{ext}')
    return

def _plot_bar_chart_monitor(datas: list, filename: str, ext = '.png'):
    '''
    Plots all five levels per monitor in a segmented bar graph

    '''

    house_monitors = list(datas[0].monitor.house.monitors)
    monitor_alerts = np.zeros((len(house_monitors), 5))
    for d in datas:
        monitor_alerts[house_monitors.index(d.monitor), :] \
            += np.array([d.events_1, d.events_2, d.events_3, d.events_4, d.events_5])
    
    labels = [f'Monitor {i + 1}' for i in range(len(house_monitors))]

    x = np.array(range(len(labels)))+1
    y1 = np.array(monitor_alerts)[:,0]
    y2 = np.array(monitor_alerts)[:,1]
    y3 = np.array(monitor_alerts)[:,2]
    y4 = np.array(monitor_alerts)[:,3]
    y5 = np.array(monitor_alerts)[:,4]
    
    
    plt.switch_backend('Agg')       

    plt.figure(figsize=(6,6))
    w = .8
    plt.bar(x, y1, color='#54DB59', label='Level 1', width=w)
    plt.bar(x, y2, bottom=y1, color='#0B6214', label='Level 2', width=w)
    plt.bar(x, y3, bottom=y1+y2, color='#FAE702', label='Level 3', width=w)
    plt.bar(x, y4, bottom=y1+y2+y3, color='#F18F02', label='Level 4', width=w)
    plt.bar(x, y5, bottom=y1+y2+y3+y4, color='#C60A06', label='Level 5', width=w)

    plt.xticks(range(0, len(labels)), labels,
               rotation = 45)
    plt.xlabel('Monitors')
    plt.ylabel('Number of Alerts')
    plt.title('Last Night\'s Alerts By Monitor', pad=15)
    plt.grid(color='lightgray', alpha=0.7)
    plt.legend(loc=0)
    plt.tight_layout()
    plt.savefig(f'{filename}{ext}')
    return

def _plot_line_graph(datas: list, filename: str, ext = '.png'):
    '''
    Plots change in amount of alert levels over time
    '''

    dates = []
    e1 = []
    e2 = []
    e3 = []
    e4 = []
    e5 = []
    for n in datas:
        dates.append(n.timestamp)
        e1.append(n.events_1)
        e2.append(n.events_2)
        e3.append(n.events_3)
        e4.append(n.events_4)
        e5.append(n.events_5)

    plt.figure(2, figsize=(6,6))
    plt.plot(dates, e1, color='#54DB59', linewidth=1, label='Level 1', alpha = .8)
    plt.plot(dates, e2, color='#0B6214', linewidth=1, label='Level 2', alpha = .8)
    plt.plot(dates, e3, color='#FAE702', linewidth=1, label='Level 3', alpha = .8)
    plt.plot(dates, e4, color='#F18F02', linewidth=1, label='Level 4', alpha = .8)
    plt.plot(dates, e5, color='#C60A06', linewidth=1, label='Level 5', alpha = .8)
    # plt.plot(dates, e_avg, ':', color='black', linewidth=2, label='Alert Average')

    plt.xticks([dates[i] for i in range(0, len(dates), int(len(dates)/ 6))],
               [dates[i].strftime(xtickformat) for i in range(0, len(dates), int(len(dates)/ 6))],
               rotation = 45)
    plt.xlabel('Time (5 Minute Intervals)')
    plt.ylabel('Number of Alerts')
    plt.title('Last Night\'s Alerts Over Time', pad=15)
    plt.grid(color='lightgray', alpha=0.7)
    plt.legend(loc=0)
    plt.tight_layout()
    plt.savefig(f'{filename}{ext}')

    plt.figure(3, figsize=(6,6))
    plt.plot(dates, e1, color='#54DB59', linewidth=2, label='Level 1')
    plt.xticks([dates[i] for i in range(0, len(dates), int(len(dates)/ 6))],
               [dates[i].strftime(xtickformat) for i in range(0, len(dates), int(len(dates)/ 6))],
               rotation = 45)
    plt.xlabel('Time (5 Minute Intervals)')
    plt.ylabel('Number of Alerts')
    plt.title('Last Night\'s Snicks Over Time', pad=15)
    plt.grid(color='lightgray', alpha=0.7)
    plt.legend(loc=0)
    plt.tight_layout()
    plt.savefig(f'{filename}_1s{ext}')
    return

def _plot_pie_snicks(datas: list, filename: str, ext = '.png'):
    '''
    Shows proportion of snicks around each monitor

    '''

    house_monitors = list(datas[0].monitor.house.monitors)
    monitor_snicks = [0 for i in range(len(house_monitors))]
    # total = 0
    for d in datas:
        monitor_snicks[house_monitors.index(d.monitor)] += d.events_1
    
    labels = [f'Monitor {i + 1}' for i in range(len(house_monitors))]

    plt.figure(figsize=(6,6))
    plt.pie(monitor_snicks, labels=labels)
    plt.title(f'Last Night\'s Snick Count By Monitor', pad=15)
    plt.savefig(f'{filename}{ext}')
    return

def update_graphs(h : House):
    root_path = sys.path[0]
    dir = utilities.create_directory(os.path.join(root_path, 'core', 'data',
                                                  'visuals', 'houses', f'{h.id}',
                                                  'graphs', ''))
    alerts_list = _get_alerts_list(h)
    _plot_bar_chart_hour(alerts_list, os.path.join(dir, 'bar'))
    _plot_line_graph(alerts_list, os.path.join(dir, 'line'))
    _plot_pie_snicks(alerts_list, os.path.join(dir, 'pie'))
    _plot_bar_chart_monitor(alerts_list, os.path.join(dir, 'bar_monitors'))