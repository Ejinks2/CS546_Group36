import { connectToDb } from "../config/mongoConnection.js";
import bcrypt from "bcryptjs";

export const login = async (username, password) => {
    const db = await connectToDb();
    const users = db.collection('users');

    if (!username || !password) throw "Invalid username or password.";
    if (typeof username !== "string" || typeof password !== "string") throw "Invalid username or password.";
    username = username.trim();
    password = password.trim();

    if (!username || !password) throw "Invalid username or password.";

    const uname = /^[a-zA-Z0-9]+$/;
    if (!uname.test(username)) throw "";
    if (username.length < 5 || username.length > 20) throw "Username"

    const user = await users.findOne({ username });

    if (!user) throw "Invalid username or password.";

    if (!(await bcrypt.compare(password, user.password))) throw "Invalid username or password.";
    return { username: user.username, admin: user.admin };
}

export const register = async (username, password) => {
    const db = await connectToDb();
    const users = db.collection('users');

    if (!username || !password) throw "Invalid username or password.";
    if (typeof username !== "string" || typeof password !== "string") throw "Invalid username or password.";
    username = username.trim();
    password = password.trim();

    if (!username || !password) throw "Invalid username or password.";

    const uname = /^[a-zA-Z0-9]+$/;
    if (!uname.test(username)) throw "";
    if (username.length < 5 || username > 20) throw "Username"

    const salt = 16;

    const user = {
        username,
        password: bcrypt.hash(password, salt),
        admin: false
    }

    let newUser = await users.insertOne(user);
    if(!newUser.acknowledged) throw "Unable to add user.";
}