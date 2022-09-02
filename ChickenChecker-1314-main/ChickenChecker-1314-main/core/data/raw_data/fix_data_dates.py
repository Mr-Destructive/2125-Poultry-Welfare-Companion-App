from core.models import Data, House
import datetime as dt

def fix_dates():
    datas = list(Data.objects.all())
    datas.sort(key = lambda x: x.timestamp)
    changed = []
    counter = 0
    print(f'Original timestamps:')
    for d in datas:
        if (d.timestamp.hour >= 22):
            if (counter < 15):
                print(f'\t{d.timestamp}')
                counter += 1
            d.timestamp -= dt.timedelta(days = 1)
            changed.append(d)

    counter = 0
    print(f'\nNew timestamps:')
    for d in changed:
        if (counter < 15):
                print(f'\t{d.timestamp}')
                counter += 1
        
    # NOTE: be careful lol
    print(f"Do you wish to change these values?")
    print("\'Y\' or \'N\'")
    prompt = input()
    if (prompt == 'Y'):
        for d in changed:
            d.save()
    return 0