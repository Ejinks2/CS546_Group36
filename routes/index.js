import adminRoute from './adminRoutes.js';
import crimeRoutes from './crimeRoutes.js';
import reportRoutes from './reportRoutes.js';

import { Router } from "express";
const router = Router();
router.route('/').get(async (req, res) => {
    res.render('home', { 
        title: 'Homepage' , 
        links: { Admin: '/admin', Search: '/search', Report: '/report' },
        description: "Know what's going on around you!"})
});

const setRoutes = (app) => {
    app.use('/', router);

    app.use('/admin', adminRoute);
    app.use('/search', crimeRoutes); // for official crime data

    app.use('/report', reportRoutes); // user-submitted reports
    

    app.use(/(.*)/, (req, res) => {
        res.status(404).json({ error: "Page not found. "});
    })
}

export default setRoutes;