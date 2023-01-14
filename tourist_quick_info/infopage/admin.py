from django.contrib import admin
from .models import User, Location, Country, City, CurrencyCode, TaxiPrice, RestaurantPrice

# Register your models here.
admin.site.register(User)
admin.site.register(Location)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(CurrencyCode)
admin.site.register(TaxiPrice)
admin.site.register(RestaurantPrice)
