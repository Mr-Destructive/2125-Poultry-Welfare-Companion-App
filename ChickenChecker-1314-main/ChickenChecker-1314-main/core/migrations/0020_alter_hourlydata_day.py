# Generated by Django 4.0.2 on 2022-02-23 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_alter_hourlydata_day'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hourlydata',
            name='day',
            field=models.DateField(),
        ),
    ]
