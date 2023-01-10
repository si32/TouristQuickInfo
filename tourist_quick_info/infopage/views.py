import os
import json
import requests
import environ

from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from .models import User, Country, City, Location
from django.views.decorators.csrf import csrf_exempt


# Tokens in .env file
env = environ.Env()
environ.Env().read_env()

# Login/Logout/Register
def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "infopage/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "infopage/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]

        if password != request.POST["confirm_password"]:
            return render(request, "infopage/register.html", {
                "message": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "infopage/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "infopage/register.html")


# Create your views here.
def index(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        locations = user.user_locations.all().filter(show_hide=True).order_by("order")

        return render(request, "infopage/index.html", {
            "locations": locations,
        })
    else:
        return render(request, "infopage/login.html")

@login_required
def add_location(request):
    """ Add new location for user in db """
    if request.method == "POST":
        country_name = request.POST["country_name"]
        country_code = request.POST["country_code"]
        country_latitude = float(request.POST["country_latitude"])
        country_longitude = float(request.POST["country_longitude"])
        country_population = request.POST["country_population"]

        city_name = request.POST["city_name"]
        city_latitude = request.POST["city_latitude"]
        city_longitude = float(request.POST["city_longitude"])
        city_population = float(request.POST["city_population"])
        city_timezone = request.POST["city_timezone"]

        if "is_home" in request.POST:
            location_is_home = True
        else:
            location_is_home = False

        user = request.user

        try:
            country = Country.objects.get(name=country_name)
        except Country.DoesNotExist:
            country = Country.objects.create(
                name=country_name,
                country_code=country_code,
                latitude=country_latitude,
                longitude=country_longitude,
                population=country_population
                )
        try:
            city = City.objects.get(name=city_name, country=country)
        except City.DoesNotExist:
            city = City.objects.create(
                name=city_name,
                latitude=city_latitude,
                longitude=city_longitude,
                population=city_population,
                timezone=city_timezone,
                country=country
            )
        try:
            location = Location.objects.get(user=user, country=country, city=city)
        except Location.DoesNotExist:
            # try:
            user = User.objects.get(username=request.user)
            user_locations = user.user_locations.all().order_by("-order")
            if user_locations:
                order = int(user_locations[0].order) + 1
            else:
                order = 1


            location = Location.objects.create(
                user=user,
                order=order,
                country=country,
                city=city,
                is_home=location_is_home,
                show_hide=True
            )

        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    else:
        return HttpResponseRedirect(reverse("index"))

@login_required
def is_home(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        locations = user.user_locations.all()

        for location in locations:
            if location.is_home:
                user_has_home_location = True
                user_home_location_city = location.city.name
                user_home_location_timezone = location.city.timezone

                return JsonResponse({
                "user_has_home_location": user_has_home_location,
                "user_home_location_timezone": user_home_location_timezone,
                "user_home_location_city": user_home_location_city
                })

        return JsonResponse({
            "user_has_home_location": False
        })

@login_required
def profile(request, user_id):
    user = User.objects.get(username=request.user)
    locations = user.user_locations.all().order_by("order")

    return render(request, "infopage/profile.html", {
        "locations": locations
    })

@login_required
def update_locations(request):
    user = request.user

    if request.method == "PUT":
        locations = json.loads(request.body).get("locations")
        for location in locations:
            order = location["order"]
            city_name, country_name = location["location"].strip(")").split("(")
            country =  Country.objects.get(name=country_name)
            city =  City.objects.get(name=city_name)
            is_home = location.get("is_home")
            show_hide = location["show_hide"]

            try:
                Location.objects.get(user=user, order=order, country=country, city=city, is_home=is_home, show_hide=show_hide)
            except Location.DoesNotExist:
                print("start update")
                loc = Location.objects.get(user=user, country=country, city=city)
                loc.order = order
                loc.is_home = is_home
                loc.show_hide = show_hide
                loc.save()

        return HttpResponse(status=204)

    elif request.method == "DELETE":
        location = json.loads(request.body)
        print(location)
        city_name, country_name = location["location"].strip(")").split("(")
        country =  Country.objects.get(name=country_name)
        city =  City.objects.get(name=city_name)

        loc_for_del = Location.objects.get(user=user, country=country, city=city)
        loc_for_del.delete()

        return HttpResponse(status=204)
    else:
        return HttpResponseRedirect(reverse("index"))


# weather
@login_required
def weather(request):
    if request.method == "POST":
        location = json.loads(request.body)
        params = {
            "key": env("WEATHER_KEY"),
            "q": f'{location.get("city")}&q={location.get("country")}',
            "days": 5
        }
        r = requests.get("http://api.weatherapi.com/v1/forecast.json", params=params)
        print(r.url)
        data = r.text
        return HttpResponse(data)
    else:
        return HttpResponseRedirect(reverse("index"))
