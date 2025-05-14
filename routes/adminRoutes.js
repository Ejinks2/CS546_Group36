import { Router } from "express";
import { getAllReports, updateReportStatus } from "../data/userReports.js";
import { getFlagCount, getFlagsByContentId } from "../data/flags.js";
import { ObjectId } from "mongodb";


const router = Router();

router.route('').get((req, res) => {
  res.redirect('/admin/reports');
});

// View pending reports
router.route('/reports').get(async (req, res) => {
  try {
    const [pending, approved, rejected] = await Promise.all([
      getAllReports({ status: 'pending' }),
      getAllReports({ status: 'approved' }),
      getAllReports({ status: 'rejected' })
    ]);
    const mapReports = async arr => Promise.all(arr.map(async obj => ({
      ...obj,
      _id: obj._id.toString(),
      flagCount: await getFlagCount(obj._id, 'report'),
      flagDetails: await getFlagsByContentId(obj._id, 'report')
    })));
    res.render('admin', {
      title: "User Reports",
      pendingReports: await mapReports(pending),
      approvedReports: await mapReports(approved),
      rejectedReports: await mapReports(rejected)
    });
  } catch (e) {
    res.status(500).render('admin', { title: "User Reports", error: e });
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



export default router;