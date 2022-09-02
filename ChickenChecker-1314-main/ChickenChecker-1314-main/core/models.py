from django.db import models
from django.contrib.auth.models import User
import datetime
# from core.data.heatmap import *
  
class Complex(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='complexes')  
    name = models.CharField(max_length=30, default="Complex A")
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    long = models.DecimalField(max_digits=9, decimal_places=6)
    
    @property
    def farms(self):
        return Farm.objects.filter(complex=self.id)

    @property
    def farmCount(self):
        farms = Farm.objects.filter(complex=self.id)
        return len(farms)

    @property
    def status(self):
        farms = Farm.objects.filter(complex=self.id)
        if farms is None or self.farmCount == 0:
            return 0
        total = 0
        accounted_farms = 0
        for f in farms:
            if (f.status != 0):
                total += f.status
                accounted_farms += 1
        if total == 0 or accounted_farms == 0:
            return None
        return round(total / accounted_farms)
    
    def __str__(self):
        return self.name

class Farm(models.Model):  
    # farm_id = "farm" + models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='farms')  
    name = models.CharField(max_length=30, default="Farm A")
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    long = models.DecimalField(max_digits=9, decimal_places=6)
    complex = models.ForeignKey(Complex, on_delete=models.SET_NULL, null=True, related_name='farms')
    # status = models.PositiveIntegerField()
    @property
    def houses(self):
        return House.objects.filter(farm=self.id)

    @property
    def houseCount(self):
        houses = House.objects.filter(farm=self.id)
        return len(houses)

    @property
    def status(self):
        houses = House.objects.filter(farm=self.id)
        if houses is None or len(houses) == 0:
            return 0
        total = 0
        accounted_houses = 0
        for h in houses:
            house_status = h.status
            if (house_status != 0):
                total += h.status
                accounted_houses += 1
        return round(total / accounted_houses)

    def __str__(self):
        return f"{self.user}: {self.name}"


# Add Heatmap image fields based on sliding time window
# Add method to update Heatmaps (and date property)
class House(models.Model):

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='houses')
    length = models.PositiveIntegerField()
    width = models.PositiveIntegerField()
    doorCount = models.PositiveIntegerField()
    lastFlockEntry = models.DateField(null = True)
    lastDataTimestampProcessed = models.DateTimeField(null = True)
    heatmap = models.ImageField(upload_to='heatmaps/', default='heatmaps/')
    report = models.FileField(upload_to='reports/', default='reports/')
    
    @property
    def monitors(self):
        return Monitor.objects.filter(house=self.id)
    
    @property
    def flockAge(self):
        diff = datetime.date.today() - self.lastFlockEntry
        return diff.days
    
    @property
    def monitorCount(self):
        monitors = Monitor.objects.filter(house=self.id)
        return len(monitors)
    
    @property
    def status(self):
        monitors = Monitor.objects.filter(house=self.id)
        if monitors is None or len(monitors) == 0:
            return 0
        total = 0
        accounted_monitors = 0
        for m in monitors:
            monitor_status = m.status
            if (monitor_status != 0):
                total += m.status
                accounted_monitors += 1
        return round(total / accounted_monitors)

    def __str__(self):
        return f"{self.farm}: house {self.id}"
    
class Monitor(models.Model):
    name = models.CharField(max_length=30, default="Monitor A")
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    posX = models.PositiveIntegerField()
    posY = models.PositiveIntegerField()
    
    # RETURN TUPLE OF STATUSES
    # def statuses(self, date, hour):
    #     matches = HourlyData.objects.filter(day = date, monitor=self, hour = hour)
    #     # should only be one
    #     match = matches[0]
    #     # returns a tuple 
    #     return ((match.events_1, match.events_2, match.events_3, match.events_4, match.events_5))
    # NOTE: REMEMBER TO MIGRATE
        
    
    # NOTE: MISNOMER; MAX STATUS
    @property
    def status(self):

        # Query for last evening's worth of data
        start_dt = datetime.datetime.today()
        if (self.house.lastDataTimestampProcessed is not None):
            start_dt = self.house.lastDataTimestampProcessed - datetime.timedelta(days = 1)
        else:
            start_dt = self.house.lastFlockEntry
        end_dt = datetime.datetime.today() + datetime.timedelta(days = 1)
        datas = list(Data.objects.filter(timestamp__range = [start_dt, end_dt], monitor = self.id))
        datas.sort(key = lambda x: x.timestamp, reverse = True)
        num_entries = min(8 * 12, len(datas))
        datas = datas[:num_entries]

        # Calculate status
        if datas is None or len(datas) == 0:
            return 0
        totals = (0, 0, 0, 0, 0)
        for d in datas:
            totals = (totals[0] + d.events_1,
                      totals[1] + d.events_2,
                      totals[2] + d.events_3,
                      totals[3] + d.events_4,
                      totals[4] + d.events_5)
        total = sum(list(totals))
        weighted = 1 * totals[0] + 2 * totals[1] + 3 * totals[2] + 4 * totals[3] + 5 * totals[4]
        cumulative_status = round(weighted / total)
        return cumulative_status

    @property
    def data(self):
        allData = []
        matches = Data.objects.filter(monitor=self)
        flockentry = House.objects.filter(id = self.house.id)[0].lastFlockEntry
        for entry in matches:
            if entry.day >= flockentry and entry.day < datetime.date.today():
                allData.append(entry)
        return allData 

    def __str__(self):
        return f"{self.house}: {self.name}"
    
class Data(models.Model):
    monitor = models.ForeignKey(Monitor, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()

    events_1 = models.PositiveIntegerField()
    events_2 = models.PositiveIntegerField()
    events_3 = models.PositiveIntegerField()
    events_4 = models.PositiveIntegerField()
    events_5 = models.PositiveIntegerField()

    @property
    def avgEventLevel(self):
        values = 1*self.events_1 + 2*self.events_2 + 3*self.events_3 + 4*self.events_4 + 5*self.events_5
        count = self.events_1 + self.events_2 + self.events_3 + self.events_4 + self.events_5

        return round(values / count)
        

    def __str__(self):
        return f"{self.monitor.house}: {self.monitor}: timestamp {self.timestamp}"
