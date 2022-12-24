import os

from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from .models import User, Country, City, Location

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

        if password != request.POST["confirm_password"]:
            return render(request, "infopage/register.html", {
                "message": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            country = Country.objects.create(
                name=country_name,
                country_code=country_code,
                latitude=country_latitude,
                longitude=country_longitude,
                population=country_population
                )
            city = City.objects.create(
                name=city_name,
                latitude=city_latitude,
                longitude=city_longitude,
                population=city_population,
                timezone=city_timezone,
                country=country
            )
            location = Location.objects.create(
                user=user,
                country=country,
                city=city,
                is_home=True
            )

        except IntegrityError:
            return render(request, "infopage/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "infopage/register.html")

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        return render(request, "infopage/index.html")
    else:
        OXILOR_API_KEY=os.getenv("OXILOR_API_KEY")
        print(OXILOR_API_KEY)
        return render(request, "infopage/login.html")
