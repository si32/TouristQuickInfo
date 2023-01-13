document.addEventListener('DOMContentLoaded', function() {

    let current_currency_divs = document.querySelectorAll('.current-currency')
    current_currency_divs.forEach(current_currency_div => {
        update_currency(current_currency_div);
    })

})


function update_currency(current_currency_div) {

    current_currency_div.innerHTML = '';

    let country = current_currency_div.dataset.country;

    let csrftoken = getCookie('csrftoken');
    fetch('/currency', {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        mode: "same-origin",
        body: JSON.stringify({
            country: country
        })
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data);

        if (Object.keys(data).length === 0) {
            current_currency_div.innerHTML = "<small>National currency: </small>United states dollar (USD)";
        } else if (data.code_home === false && data.base === data.code) {
            current_currency_div.innerHTML = "<small>National currency: </small>United states dollar (USD)";
        } else if (data.code_home === false) {
            current_currency_div.innerHTML = `<small>National currency: </small>${data.national_currency} (${data.code})`;
            let currency_div = document.createElement('div');
            currency_div.setAttribute("class", "Rates");
            currency_div.innerHTML = `
                1 ${data.base} = ${(data.rates[data.code]).toFixed(3)} ${data.code}
            `;
            current_currency_div.appendChild(currency_div);
        } else if (data.code === data.code_home) {
            current_currency_div.innerHTML = `<small>National currency: </small>${data.national_currency} (${data.code})`;
            let currency_div = document.createElement('div');
            currency_div.setAttribute("class", "Rates");
            currency_div.innerHTML = `1 ${data.base} = ${(data.rates[data.code]).toFixed(3)} ${data.code}`;
            current_currency_div.appendChild(currency_div);
        } else if (data.code === data.base) {
            current_currency_div.innerHTML = `<small>National currency: </small>${data.national_currency} (${data.code})`;
            let currency_div = document.createElement('div');
            currency_div.setAttribute("class", "Rates");
            currency_div.innerHTML = `1 ${data.base} = ${(data.rates[data.code_home]).toFixed(3)} ${data.code_home}`;
            current_currency_div.appendChild(currency_div);
        } else if (data.base === data.code_home) {
            current_currency_div.innerHTML = `<small>National currency: </small>${data.national_currency} (${data.code})`;
            let currency_div = document.createElement('div');
            currency_div.setAttribute("class", "Rates");
            currency_div.innerHTML = `
                1 ${data.base} = ${(data.rates[data.code]).toFixed(3)} ${data.code}
            `;
            current_currency_div.appendChild(currency_div);
        } else {
            current_currency_div.innerHTML = `<small>National currency: </small>${data.national_currency} (${data.code})`;
            let currency_div = document.createElement('div');
            currency_div.setAttribute("class", "Rates");
            currency_div.innerHTML = `
                1 ${data.base} = ${(data.rates[data.code]).toFixed(3)} ${data.code}
                <br>
                1 ${data.base} = ${(data.rates[data.code_home]).toFixed(3)} ${data.code_home}
                <br>
                1 ${data.code_home} = ${(parseFloat(data.rates[data.code]) / parseFloat(data.rates[data.code_home])).toFixed(3)} ${data.code}
            `;
            current_currency_div.appendChild(currency_div);
        }
    })

}


function refresh_currency(event) {
    let btn = event.target;
    let current_currency_div = btn.previousElementSibling;
    update_currency(current_currency_div);
}
