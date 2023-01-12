from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass


class Country(models.Model):
    name = models.CharField(max_length=64)
    country_code = models.CharField(max_length=8)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    population = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.id}: {self.name} {self.country_code} {self.latitude} {self.longitude} {self.population}"


class City(models.Model):
    name = models.CharField(max_length=64)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    population = models.PositiveIntegerField()
    timezone = models.CharField(max_length=64, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id}: {self.name} {self.latitude} {self.longitude} {self.population} {self.timezone}"


class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_locations")
    order = models.PositiveIntegerField()
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    is_home = models.BooleanField()
    show_hide = models.BooleanField()

    def __str__(self):
        return f"{self.id}: {self.user.username} {self.country.name} {self.city.name} {self.is_home} {self.show_hide} {self.order}"


class CurrencyCode(models.Model):
    code = models.CharField(max_length=3);
    currency = models.CharField(max_length=64)
    location = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.id}: {self.code} {self.currency} {self.location}"
