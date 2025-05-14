import { connectToDb } from "../config/mongoConnection.js";
import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';
import xss from 'xss';

export const login = async (username, password) => {
    const db = await connectToDb();
    const users = db.collection('users');

    if (!username || !password) throw "Invalid username or password.";
    if (typeof username !== "string" || typeof password !== "string") throw "Invalid username or password.";
    username = username.trim();
    password = password.trim();

    username = username.toLowerCase();

    if (!username || !password) throw "Invalid username or password.";
    username = xss(username);
    password = xss(password);


    const uname = /^[a-zA-Z0-9]+$/;
    if (!uname.test(username)) throw "";
    if (username.length < 5 || username.length > 20) throw "Username"

    const user = await users.findOne({ username });

    if (!user) throw "Invalid username or password.";

    if (!(await bcrypt.compare(password, user.password))) throw "Invalid username or password.";
    return { username: user.username, admin: user.admin };
}

export const register = async (username, password, email) => {
    const db = await connectToDb();
    const users = db.collection('users');

    if (!username || !password) throw "Invalid username or password.";
    if (typeof username !== "string" || typeof password !== "string") throw "Invalid username or password.";
    username = username.trim();
    password = password.trim();

    username = username.toLowerCase();

    if (!username || !password) throw "Invalid username or password.";
    username = xss(username);
    password = xss(password);
    email = xss(email);

    const uname = /^[a-zA-Z0-9]+$/;
    if (!uname.test(username)) throw "";
    if (username.length < 5 || username > 20) throw "Username"

    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pass.test(password)) throw "Invalid password. Must contain at least one lowercase, one uppercase, one digit, and one special character and must be greater than 8 characters long.";

    const emailFormat = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
    if (!email) throw "Must enter an email.";
    if (!emailFormat.test(email)) throw "Invalid email.";

    const duplicateName = await users.findOne({ username });
    if (duplicateName) throw "Username already taken.";

    const duplicateEmail = await users.findOne({ email });
    if (duplicateEmail) throw "Email already taken.";

    const date = new Date();
    const newDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear())}`;

    const hours = date.getHours() % 12 || 12;
    const time = `${hours}:${String(date.getMinutes()).padStart(2, '0')}${date.getHours() < 12 ? 'AM' : 'PM'}`
    const login = `${newDate} ${time}`;

    const salt = 16;

    const user = {
        username,
        password: await bcrypt.hash(password, salt),
        admin: false,
        email,
        dateCreated: login,
        reports: [],
        comments: []
    };

    let newUser = await users.insertOne(user);
    if(!newUser.acknowledged) throw "Unable to add user.";
}

export const getUserById = async (userId) => {
    const db = await connectToDb();
    const users = db.collection('users');
    
    if (!userId) throw "Invalid user ID";
    
    try {
        const user = await users.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        
        // Don't return sensitive information
        return {
            _id: user._id,
            username: user.username,
            admin: user.admin,
            dateCreated: user.dateCreated
        };
    } catch (error) {
        throw "Invalid user ID format";
    }
};