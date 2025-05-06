let login = document.getElementById('login-form');

if(login) {
    login.addEventListener('submit', function(event) {
        let username = document.getElementById('username');
        let password = document.getElementById('password');

        event.preventDefault();
        username = username.value;
        password = password.value;

        let errStatus = false;
        if (!username || !password) errStatus = true;
        if (typeof username !== "string" || typeof password !== "string") errStatus = true;

        username = username.trim();
        password = password.trim();

        if (!username || !password) errStatus = true;

        const uname = /^[a-zA-Z0-9]+$/;
        if (!uname.test(username)) errStatus = true;
        if (username.length < 5 || username.length > 20) errStatus = true;

        if (errStatus) {
            if (!document.getElementById('error')) {
                const err = document.createElement('p');
                err.id = 'error';
                err.innerHTML = "Invalid username or password.";
                document.body.appendChild(err);
            }
        } else {
            login.submit();
        }
    });
}

let registrationForm = document.getElementById('registration-form');
let errors = document.getElementById('errors');

let errList = [];

if (registrationForm) {
    registrationForm.addEventListener('submit', async function(event) {
        errors.innerHTML = '';
        errList = [];
        errors.hidden = true;
        event.preventDefault();
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPass').value;
        let email = document.getElementById('userEmail').value;
        let acknowledged = document.getElementById('acknowledged');

        if (!username) errList.push("Must enter a username.");
        if (!password) errList.push("Must enter a password.");
        if (typeof username !== "string" || typeof password !== "string") errList.push("Invalid username or password.")
        username = username.trim();
        password = password.trim();
    
        const uname = /^[a-zA-Z0-9]+$/;
        if (!username || !uname.test(username)) errList.push("Invalid username.");

        const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        if (!password || !pass.test(password)) errList.push("Invalid password.");

        if (username.length < 5 || username > 20) errList.push("Username must be between 5 and 20 characters.");

        if (password !== confirmPassword) errList.push("Password and confirmed password are not the same.");
        
        const emailFormat = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
        if (!emailFormat.test(email)) errList.push("Invalid email.");

        if (!acknowledged.checked) errList.push("You must check the box to acknowledge the rules.");

        if (errList.length === 0) {
            registrationForm.submit();
        } else {
            errList.forEach((element) => {
                const item = document.createElement('li');
                item.innerHTML = element;
                errors.appendChild(item);
            })

            errors.hidden = false;
        }
    })
}