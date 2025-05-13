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

    const limitedCrimes = crimeList.slice(0, 50).map(c => ({
      _id: c._id.toString(),
      offense: c.offense,
      borough: c.borough,
      date: c.date.slice(0, 10)
    }))

    res.render("search", {
      title: "Search Official Crime Records",
      links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report' },
      crimes: limitedCrimes,
      user: req.session.user,
      newcss: "crimes"
    });
  } catch (e) {
    res.status(500).render("search", { error: "Error loading crime data", newcss: "crimes"});
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
      error: e,
      newcss: "crimes"
    });
  }

  try {
    const crimeList = await getOfficialCrimes(); // full list to filter from
    const filtered = crimeList.filter(c =>
      c.offense?.toLowerCase().includes(search_query.toLowerCase()) || c.borough?.toLowerCase().includes(search_query.toLowerCase())
    );

    res.render('search', {
      title: "Search Crimes",
      crimes: filtered.slice(0, 50).map(c => ({
        _id: c._id.toString(),
        offense: c.offense,
        borough: c.borough,
        date: c.date.slice(0, 10)
      })),
      search_input: search_query,
      user: req.session.user,
      links: { Home: '/', Admin: '/admin', Search: '/search', Report: '/report'},
      newcss: "crimes"
    });
  } catch (e) {
    res.status(400).render('search', {
      title: "Search Crimes",
      error: e,
      newcss: "crimes"
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
      error: "Error displaying trends",
      newcss: "crimes"
    });
  }
});

export default router;
