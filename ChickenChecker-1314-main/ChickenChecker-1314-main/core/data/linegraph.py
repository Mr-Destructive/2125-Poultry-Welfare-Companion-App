from core.models import *
import matplotlib.pyplot as plt
import numpy as np
import datetime

def main():
    # from data, where monitor = x, 
    # monitors: 0=115, 2=117, 3=118, 6=121, 7=122
    monitorID = 115
    print(Monitor.objects.all())
    start_time = datetime.datetime(2022, 1, 24, 22, 0, 0, 0)
    end_time = datetime.datetime(2022, 1, 25, 12, 0, 0, 0)
#  
    # monitorData = Data.objects.filter(timestamp__range = [start_time, end_time], monitor=monitorID).order_by('timestamp')
    # plot(start_time, monitorData)

    
    while end_time < datetime.datetime(2022, 2, 2, 12, 0, 0, 0):
        print(start_time, end_time)
        print('\n\n\n\n')
        monitorData = Data.objects.filter(timestamp__range = [start_time, end_time], monitor=monitorID).order_by('timestamp')
        plot(start_time, monitorData)
        start_time = start_time + datetime.timedelta(days = 1)
        start_time = datetime.datetime(start_time.year, 
                                        start_time.month, 
                                        start_time.day, 
                                        22, 
                                        0, 
                                        0,
                                        0)
        end_time = end_time + datetime.timedelta(days = 1)
        end_time = datetime.datetime(end_time.year, 
                                        end_time.month, 
                                        end_time.day, 
                                        12, 
                                        0, 
                                        0,
                                        0)


def plot(start, data):
    date = []
    e1 = []
    e2 = []
    e3 = []
    e4 = []
    e5 = []
    
    for n in data:
        date.append(n.timestamp)
        e1.append(n.events_1)
        e2.append(n.events_2)
        e3.append(n.events_3)
        e4.append(n.events_4)
        e5.append(n.events_5)

    f1 = plt.figure()
    plt.plot(date, e1, label = "events_1")
    # plt.plot(date, e2, label = "events_2")
    # plt.plot(date, e3, label = "events_3")
    # plt.plot(date, e4, label = "events_4")
    # plt.plot(date, e5, label = "events_5")
    plt.title(f'night of {start.month}-{start.day}, Mic 00')
    plt.legend()
    # plt.show()
    plt.savefig(f"mic00_{start.month}-{start.day}night_event1")
    plt.clf()


if __name__ == "__main__":
    main()
