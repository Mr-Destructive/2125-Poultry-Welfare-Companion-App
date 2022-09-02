from .models import Data
import datetime as dt

def adjust():
    alld = Data.objects.all()
    print(f'\nBEFORE:\n{alld[0:10]}')
    for d in alld:
        d.timestamp += dt.timedelta(days = 60)
    # NOTE: be careful lol
    print(f"\nDo you wish to change these values?\n")
    print(f'\nAFTER:\n{alld[0:10]}\n')
    print("\'Y\' or \'N\'")
    prompt = input()
    if (prompt == 'Y'):
        for d in alld:	
            d.save()