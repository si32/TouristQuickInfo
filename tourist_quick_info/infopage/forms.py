from django import forms


class Price(forms.Form):
    taxi_price = forms.DecimalField(decimal_places=2, min_value=0, required=False)
    restaurant_price = forms.DecimalField(decimal_places=2, min_value=0, required=False)
