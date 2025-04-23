import { Router } from 'express';
import { createReport } from '../data/userReports.js';
import { validateReportInput } from '../validations/reportValidation.js';

const router = Router();

// GET /report
router.get('/', async (req, res) => {
  try {
    res.render('report', {
      title: 'Submit a Crime Report',
      links: { Home: '/', Admin: '/admin', Search: '/search'}
    });
  } catch (e) {
    res.status(500).render('error', { message: 'Error loading form' });
  }
});

// POST /report
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;

    // Validate report
    validateReportInput(reportData);

    // Save to DB
    const newReport = await createReport(reportData);

    // show confirmation
    res.render('report', {
      title: 'Submit a Crime Report',
      success: true,
      report: newReport
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
