# Generated by Django 4.1.4 on 2023-07-03 01:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('integration', '0002_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='upload_date',
            field=models.DateTimeField(default=datetime.datetime(2023, 7, 3, 1, 33, 39, 500146)),
        ),
    ]