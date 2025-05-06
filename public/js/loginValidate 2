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