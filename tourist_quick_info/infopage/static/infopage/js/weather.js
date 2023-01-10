document.addEventListener('DOMContentLoaded', function() {

    let curent_weather_divs = document.querySelectorAll('.current-weather');
    curent_weather_divs.forEach(curent_weather_div => {

        let city_name = curent_weather_div.dataset.city;
        let country_name = curent_weather_div.dataset.country;

        let csrftoken = getCookie('csrftoken');
        fetch('/weather', {
            method: "POST",
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                city: city_name,
                country: country_name
            })
        })
        .then(result => result.json())
        .then(data => {
            let temp = document.createElement('div');
            temp.setAttribute('class', 'temp');
            temp.innerHTML = `
                <div>
                    <b title='Temperature'>T: </b>${data.current.temp_c}&#8451; / ${data.current.temp_f}&#8457;
                </div>
                <div>
                    <b title='Wind'>W: </b>${data.current.wind_kph} k/h
                    <b title='Humidity'>H: </b>${data.current.humidity} %
                </div>`;
            curent_weather_div.appendChild(temp);

            let condition = document.createElement('div');
            condition.setAttribute('class', 'condition');
            condition.innerHTML = `
                <img src=${data.current.condition.icon} title=${data.current.condition.text}>
                ${data.current.condition.text}`;
            curent_weather_div.appendChild(condition);

            let forecast = document.createElement('div');
            forecast.setAttribute('class', 'forecast');
            curent_weather_div.appendChild(forecast);
            let forecastdays = data.forecast.forecastday;
            forecastdays.forEach(forecastday => {
                let fday = document.createElement('div');
                fday.setAttribute('class', 'forecastday');
                let date = new Date(forecastday.date);
                fday.innerHTML = `
                    <div>${date.toLocaleDateString('en-EN', {weekday:'short'})} ${date.toLocaleDateString('sv-SE', {month:'numeric', day:'numeric'})}</div>
                    <div>
                    <img src=${forecastday.day.condition.icon} title=${forecastday.day.condition.text}>
                    </div>
                    <div>${forecastday.day.avgtemp_c}&#8451;</div>
                `
                forecast.appendChild(fday);
            })



        })
    })

})
