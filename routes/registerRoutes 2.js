import { Router } from "express";
const router = Router();
import { register } from "../data/users.js";

router.route('').get(async (req, res) => {
    return res.render('register');
})
.post(async (req, res) => {
    
})

export default router;