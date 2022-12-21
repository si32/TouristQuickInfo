document.addEventListener("DOMContentLoaded", function() {

    get_countries();

    // cities
    let cities = document.querySelector('#cities');

    let countries = document.querySelector('#countries')
    countries.addEventListener('change', () => {
        cities.disabled = false;
        cities.value = "";
        let cities_list = document.querySelector('#cities_list');
        cities_list.innerHTML = '';
    })

    cities.addEventListener('keyup', () => {
        let search_text = cities.value;
        let option = countries.options[countries.selectedIndex];
        let countrycode = option.dataset.countrycode;
        let submit_btm = document.querySelector('#register_btn');
        submit_btm.disabled = true;
        document.querySelector('#cities').style.color = 'black';

        if (search_text.length >= 2) {
            fetch(`https://data-api.oxilor.com/rest/search-regions?searchTerm=${search_text}&countryCode=${countrycode}&type=city`, {
                headers: {
                    'Authorization': 'Bearer -yY-uX_pqjH0feej_0050WXLxd_pcM',
                    'Accept-Language': 'en'
                },
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                let cities_list = document.querySelector('#cities_list');
                cities_list.innerHTML = '';

                if (data.length == 0) {
                    document.querySelector('#cities').style.color = 'red';
                    submit_btm.disabled = true;

                } else {
                    for (let city of data) {
                        let city_name = document.createElement('option');
                        city_name.value = city.name;
                        cities_list.appendChild(city_name);
                        // Register if city in database
                        if (search_text === city.name) {
                            submit_btm.disabled = false;
                        }
                    }
                }

            })
        }
    })

    let cities_input = document.querySelector('#cities')
    cities_input.addEventListener('click', () => {
        if (cities_input.value == '') {
            cities_input.style.color = 'black';
        }
    })

})


// Get list of all contries to select
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
            country.setAttribute('data-countrycode', obj.countryCode);
            country.innerHTML = `${obj.name}`;
            select.appendChild(country);
        }
    })
}
