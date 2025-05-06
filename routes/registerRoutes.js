import { Router } from "express";
const router = Router();
import { register } from "../data/users.js";

router.route('').get(async (req, res) => {
    return res.render('register', { title: "Register" });
})
.post(async (req, res) => {
    try {
        const user = req.body;
        await register(user.username, user.password, user.userEmail);
        return res.redirect('/home');
    } catch (e) {
        return res.redirect('/register?registrationFailed=true');
    }
})

export default router;