document.addEventListener('DOMContentLoaded', function() {

    let price_divs = document.querySelectorAll('.price');
    price_divs.forEach(price_div => {

        let city_id = price_div.dataset.city_id;
        let csrftoken = getCookie('csrftoken');
        fetch('/get_feedback', {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: "same-origin",
            body: JSON.stringify({
                city_id: city_id
            })
        })
        .then(response => response.json())
        .then(data => {
            let taxi_price_div = price_div.firstElementChild;
            let restaurant_price_div = taxi_price_div.nextElementSibling;
            if (data.taxi_price_avg) {
                taxi_price_div.innerHTML = `Taxi price: ${parseFloat(data.taxi_price_avg).toFixed(1)} ` + taxi_price_div.innerHTML + ` <small>(${data.taxi_price_quantity_feedback} review)</small>`;
            } else {
                taxi_price_div.innerHTML = `Taxi price: No reviews`;
            }
            if (data.restaurant_price_avg) {
                restaurant_price_div.innerHTML = `Restaurant price: ${parseFloat(data.restaurant_price_avg).toFixed(1)} ` + restaurant_price_div.innerHTML + ` <small>(${data.restaurant_price_quantity_feedback} review)</small>`;
            } else {
                restaurant_price_div.innerHTML = `Restaurant price: No reviews`;
            }
        })

    })

})
