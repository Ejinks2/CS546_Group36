import { Router } from "express";
import { getAllReports } from "../data/userReports.js";

const router = Router();

router.route('').get(async (req, res) => {
    res.render('admin', { title: "Admin Page" });
})

router.route('/reports').get(async (req, res) => {
    const reports = await getAllReports();
    res.render('admin', { title: "User Reports", reports });
});

router.route('/approve/:id').post(async (req, res) => {
    
});

router.route('/comments').get(async (req, res) => {

});



export default router;