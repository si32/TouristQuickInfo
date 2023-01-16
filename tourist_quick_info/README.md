# Tourist Quick Information
#### Video Demo:  <https://youtu.be/>
#### Description: Web-App to help people to get necessary information about new city quickly

## General information

What information do you need when you arrive to a new city or a country?

First of all, you want to know:
1. The local time (and the difference with you home city).
2. The current weather and forecast for a few next days.
3. The local currency and the currency rate with your home currency and with a dollar (like an international currency).
4. And some orienteer in local average prices (such basic thing like taxi and restaurant).

This App is called Tourist Quick Info (TQI) and provide all this information based on different APIs and users’ reviews.

Add new location and get quick information about city.
Add you home location and get to know difference in time and currency rate in new city with you home currency!

## How to run
Before run server make this command to install necessary packages:

    pip install -r requirements.txt

To run server just use command:

    python manage.py runserver

## Distinctiveness and Complexity

1. For each feature I use their own js file to separate and control code. But in this way, you should make attention to order of your js files.
2. Adding new location I use API to get list of countries and dynamically form the list of countries (optional for select).
3. After choosing a country I give hints about possible cities after entering two letters, dynamically changing the datalist for input type=search.
4. For adding a new location I use modal window from Bootstrap.
5. I use two models to save information about countries and cities to not use API for the same information twice and reduce quantity of requests and increase app working speed.
6. I use another model - Location. The location model stores data about the cities that a particular user has selected. As well as information about the home location and the need to show the location in app.
7. To keep security information about API_KEYs I save them in environment variables (environ library).
8. In this case in js scripts I make fetch request to my back-end server and there I make API request using python requests library. After that I can do some logic with response data and send data to front-end in form I need.
9. For security I figured out how to get the cssrf_token from the cookie and pass it in the headers of my requests so as not to use @csrf_exempt.
10. I worked with JS Data object to display real-time time given local timezone and write a function find the time difference between timezones.
11. I made a csv file from ISO 4217 about currency codes and filled in the model using Python (I commented out the path so that it was not available). One-time action, this table does not change. Knowing the city and country I find from the database, the currency code and use it for the API request.
12. I store user reviews about the prices of taxi and restaurants in the tables TaxiPrice and RestaurantPrice, respectively. Accordingly, I can find out if the user left a review. If left, then I will give you the opportunity to change (that is, the user can leave only one review for each city). From these tables I can calculate the number of reviews for each city through **.aggregate(Sum())** and the average price through **.aggregate(Avg())**
13. To collect price feedback I use a django form to check if the decimal values are being entered.
14. I wrote a user's personal page, where the user can change the home location, configure the display of locations and their order, as well as the ability to delete locations from the database. All changes will be saved in the database. I Wrote Changing the Order of Rows in a Table Using JS.
15. I used bootstrap to mobile-responsive (change the screen, including the menu bar)

## Interesting moments:
1. You can write **@property** for Model class and use this property to get some information from another Model data.
2. **“hide.bs.modal”** event handler to clear bootstrap modal form.
3. Checking that query set is empty:

        Object.keys(data).length === 0
4. When I change order of tables rows it doesn’t fire "change" event. So, you can fire it by yourself:

        let ev = new Event('change');
        document.querySelector('table').dispatchEvent(ev);
