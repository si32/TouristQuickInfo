# Generated by Django 4.1.4 on 2023-01-14 15:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('infopage', '0004_taxiprice_reataurantprice'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ReataurantPrice',
            new_name='RestaurantPrice',
        ),
    ]
