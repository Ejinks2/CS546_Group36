import { Router } from "express";

const router = Router();

router.route('').get(async (req, res) => {
    res.render('admin', { title: "Admin Page"});
})

export default router;