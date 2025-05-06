import express from 'express';
import { getOfficialCrimes } from "../data/officialCrimes.js";
import { getAllReports } from '../data/userReports.js';
import * as stringValidation from '../validations/stringValidation.js';

const router = express.Router();

// GET /search - with filters for borough, offense, date, and source
router.route("/")
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
      crimeList = await getAllReports(filters); // community reports
    } else {
      crimeList = await getOfficialCrimes(filters); // official data
    }

    const limitedCrimes = crimeList.slice(0, 50);

    res.render("search", {
      title: "Search Official Crime Records",
      links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' },
      crimes: limitedCrimes,
    });
  } catch (e) {
    res.status(500).render("search", { error: "Error loading crime data" });
  }
})

// POST /search - keyword search box
.post(async (req, res) => {
  let search_query;
  try {
    search_query = stringValidation.checkString(req.body.searchCrime, 'crime search box');
  } catch (e) {
    return res.status(400).render('search', {
      title: "Search Crimes",
      error: e
    });
  }

  try {
    const crimeList = await getOfficialCrimes(); // full list to filter from
    const filtered = crimeList.filter(c =>
      c.offense?.toLowerCase().includes(search_query.toLowerCase())
    );

    res.render('search', {
      title: "Search Crimes",
      crimes: filtered.slice(0, 50),
      search_input: search_query,
      links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' }
    });
  } catch (e) {
    res.status(400).render('search', {
      title: "Search Crimes",
      error: e
    });
  }
});

// GET /trends - chart placeholder
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
