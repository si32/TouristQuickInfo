document.addEventListener("DOMContentLoaded", function() {

    get_countries();

    // cities
    let cities = document.querySelector('#cities');
    cities.addEventListener('keyup', () => {
        let search_text = cities.value;
        if (search_text.length >= 2) {
            console.log('start');
            fetch(`https://data-api.oxilor.com/rest/search-regions?searchTerm=${search_text}&countryCode=LK&type=city`, {
                headers: {
                    'Authorization': 'Bearer -yY-uX_pqjH0feej_0050WXLxd_pcM',
                    'Accept-Language': 'en'
                },
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                console.log('get');
                let cities_list = document.querySelector('#cities_list');
                cities_list.innerHTML = '';
                for (let city of data) {
                    let city_name = document.createElement('option');
                    city_name.value = city.name;
                    cities_list.appendChild(city_name);
                }

            })
        }

    })

})

function get_countries() {
    fetch('https://data-api.oxilor.com/rest/countries', {
        headers: {
            'Authorization': 'Bearer -yY-uX_pqjH0feej_0050WXLxd_pcM',
            'Accept-Language': 'en'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        let select = document.querySelector('#countries');
        for (let obj of data) {
            let country = document.createElement('option');
            country.value = `${obj.name}`.toLowerCase();
            country.innerHTML = `${obj.name}`;
            select.appendChild(country);
        }
    })
}
