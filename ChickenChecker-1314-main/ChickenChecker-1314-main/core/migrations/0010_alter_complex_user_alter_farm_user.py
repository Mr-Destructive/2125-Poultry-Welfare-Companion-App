# Generated by Django 4.0.2 on 2022-02-14 00:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0009_alter_farm_complex_delete_usertype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complex',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='complexes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='farm',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='farms', to=settings.AUTH_USER_MODEL),
        ),
    ]