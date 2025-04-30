let login = document.getElementById('login-form');
let error = document.getElementById('error');

console.log(login);
if(login) {
    if (!username || !password) error.hidden = false;
    if (typeof username !== "string" || typeof password !== "string") error.hidden = false;
    username = username.trim();
    password = password.trim();

    if (!username || !password) error.hidden = false;

    const uname = /^[a-zA-Z0-9]+$/;
    if (!uname.test(username)) error.hidden = false;
    if (username.length < 5 || username > 20) error.hidden = false;

    if (!user) error.hidden = false;
    console.log("testing!");
}