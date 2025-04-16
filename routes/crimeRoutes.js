import express from "express";
import { getOfficialCrimes } from "../data/officialCrimes.js";
import * as stringValidation from '../validations/stringValidation.js'

const router = express.Router();

//Get Official crimes
router.route("/")
.get(async (req, res) => {
  try {
    const officialCrimeList = await getOfficialCrimes();

    //Limiting ammount of crimes for testing
    const limitedCrimes = officialCrimeList.slice(0, 50);

    res.render("search", {
      title: "Search Official Crime Records",
      crimes: limitedCrimes,
    });
  } catch (e) {
    res.status(500).render("search", { error: "Error loading crime data" });
  }
})
.post(async (req, res) => {
  let search_query;
  try {
    search_query = stringValidation.checkString(req.body.searchCrime, 'crime search box') //have to actually implement checkString still
  } catch (e) {
    res.status(400).render('search', {error: e, title: "Search Crimes"})
  }

  try {
    const crimeList = await getOfficialCrimes() //this will have to be changed to actually give the search results
    //const crimeList = [{name: 'theft'}, {name: 'homicide'}]
    res.render('search', {crimes: crimeList, title: "Search Crimes", search_input: search_query});
  } catch (e) {
    res.status(400).render('search', {error: e, title: "Search Crimes"})
  }
});

export default router;
