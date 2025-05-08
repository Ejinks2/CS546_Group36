import { Router } from "express";
import { getAllReports, updateReportStatus } from "../data/userReports.js";


const router = Router();

router.route('').get(async (req, res) => {
    res.render('admin', { title: "Admin Page" });
})

// View pending reports
router.route('/reports').get(async (req, res) => {
    try {
      const reports = await getAllReports({ status: 'pending' });
      res.render('admin', { title: "Pending User Reports", reports });
    } catch (e) {
      res.status(500).render('admin', { title: "Pending User Reports", error: e });
    }
});

// Approve a report
router.route('/approve/:id').post(async (req, res) => {
    try {
        const id = req.params.id;
        await updateReportStatus(id, 'approved');
        res.redirect('/admin/reports');
      } catch (e) {
        res.status(400).render('admin', { title: "Error Approving Report", error: e });
      }
});

// Reject a report
router.route('/reject/:id').post(async (req, res) => {
    try {
      const id = req.params.id;
      await updateReportStatus(id, 'rejected');
      res.redirect('/admin/reports');
    } catch (e) {
      res.status(400).render('admin', { title: "Error Rejecting Report", error: e });
    }
  });

router.route('/comments').get(async (req, res) => {

});



export default router;