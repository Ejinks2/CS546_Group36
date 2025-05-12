import adminRoutes from './adminRoutes.js';
import searchRoutes from './searchRoutes.js';
import reportRoutes from './reportRoutes.js';
import userRoutes from './userRoutes.js';
import loginRoutes from './loginRoutes.js';
import registration from './registerRoutes.js';
import userReportRoutes from './userReportRoutes.js';

import { Router } from "express";
const router = Router();

router.route('').get(async (req, res) => {
    if (req.session.user) {
        if (req.session.user.admin) {
            return res.render('home', {
                title: 'Homepage',
                description: "Know what's going on near you!"
            });
        } else {
            return res.render('home', {
                title: 'Homepage',
                description: "Know what's going on near you!"
            });
        }
    }
    return res.render('home', { 
        title: 'Homepage' , 
        description: "Know what's going on around you!"})
});

const setRoutes = (app) => {
    app.use('/', router);

    //app.use('/admin', adminRoutes);
    app.use('/users', userRoutes);
    app.use('/search', searchRoutes); // for official crime data

    app.use('/reportfeed', userReportRoutes); // for feed of reports
    app.use('/report', reportRoutes); // user-submitted reports
    app.use('/login', loginRoutes); //for admin login
    app.use('/register', registration);
    

    app.use(/(.*)/, (req, res) => {
        return res.redirect('/');
    })
}

export default setRoutes;