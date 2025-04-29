import express from 'express';
import {getOfficialCrimes} from "../data/officialCrimes.js";
import { getAllReports } from '../data/userReports.js';

const router = express.Router();

//Get Official crimes
router.route('/')
.get(async(req,res) => {
    try{
        // Filters
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
    
        // Limit for testing
        const limitedCrimes = crimeList.slice(0, 50);
    
        res.render('search', {
          title: 'Search Official Crime Records',
          crimes: limitedCrimes
        });

    }catch(e){
        res.status(500).render('error', { message: 'Error loading crime data' });
    }
});


export default router;