# Generated by Django 4.0.2 on 2022-02-12 22:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_delete_react_complex_name_complex_user_farm_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailydata',
            name='monitor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.monitor'),
        ),
        migrations.AlterField(
            model_name='hourlydata',
            name='monitor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.monitor'),
        ),
    ]
