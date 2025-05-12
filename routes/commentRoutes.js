import { Router } from 'express';
import validateComment from '../data/comments.js';
import { connectToDb } from '../config/mongoConnection.js';
const router = Router();

router.route('/:id').get(async (req, res) => {
    return res.render('feed', { title: "Comment" });
})
.post(async (req, res) => {
    const body = req.body;
    const post = req.params.id;
    //validateComment(body);

    const db = await connectToDb();
    const users = db.collection('users');
    const userReports = db.collection('userReports');

    const date = new Date();
    const newDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear())}`;

    const hours = date.getHours() % 12 || 12;
    const time = `${hours}:${String(date.getMinutes()).padStart(2, '0')}${date.getHours() < 12 ? 'AM' : 'PM'}`
    const datePosted = `${newDate} ${time}`;
    
    const comment = {
        user: req.session.user,
        body,
        datePosted
    };

    const userResult = await users.findOneAndUpdate({ username: req.session.user }, { $push: { comments: comment } });
    if (!userResult) return res.redirect('/comment');

    const reportResult = await userReports.findOneAndUpdate({ _id: post }, { $push: { comments: comment } });
    if (!reportResult) return res.redirect('/comment');

    return res.redirect('/reportfeed');
});

export default router;