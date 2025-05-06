import bcrypt from "bcryptjs";
import { connectToDb } from "../config/mongoConnection.js";

export const seedUsers = async () => {
    const db = await connectToDb();
    const users = db.collection('users');
    const salt = 16;

    const date = new Date();
    const newDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear())}`;

    const hours = date.getHours() % 12 || 12;
    const time = `${hours}:${String(date.getMinutes()).padStart(2, '0')}${date.getHours() < 12 ? 'AM' : 'PM'}`
    const login = `${newDate} ${time}`;

    if (!(await users.findOne({ username: 'admin1'}))) {
        users.insertOne({
            username: 'admin1',
            password: (await bcrypt.hash("Pass@123", salt)),
            admin: true,
            email: "test1@gmail.com",
            dateCreated: login,
            reports: [],
            comments: []
        });
    }
    
    if (!(await users.findOne({ username: 'user2'}))) {
        users.insertOne({
            username: "user2",
            password: (await bcrypt.hash('testPassword!123', salt)),
            admin: true,
            email: "test2@gmail.com",
            dateCreated: login,
            reports: [],
            comments: []
        });
    }
}