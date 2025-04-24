import { Router } from "express";

const router = Router();

router.route('').get(async (req, res) => {
    res.render('admin', { title: "Admin Page", links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' }});
})

export default router;