import { Router } from "express";
import { connectToDb } from "../config/mongoConnection.js";

const db = await connectToDb();
const collection = db.collection('users');

const router = Router();

router.route('').get(async (req, res) => {
    const users = await collection.find({ admin: false }).toArray();
    return res.render('users', { title: "User Database", users });
})
.post(async (req, res) => {

})

export default router;