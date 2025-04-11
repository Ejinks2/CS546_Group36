import adminRoute from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";
import { Router } from "express";
const router = Router();
router.route('').get(async (req, res) => {
    res.render('home', { title: 'Homepage' })
});

const setRoutes = (app) => {
    app.use('/', router);

    app.use('/admin', adminRoute);

    app.use(/(.*)/, (req, res) => {
        res.status(404).json({ error: "Page not found. "});
    })
}

export default setRoutes;