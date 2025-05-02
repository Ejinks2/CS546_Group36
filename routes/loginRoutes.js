import { Router } from 'express';
const router = Router();
import { login } from "../data/users.js";

router
    .route('')
        .get(async (req, res) => {
            let error = "";
            if (req.status === 400) error = "Could not log in.";
            res.render('login', {
                error, title: "Login", 
                links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' }
            });
        })
        .post(async (req, res) => {
            const user = req.body;
            try {
                const username = await login(user.username, user.password);
                if (username) {
                    req.session.user = username;
                    return res.redirect('/admin')
                }
            } catch (e) {
                return res.status(400).redirect('/login');
            }
        });

export default router;