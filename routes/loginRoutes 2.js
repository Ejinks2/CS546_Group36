import { Router } from 'express';
const router = Router();
import { login } from "../data/users.js";

router
    .route('')
        .get(async (req, res) => {
            let error = "";
            if (req.status === 400) error = "Could not log in.";
            res.render('login', {
                error, title: "Login"
            });
        })
        .post(async (req, res) => {
            const user = req.body;
            try {
                const info = await login(user.username, user.password);
                if (info) {
                    req.session.user = { username: info.username, admin: info.admin };
                    if (req.session.user.admin) return res.redirect('/admin');
                    return res.redirect('/');
                }
            } catch (e) {
                return res.status(400).redirect('/login');
            }
        });

export default router;