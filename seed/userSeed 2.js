import bcrypt from "bcryptjs";
import { connectToDb } from "../config/mongoConnection.js";

export const seedUsers = async () => {
    const db = await connectToDb();
    const users = db.collection('users');
    const salt = 16;

    if (!(await users.findOne({ username: 'admin1'}))) {
        users.insertOne({
            username: 'admin1',
            password: (await bcrypt.hash("Pass@123", salt)),
            admin: true
        });
    }
    
    if (!(await users.findOne({ username: 'user2'}))) {
        users.insertOne({
            username: "user2",
            password: (await bcrypt.hash('testPassword!123', salt)),
            admin: true
        });
    }
}