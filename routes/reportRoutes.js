import { Router } from 'express';

const router = Router();

router.route('').get(async (req, res) => {
    res.render('report', { title: 'Report a Crime' });
})

export default router;