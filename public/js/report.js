let form = document.getElementById('report');

if (form) {
    form.addEventListener('submit', (event) => {
        let errs = document.getElementById('errors');
        errs.hidden = true;
        event.preventDefault();

        const errors = [];

        let offense = document.getElementById('offense').value;
        let borough = document.getElementById('borough').value;
        let date = document.getElementById('date').value;
        let location = document.getElementById('location').value;
        let description = document.getElementById('description').value;

        if (!offense) errors.push("Must select an offense.");
        if (!borough) errors.push("Must select a borough.");
        if (!date) errors.push("Must select a date.");

        if (new Date(date) > new Date()) errors.push("Invalid date.");

        if (!location) errors.push("Must enter a location.");
        if (typeof location !== "string") errors.push("Invalid location.");
        location = location.trim();
        if (!location) errors.push("Invalid location.");

        if (location.length < 5) errors.push("Location must be at least 5 characters long.");

        if (!description) errors.push("Must enter a description.");
        if (typeof description !== "string") errors.push("Invalid description.");
        description = description.trim();
        if (!description) errors.push("Invalid description.");

        if (description.length < 10) errors.push("Description must be at least 10 characters long.");

        if (errors.length > 0) {
            errs.innerHTML = '';
            errs.hidden = false;
            errors.forEach(err => {
                li = document.createElement('li');
                li.innerHTML = err;
                errs.appendChild(li);
            })
        } else {
            errs.hidden = true;
            form.submit();
        }
    })
}