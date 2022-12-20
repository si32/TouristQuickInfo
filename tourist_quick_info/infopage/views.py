from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from .models import User

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
        country = request.POST["country"]
        city = request.POST["city"]

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
        return render(request, "infopage/register.html")

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request, "infopage/index.html")
    else:
        return render(request, "infopage/login.html")
