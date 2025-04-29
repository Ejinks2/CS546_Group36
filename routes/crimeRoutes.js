import express from 'express';
import { getOfficialCrimes } from "../data/officialCrimes.js";
import { getAllReports } from '../data/userReports.js';
import * as stringValidation from '../validations/stringValidation.js';

const router = express.Router();

// GET /search - Filtered official or user-submitted crimes
router.route('/')
  .get(async (req, res) => {
    try {
      const { borough, offense, startDate, endDate, source } = req.query;

      const filters = {
        borough,
        offense,
        startDate,
        endDate
      };

      let crimeList = [];

      if (source === 'user') {
        crimeList = await getAllReports(filters);
      } else {
        crimeList = await getOfficialCrimes(filters);
      }

      const limitedCrimes = crimeList.slice(0, 50);

      res.render('search', {
        title: 'Search Crime Records',
        crimes: limitedCrimes
      });

    } catch (e) {
      res.status(400).render('search', {
        error: e,
        title: "Search Crime Records"
      });
    }
  });


// GET /trends - placeholder for chart rendering
router.route("/trends")
  .get(async (req, res) => {
    try {
      const officialCrimeList = await getOfficialCrimes();
      const limitedCrimes = officialCrimeList.slice(0, 50);

      res.render("trends", {
        title: "Crime Trends",
        crimes: JSON.stringify(limitedCrimes)
      });
    } catch (e) {
      res.status(500).render("search", {
        error: "Error displaying trends"
      });
    }
  });

export default router;
