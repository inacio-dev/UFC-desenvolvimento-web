# Generated by Django 4.1.4 on 2023-07-05 19:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('integration', '0011_alter_image_id_alter_image_upload_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='image',
            name='upload_date',
            field=models.DateTimeField(default=datetime.datetime(2023, 7, 5, 19, 33, 5, 766883)),
        ),
    ]
