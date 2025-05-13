import { Router } from "express";
import { connectToDb } from "../config/mongoConnection.js";
import { ReturnDocument } from "mongodb";
import { getCommentsByUsername } from "../data/comments.js";

const userData = "http://localhost:3000/users/data";

const db = await connectToDb();
const collection = db.collection('users');

const router = Router();

router.route('').get(async (req, res) => {
    const users = await collection.find({}).toArray();
    
    // Get comments for each user
    const usersWithComments = await Promise.all(users.map(async (user) => {
        const comments = await getCommentsByUsername(user.username);
        return {
            ...user,
            comments: comments.map(comment => ({
                content: comment.content,
                date: comment.createdAt.toLocaleDateString()
            }))
        };
    }));

    return res.render('users', { title: "User Database", users: usersWithComments });
})
.post(async (req, res) => {
    return res.redirect('/');
})

router.route('/:id').get(async (req, res) => {
    const id = req.params.id;
    const user = await collection.findOne({ username: id });
    
    if (!user) return res.redirect('/users');

    // Get user's comments
    const comments = await getCommentsByUsername(user.username);
    const userWithComments = {
        ...user,
        comments: comments.map(comment => ({
            content: comment.content,
            date: comment.createdAt.toLocaleDateString()
        }))
    };

    const userIsSelf = (id === req.session.user.username) ? true : false;

    return res.render('user', { title: user.username, user: userWithComments, userIsSelf });
})
.patch(async (req, res) => {
    const id = req.params.id;
    const user = await collection.findOneAndUpdate({ username: id }, { $set: { admin: true } });

    if (!user) return res.redirect('/users');

    return res.redirect(`/admin`);
})
.delete(async (req, res) => {
    const id = req.params.id;
    const response = await collection.findOneAndDelete({ username: id });

    if (!response) return res.json({ goTo: '/users' });

    return res.json({ goTo: '/admin' });
})

router.route('/data').get(async (req, res) => {
    const users = await collection.find({}).toArray();
    return res.json(users);
});

export default router;