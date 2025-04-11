import express from 'express';
import {getOfficialCrimes} from "../data/officialCrimes.js";

const router = express.Router();

//Get Official crimes
router.route('/')
.get(async(req,res) => {
    try{
        const officialCrimeList = await getOfficialCrimes();

        //Limiting ammount of crimes for testing
        const limitedCrimes = officialCrimeList.slice(0, 50);

        res.render('search', {
          title: 'Search Official Crime Records',
          crimes: limitedCrimes
        });

    }catch(e){
        res.status(500).render('error', { message: 'Error loading crime data' });
    }
});


export default router;