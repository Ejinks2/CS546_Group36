import { Router } from 'express';
import { createReport } from '../data/userReports.js';
import { validateReportInput } from '../validations/reportValidation.js';
import { connectToDb } from '../config/mongoConnection.js';
import xss from 'xss';

const router = Router();

// GET /report
router.get('/', async (req, res) => {
  try {
    res.render('report', {
      title: 'Submit a Crime Report',
      links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' }
    });
  } catch (e) {
    res.status(500).render('error', { message: 'Error loading form' });
  }
});

// POST /report
router.post('/', async (req, res) => {
  //console.log(req.body)
  try {
    // Validate report
    const username = req.session.user.username;
    const reportData = validateReportInput(req.body);

    // Save to DB
    const newReport = await createReport(reportData, username);

    const db = await connectToDb();
    const users = await db.collection('users');
    const user = await users.updateOne({ username }, { $push: { reports: newReport }});

    // show confirmation
    res.render('report', {
      title: 'Submit a Crime Report',
      success: true,
      report: newReport,
    });
    
  } catch (e) {
    res.status(400).render('report', {
      title: 'Submit a Crime Report',
      error: typeof e === 'string' ? e : 'Invalid input. Please try again.',
      input: req.body
    });
  }
});

export default router;
