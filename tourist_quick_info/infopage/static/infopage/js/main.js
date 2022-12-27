const MILLISECONDS = 1000;
const SECONDS = 3600;

document.addEventListener('DOMContentLoaded', function() {

    // Times in locations
    let locs_timezone = document.querySelectorAll('.location_city_timezone')

    // Find home location
    let home_loc;
    locs_timezone.forEach(loc_timezone => {
        if (loc_timezone.dataset.home === "true") {
            home_loc = loc_timezone;
        }
    })

    locs_timezone.forEach(loc_timezone => {
        let t = loc_timezone.dataset.timezone;
        if (loc_timezone === home_loc) {
            setInterval(function() {
                myTimer(loc_timezone, t, offset=false);
            }, 1000);
        } else {
            let offset = getOffset(loc_timezone, home_loc);
            setInterval(function() {
                myTimer(loc_timezone, t, offset);
            }, 1000);
        }
    });

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
function getOffset(loc, home) {
    let d1 = new Date();
    let d2 = new Date();
    let home_time = new Date(d1.toLocaleString("sv-SE", {timeZone: home.dataset.timezone}));
    let loc_time = new Date(d2.toLocaleString("sv-SE", {timeZone: loc.dataset.timezone}));

    let offset = (loc_time.getTime() -home_time.getTime());

    offset = offset / MILLISECONDS / SECONDS;
    return offset;
}
