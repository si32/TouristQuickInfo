

document.addEventListener('DOMContentLoaded', function() {

    //csrf token
    let csrftoken = getCookie('csrftoken');

    // fire change event to update db
    let ev = new Event('change');

    let tbody = document.querySelector('#profile');

    let btns = document.querySelectorAll('.order_btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            let row = btn.parentElement.parentElement;
            let row_index = row.rowIndex - 1;
            let rows = tbody.rows;
            let direction = btn.dataset.direction;

            if (direction === 'up') {
                if (row_index > 0) {
                    let new_index = row_index - 1;
                    tbody.insertBefore(rows[row_index], rows[new_index]);
                    document.querySelector('table').dispatchEvent(ev);
                }
            } else {
                if (row_index < (rows.length - 1)) {
                let new_index = row_index + 1;
                tbody.insertBefore(rows[new_index], rows[row_index]);
                document.querySelector('table').dispatchEvent(ev);

                }
            }
        })
    });

    // delete row in a table
    let del_btns = document.querySelectorAll('.del_btn');
    del_btns.forEach(del_btn => {
        del_btn.addEventListener('click', () => {
            let row = del_btn.parentElement.parentElement;

            let location = row.children[1].innerText;

            // Delete from db
            fetch('/update_locations', {
                method: 'DELETE',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    location: location
                })
            })
            .then(() => {
                row.remove();
                document.querySelector('table').dispatchEvent(ev);
                console.log('delete ok');
            })

        })
    });

    // Save changes in db
    let table = document.querySelector('table');
    table.addEventListener('change', (event) => {
        let locations = [];


        let rows = table.rows;
        // start with 1 to ignore headings
        for (let i=1; i<rows.length; i++) {
            let location = {};
            location.order = i;
            location.location = rows[i].children[1].innerText;
            location.is_home = rows[i].children[2].children[0].checked
            location.show_hide = rows[i].children[3].children[0].checked

            locations.push(location);
        }
        // Передать объект
        fetch('/update_locations', {
            method: 'PUT',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
              locations: locations
            })
          })
          .then(() => {
            console.log('update db ok');
          })

    })

})
