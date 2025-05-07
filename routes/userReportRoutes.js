import { Router } from "express";
const router = Router();
import { getAllReports } from '../data/userReports.js';


router.route('/').get(async (req, res) => {
  try {
    const userReport = await getAllReports();
    res.render('feed', {userReport: userReport, title: "User Report Feed"})
  } catch (e) {
    res.status(500).render('home', {title: "Home"})
  }
})

export default router