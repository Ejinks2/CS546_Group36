import adminRoute from "./adminRoutes.js";
import crimeRoutes from './crimeRoutes.js';

import { Router } from "express";
const router = Router();
router.route('/').get(async (req, res) => {
    res.render('home', { title: 'Homepage' })
});

const setRoutes = (app) => {
    app.use('/', router);

    app.use('/admin', adminRoute);
    app.use('/search', crimeRoutes); // for official crime data

    app.use(/(.*)/, (req, res) => {
        res.status(404).json({ error: "Page not found. "});
    })
}

export default setRoutes;