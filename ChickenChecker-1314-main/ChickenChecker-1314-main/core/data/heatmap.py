from enum import Enum
from core.models import Data, House
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.pylab as plab
import matplotlib.colors
import datetime as dt
import copy as cp

from PIL import Image, ImageDraw

import sys, os

from . import utilities

class Interpolation(Enum):
    NONE = 0
    INTERMEDIATE_MONITORS = 1
    
class Heatmap:

    def __init__(self, house: House, interpol=0, granularity=1, k_radius=6, threshs = None):
        
        # Physical House information
        self.house = house
        self.monitors = self.house.monitors
        self.interpol = Interpolation(interpol)
        # Granularity: feet measurements such that a cell location will represent a GRAN x GRAN sq ft area in a house
        self.granularity = granularity
        # radius scaling constant
        self.k_radius = k_radius
        self.monitor_radius = self.__find_monitor_radius()

        # File Management 
        self.__root_path = sys.path[0]
        self._dir = utilities.create_directory(os.path.join(self.__root_path, 'core', 'data',
                                                 'visuals', 'houses', f'{self.house.id}',
                                                 'maps', ''))
        self.__path = os.path.join(self._dir, 'heatmap.gif')
        self.__overlay_path = os.path.join(self.__root_path, 'core', 'data',
                                                 'visuals', 'assets', 'overlay.png')

        # Default thresholds
        self.thresholds = threshs
        if (self.thresholds is None):
            self.thresholds = {1:60, 2:60, 3:130, 4:160, 5:30}
    
    
    ###############################
    ### GENERATE HEATMAP IMAGES ###
    ###############################
    
    def __find_monitor_radius(self) -> int:
        '''
        Finds monitor radius by finding the smallest difference between monitors, height-wise

        '''

        # Must be less than the distance from one monitor to the next, else, cannibalism
        diffs = []
        for i in range(len(self.monitors) - 1):
            diffs.append(abs(self.monitors[i+1].posY - self.monitors[i].posY))
        min_diff = min(diffs)
        
        return int(min_diff)
    
    def _generate_heatmap(self):
        '''
        Generates heatmap images

        '''
        
        # Skip already generated heatmaps
        start = dt.datetime.today()
        if (self.house.lastDataTimestampProcessed is not None):
            start = self.house.lastDataTimestampProcessed
        else:
            start = self.house.lastFlockEntry
        end = dt.datetime.today()
        datas = Data.objects.filter(timestamp__range = [start - dt.timedelta(minutes = 1),
                                                        end + dt.timedelta(minutes = 1)],
                                    monitor__in = self.house.monitors)
              
        # Bin data based on timestamp in intervals of 5 min                      
        binned_datas = {}
        for d in datas:
            d_dt = d.timestamp
            new_key = (d.monitor, dt.datetime(year=d_dt.year,
                                                month=d_dt.month,
                                                day=d_dt.day,
                                                hour=d_dt.hour,
                                                minute= int(d_dt.minute / 15) * 15))
            if (new_key not in binned_datas):
                binned_datas[new_key] = [d.events_1, d. events_2, d.events_3, d.events_4, d.events_5]
            else:
                binned_datas[new_key] = [binned_datas[new_key][0] + d.events_1,
                                         binned_datas[new_key][1] + d.events_2,
                                         binned_datas[new_key][2] + d.events_3,
                                         binned_datas[new_key][3] + d.events_4,
                                         binned_datas[new_key][4] + d.events_5]
        
        # Create timestamp and iterate through bins
        iter_time = dt.datetime(start.year, start.month, start.day)
        end = dt.datetime(end.year, end.month, end.day)
        last_found_dt = iter_time
        while (iter_time < end):
            
            # Only active from 10p-6a
            if (iter_time.hour < 6 or iter_time.hour < 6 and iter_time.min == 0
                or iter_time.hour >= 22):
            
                base = np.zeros((self.house.length, self.house.width))
                base = base.astype(int)
                
                # Iterate by alert level so intersecting circles of the same alert level can overlap
                for alert in range(5):
                    
                    # Iterate through each monitor
                    for monitor in self.house.monitors:
                        
                        # Num alerts of level (alert + 1) for monitor at iter_time
                        key_tuple = (monitor, iter_time)
                        if (key_tuple not in binned_datas):
                            continue
                        
                        # Plot via numpy array while accounting for thresholding
                        d = binned_datas[monitor, iter_time][alert]
                        d -= self.thresholds[alert+ 1]
                        if d < 0:
                            d = 0
                        y, x = np.mgrid[:base.shape[0], :base.shape[1]]
                        scaled_radius = self.k_radius * d / self.monitor_radius
                        circle_eqn = (x - monitor.posX) ** 2 + (y - monitor.posY) ** 2
                        mask = np.where(circle_eqn < (scaled_radius) ** 2)
                        base[mask] = alert + 1
                matplotlib.pyplot.switch_backend('Agg')       
                # Make sure there were entries plotted; else, discard (empty) heatmap
                if (np.sum(base) != 0):
                    
                    # Colorize
                    my_colors = ['#EEEEEE', '#54DB59', '#0B6214', '#FAE702', '#F18F02', '#C60A06']
                    cmap = matplotlib.colors.ListedColormap(my_colors)
                    boundaries = [-.5, .5, 1.5, 2.5, 3.5, 4.5, 5.5]
                    norm = matplotlib.colors.BoundaryNorm(boundaries, cmap.N, clip=True)
                    plt.ioff()

                    plt.imshow(base, interpolation='none', cmap = cmap, norm = norm)
                    
                    # Titles
                    plt.axis('off')
                    full_name = os.path.join(self._dir, f'{iter_time.strftime("%Y-%m-%d-%H-%M-%S")}.png')
                    str_arr = iter_time.strftime("%m/%d,%H:%M").split(',')
                    plt.title(f'{str_arr[0]}\n{str_arr[1]}', y= -.125, fontdict={'fontsize': 10})
                    
                    # Save image
                    plt.savefig(full_name,
                                bbox_inches='tight',
                                pad_inches=0,
                                transparent=True,
                                )

                    last_found_dt = cp.deepcopy(iter_time)
            
            iter_time += dt.timedelta(minutes = 15)

        # Update house entry in database
        self.house.lastDataTimestampProcessed = last_found_dt - dt.timedelta(minutes = 15)
        self.house.save()
        
        
    ###########################
    ### HEATMAP COMPILATION ###
    ###########################
    
    def update_heatmap(self, days = 1, max_img_count = None):
        '''
        Logic to update the heatmap in House by generating and compiling

        '''
        
        # Heatmap does not currently exist
        if (not os.path.exists(self.__path) or self.house.lastDataTimestampProcessed is None):
            self._generate_heatmap()
            self._compile_gif(days = days, max_img_count = max_img_count)
        
        # Heatmap exists but may need to be updated
        else:
            epoch_time = os.path.getmtime(self.__path)
            dt_mtime = dt.datetime.fromtimestamp(epoch_time)

            # Generate new heatmap because the other one is old
            # This assumes that heatmap will be updated by the server periodically such that
            # dt_mtime != lastDataTimestampProcessed
            if (dt.datetime(dt_mtime.year, dt_mtime.month,
                    dt_mtime.day, dt_mtime.hour, dt_mtime.minute, 0, 0, 
                    self.house.lastDataTimestampProcessed.tzinfo) < self.house.lastDataTimestampProcessed \
                    or dt_mtime + dt.timedelta(hours = 12) < dt.datetime.today()):
                self._generate_heatmap()
                self._compile_gif(days = days, max_img_count = max_img_count)
                
            # Else, heatmap is already current
            
        self.house.heatmap = os.path.relpath(self.__path, os.path.join(self.__root_path, 'core', 'data', 'visuals', ''))
        self.house.save()
    
    def __add_margin(self, pil_img, top, right, bottom, left, color):
        '''
        Adds margin to an image

        '''

        # Be warned that PIL image size coordinates are switched vs traditional 2D array shapes
        width, height = pil_img.size
        new_width = width + right + left
        new_height = height + top + bottom
        result = Image.new(pil_img.mode, (new_width, new_height), color)
        result.paste(pil_img, (left, top))
        return result

    def __decorate_imgs(self, imgs: list, overlay_path = None):
        '''
        Add time/date subtitle, progress bar, & overlay in-place
        For future work where doors, water/feed lines, and borders are generated dynamically, it may be advantageous to convert
        to using something like NumPy rather than Pillow. 
        '''

        # Null args
        if overlay_path is None:
            overlay_path = self.__overlay_path

        olay = Image.open(overlay_path).convert(mode='RGBA')
        n = len(imgs)
        x = 0
        y = 0
        for i in range(len(imgs)):

            img = imgs[i].convert(mode='RGBA')
            
            # Just added this
            if i == 0:
                # Iterate through left to right, top to bottom to find the upper left corner of heatmap
                # This works given the transparent pixel is represented by [255, 255, 255, 0]
                arr = np.array(img)
                start_found = False
                x = 0
                y = 0
                while (not start_found):
                    start_found = not np.all(arr[y, x] == [255, 255, 255, 0])
                    x += 1
                    if (x == img.size[0]):
                        x = 0
                        y += 1
            
            # Add overlay while retaining transparency
            # This could alternatively be done with a different paste function
            current_olay = self.__add_margin(pil_img = olay,
                                            left = x,
                                            top = y,
                                            right = img.size[0] - olay.size[0] - x,
                                            bottom = img.size[1] - olay.size[1] - y,
                                            color = (0, 0, 0, 0))
            compos = Image.alpha_composite(img, current_olay)
            
            draw = ImageDraw.Draw(compos)
            # Draw black underlying line
            draw.line([(x - 1, y + olay.size[1] + 5),
                       (x + olay.size[0] - 1, y + olay.size[1] + 5)],
                      (38, 38, 38, 255),
                      5)
            # Draw green progress line
            draw.line([(x - 1, y + olay.size[1] + 5),
                       (x + int(olay.size[0] * (i / n)), y + olay.size[1] + 5)],
                      (43, 158, 35, 255),
                      5)
            
            imgs[i] = compos
            
    def _compile_gif(self, days = 1, max_img_count = None):
        '''
        Look through the images in the folder which can be sorted based on name convention.
        If there are too many, then we want to take images at intervals.

        '''
        
        # Null arg
        if max_img_count is None:
            max_img_count = days * 32
        
        # Isolates the images of the past n days
        images = []
        paths = utilities.get_paths(p = self._dir, show = False, discriminator = '.png', max_first = True)
        n = min(days * 8 * 4, len(paths))
        paths = paths[:n]
        paths.reverse()
        
        # Sample images at a rate based on max_img_count 
        # Should also take image names into account?
        if (len(paths) > max_img_count):
            ratio = len(paths) / max_img_count
            continuous_i = 0
            for i in range(max_img_count):
                images.append(Image.open(paths[round(continuous_i)]))
                continuous_i += ratio
        else:
            for path in paths:
                images.append(Image.open(path))

        # Add overlay and compile gif
        self.__decorate_imgs(images)
        utilities.save_transparent_gif(images, 300, self.__path)
        # utilities.save_transparent_gif(images, 300, os.path.join(self.__root_path, 'ChickenCheckerApp', 'assets','heatmap.gif'))