# Generated by Django 4.1.4 on 2023-01-10 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('infopage', '0002_currencycodes'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CurrencyCodes',
            new_name='CurrencyCode',
        ),
    ]
