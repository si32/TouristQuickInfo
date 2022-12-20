from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass


class Country(models.Model):
    name = models.CharField(max_length=64)
    country_code = models.CharField(max_length=8)
    latitude = models.DecimalField(max_digits=6, decimal_places=4)
    longitude = models.DecimalField(max_digits=6, decimal_places=4)
    population = models.PositiveIntegerField()


class City(models.Model):
    name = models.CharField(max_length=64)
    latitude = models.DecimalField(max_digits=6, decimal_places=4)
    longitude = models.DecimalField(max_digits=6, decimal_places=4)
    population = models.PositiveIntegerField()
    timezone = models.CharField(max_length=64, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)


class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_locations")
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    home = models.BooleanField()
