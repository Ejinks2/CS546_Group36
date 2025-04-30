import { Router } from "express";

const router = Router();

router.route('').get(async (req, res) => {
    res.render('admin', { title: "Admin Page", links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' }});
})

router.route('/reports').get(async (req, res) => {
    
});

router.route('/approve/:id').post(async (req, res) => {

});

router.route('/comments').get(async (req, res) => {

});



export default router;