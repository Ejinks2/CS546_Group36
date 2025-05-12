import { Router } from "express";
const router = Router();
import { getAllReports } from '../data/userReports.js';
import { getFlagCount, hasUserFlagged } from '../data/flags.js';

router.route('/').get(async (req, res) => {
  try {
    let userReport;
    const username = req.session.user ? req.session.user.username : null;
    if (username) {
      // Show all non-rejected reports from all users
      const allReports = await getAllReports();
      userReport = allReports.filter(r => r.status === 'pending' || r.status === 'approved');
    } else {
      // Show only approved reports for non-logged-in users
      userReport = await getAllReports({ status: 'approved' });
    }
    // Attach flagCount and hasFlagged to each report
    userReport = await Promise.all(userReport.map(async report => ({
      ...report,
      flagCount: await getFlagCount(report._id, 'report'),
      hasFlagged: username ? await hasUserFlagged(report._id, 'report', username) : false
    })));
    res.render('feed', {userReport: userReport, title: "User Report Feed"})
  } catch (e) {
    res.status(500).render('home', {title: "Home"})
  }
})

export default router