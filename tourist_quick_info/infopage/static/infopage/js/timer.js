// in 1 second
const MILLISECONDS = 1000;
// in 1 hour
const SECONDS = 3600;

document.addEventListener('DOMContentLoaded', function() {

    // Times in locations
    let locs_timezone = document.querySelectorAll('.location_city_timezone')

    // Find home location
    let home_location_timezone = false;
    fetch('/is_home')
    .then(response => response.json())
    .then(data => {
        let user_has_home_location = data.user_has_home_location;
        if (user_has_home_location) {
            home_location_timezone = data.user_home_location_timezone;
        }

        locs_timezone.forEach(loc => {
            let loc_timezone = loc.dataset.timezone;
            if ((loc.dataset.home) || (home_location_timezone === false)) {
                setInterval(function() {
                    myTimer(loc, loc_timezone, offset=false);
                }, 1000);
            } else {
                let offset = getOffset(loc_timezone, home_location_timezone);
                setInterval(function() {
                    myTimer(loc, loc_timezone, offset);
                }, 1000);
            }
        });
    })

})


// My custom timer
function myTimer(obj, t, offset) {
    let d = new Date();
    d.setSeconds(0, 0);

    if (offset === false) {
        obj.innerHTML = `<small>${d.toLocaleDateString("de-DE", {timeZone: t})} (${d.toLocaleDateString("en-EN", {timeZone: t, weekday: "short"})})</small> <larger>${d.toLocaleTimeString("it-IT", {hour: '2-digit', minute: '2-digit', timeZone: t})}</larger>`;
    } else {
        if (parseFloat(offset) >= 0) {
            obj.innerHTML = `<small>${d.toLocaleDateString("de-DE", {timeZone: t})} (${d.toLocaleDateString("en-EN", {timeZone: t, weekday: "short"})})</small> <larger>${d.toLocaleTimeString("it-IT", {hour: '2-digit', minute: '2-digit', timeZone: t})}</larger> <small>(+${offset}h)</small>`;
        } else {
            obj.innerHTML = `<small>${d.toLocaleDateString("de-DE", {timeZone: t})} (${d.toLocaleDateString("en-EN", {timeZone: t, weekday: "short"})})</small> <larger>${d.toLocaleTimeString("it-IT", {hour: '2-digit', minute: '2-digit', timeZone: t})}</larger> <small>(${offset}h)</small>`;
        }
    }

}


// Differents between cities in hours
function getOffset(loc_timezone, home_timezone) {
    let d1 = new Date();
    let d2 = new Date();
    let home_time = new Date(d1.toLocaleString("sv-SE", {timeZone: home_timezone}));
    let loc_time = new Date(d2.toLocaleString("sv-SE", {timeZone: loc_timezone}));

    let offset = (loc_time.getTime() - home_time.getTime());

    offset = offset / MILLISECONDS / SECONDS;
    return offset;
}
