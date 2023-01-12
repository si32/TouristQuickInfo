from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add_location", views.add_location, name="add_location"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("is_home", views.is_home, name="is_home"),
    path("update_locations", views.update_locations, name="update_locations"),
    path("weather", views.weather, name="weather"),
    path("currency", views.currency, name="currency"),
    # adding currency code - country in db
    # path("create_currency_db", views.create_currency_db),
]
