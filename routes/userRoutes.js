import { Router } from "express";
import { connectToDb } from "../config/mongoConnection.js";

const userData = "http://localhost:3000/users/data";

const db = await connectToDb();
const collection = db.collection('users');

const router = Router();

router.route('').get(async (req, res) => {
    const users = await collection.find({}).toArray();
    return res.render('users', { title: "User Database", users });
})
.post(async (req, res) => {
    return res.redirect('/');
})

router.route('/data').get(async (req, res) => {
    const users = await collection.find({}).toArray();
    return res.json(users);
});

export default router;