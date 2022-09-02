import datetime as dt
import numpy as np
import random
import os


NUM_DAYS = 50
NUM_HOURS = 8

MIN_MIC_ACCURACY = 0.3
MAX_MIC_ACCURACY = 0.7

def gen_data(mic_num: int=0) -> list:
    data_list = []

    # # Random Start Date
    # earliest_possible_start_date = dt.date(2020, 1, 1)
    # latest_possible_start_date = dt.date(2022, 1, 1)
    # start_date = earliest_possible_start_date + dt.timedelta(days=random.randrange((latest_possible_start_date - earliest_possible_start_date).days))
    
    start_date = dt.date(2022, 3, 15)
    current_date = start_date

    mic_accuracy = np.random.uniform(low=MIN_MIC_ACCURACY, high=MAX_MIC_ACCURACY)
    sickness_list = get_sickness_list()
    all_alerts_list = []
    time_data_list = []
    for day_list in sickness_list:
        hour_num = 0
        for hour_sickness in day_list:
            alerts_list = get_alerts_list(mic_accuracy, hour_sickness)
        
            date_str = current_date.strftime('%m-%d-%Y')
            data_list.append(f'{mic_num},{date_str},{hour_num},{alerts_list[0]},{alerts_list[1]},{alerts_list[2]},{alerts_list[3]},{alerts_list[4]}')

            all_alerts_list.append(alerts_list)
            time_data_list.append(f'{date_str},{hour_num}')

            hour_num += 1

        current_date += dt.timedelta(days=1)
    return data_list, all_alerts_list, time_data_list


def get_sickness_list() -> list:
    initial_sickness_level_established = False
    while not initial_sickness_level_established:
        initial_sickness_level = np.random.normal(loc=0.3, scale=0.2)
        if initial_sickness_level > 0 and initial_sickness_level < 1:
            initial_sickness_level_established = True

    sickness_level = initial_sickness_level
    sickness_list = []
    for day_num in range(NUM_DAYS):
        trending_up = np.random.random() > sickness_level ** 2

        day_list = []
        for hour_num in range(NUM_HOURS):
            if np.random.random() < 0.05:
                trending_up = np.random.random() > sickness_level ** 2

            if np.random.random() < 0.05:
                moves_up = not trending_up
            else:
                moves_up = trending_up

            movement_range = (sickness_level ** 2)/10
            if moves_up:
                sickness_level += np.random.uniform(high=movement_range)
            else:
                sickness_level -= np.random.uniform(high=movement_range)

            if sickness_level <= 0:
                sickness_level = 0.01
            if sickness_level >= 1:
                sickness_level = 0.99

            day_list.append(round(sickness_level, 2))
        sickness_list.append(day_list)  
    return sickness_list


def get_alerts_list(mic_accuracy: float, hour_sickness: float) -> list:
    alerts_5 = round((hour_sickness ** 2) * 3 + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 1 - 0.75)
    if alerts_5 < 0:
        alerts_5 = 0

    alerts_list = [
        round(hour_sickness * random.randint(300, 1000) + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 100),
        round(hour_sickness * random.randint(300, 900) + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 100),
        round(hour_sickness * random.randint(300, 800) + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 100),

        round(hour_sickness * 3 * random.randint(300, 1000)  + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 100) if hour_sickness < 0.75
        else round(hour_sickness * 250 + np.random.uniform(high=1-mic_accuracy) * np.random.uniform(low=-1, high=1) * 100),

        alerts_5
        ]
    
    return alerts_list


def create_csv_file(filename: str, data_list: list) -> None:
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w') as f:
        f.write('mic_num, mm-dd-yyyy, hour, alerts_1, alerts_2, alerts_3, alerts_4, alerts_5\n')
        for line in data_list:
            f.write(line + '\n')
        
    return


def get_increasing_array(size: list) -> np.array:
    increasing_array = np.full(size, 0.5)
    y_increment_amount = 0.5 / size[0]
    x_increment_amount = 0.5 / size[1]
    for i in range(size[0]):
        for j in range(size[1]):
            increasing_array[i, j] += (y_increment_amount * i) + (x_increment_amount * j)

    return increasing_array


def get_spread_list(width: int, height: int) -> list:
    x_split = random.randint(0, width)
    y_split = random.randint(0, height)

    top_left = False
    top_right = False
    bottom_left = False
    bottom_right = False

    if x_split != 0 and y_split != 0:
        top_left_size = [y_split, x_split]
        top_left_array = get_increasing_array(top_left_size)
        top_left = True

    if x_split != width and y_split != 0:
        top_right_size = [y_split, width - x_split]
        top_right_array = get_increasing_array(top_right_size)
        top_right_array = np.fliplr(top_right_array)
        top_right = True
    
    if x_split != 0 and y_split != height:
        bottom_left_size = [height - y_split, x_split]
        bottom_left_array = get_increasing_array(bottom_left_size)
        bottom_left_array = np.flipud(bottom_left_array)
        bottom_left = True

    if x_split != width and y_split != height:
        bottom_right_size = [height - y_split, width - x_split]
        bottom_right_array = get_increasing_array(bottom_right_size)
        bottom_right_array = np.fliplr(bottom_right_array)
        bottom_right_array = np.flipud(bottom_right_array)
        bottom_right = True

    top = True
    if top_left and top_right:
        top_array = np.concatenate((top_left_array, top_right_array), axis=1)
    elif top_left:
        top_array = top_left_array
    elif top_right:
        top_array = top_right_array
    else:
        top = False   

    bottom = True
    if bottom_left and bottom_right:
        bottom_array = np.concatenate((bottom_left_array, bottom_right_array), axis=1)
    elif bottom_left:
        bottom_array = bottom_left_array
    elif bottom_right:
        bottom_array = bottom_right_array
    else:
        bottom = False  
 
    if top and bottom:
        spread_array = np.concatenate((top_array, bottom_array))
    elif top:
        spread_array = top_array
    elif bottom:
        spread_array = bottom_array
    
    spread_list = np.ndarray.flatten(spread_array).tolist()
    return spread_list


def get_farm_data_list(spread_list: list, all_alerts_list: list, time_data_list: list, house_shape: list) -> list:
    farm_data_list = []

    max_index = spread_list.index(max(spread_list))
    current_index = 0
    for s_point in spread_list:
        start = 0
        stop = house_shape[0]
        for h in range(house_shape[1]):
            if current_index in range(start, stop) and max_index in range(start, stop):
                scaling_array = s_point * np.random.uniform(low=1, high=1.15, size=np.array(all_alerts_list).shape)
            else:
                scaling_array = s_point * np.random.uniform(low=0.85, high=1, size=np.array(all_alerts_list).shape)
            start += house_shape[0]
            stop += house_shape[0]
        
        mic_data_list = np.around(scaling_array * all_alerts_list).astype(int).tolist()

        for mic_data, time_data_str in zip(mic_data_list, time_data_list):
            farm_data_list.append(f'{time_data_str},{mic_data[0]},{mic_data[1]},{mic_data[2]},{mic_data[3]},{mic_data[4]}')

        current_index += 1
    return farm_data_list


def create_house_csv_files(directory: str, farm_data_list: list, house_shape: list):
    farm_data_list_len = len(farm_data_list)
    for n in range(house_shape[1]):
        house_number = n + 1
        house_path = f'{directory}/house{house_number}'
        for mic_num in range(house_shape[0]):
            filename = f'{house_path}/mic{mic_num}.csv'
            data_list = []
            for line_num in range(int(farm_data_list_len/(house_shape[0] * house_shape[1]))):
                line = farm_data_list.pop(0)
                line = f'{mic_num},{line}'
                data_list.append(line)
            
            create_csv_file(filename, data_list)

    return


def create_complex(filepath: str, farm_amount: int, house_shape: list):
    for n in range(farm_amount):
        farm_num = n + 1
        _, all_alerts_list, time_data_list = gen_data()
        spread_list = get_spread_list(house_shape[0], house_shape[1])
        farm_data_list = get_farm_data_list(spread_list, all_alerts_list, time_data_list, house_shape)
        directory = f'{filepath}/farm{farm_num}'
        create_house_csv_files(directory, farm_data_list, house_shape)


if __name__ == "__main__":
    # create_complex('./core/data/generated_data/complex1', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex2', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex3', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex4', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex5', 6, [16, 8])
    # create_complex('./core/data/generated_data/complex6', 6, [16, 8])
    # create_complex('./core/data/generated_data/complex7', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex8', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex9', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex10', 3, [24, 5])
    # create_complex('./core/data/generated_data/complex11', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex12', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex13', 1, [16, 1])
    # create_complex('./core/data/generated_data/complex16', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex17', 6, [16, 4])
    # create_complex('./core/data/generated_data/complex18', 6, [16, 4])