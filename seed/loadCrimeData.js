import axios from 'axios';
import { importNYCData } from '../data/officialCrimes.js';

const apiUrl = 'https://data.cityofnewyork.us/resource/5uac-w243.json?$limit=100';

const loadCrimeData = async () => {
  try {
    const response = await axios.get(apiUrl);
    const rawData = response.data;

    const cleanedData = rawData.map((item) => ({
      offense: item.ofns_desc || 'Unknown',
      borough: item.boro_nm || 'Unknown',
      location: item.prem_typ_desc || 'Unspecified',
      date: item.cmplnt_fr_dt || 'N/A',
      lawCategory: item.law_cat_cd || 'N/A'
    }));

    const insertedCount = await importNYCData(cleanedData);
    console.log(`Imported ${insertedCount} official crime records.`);
  } catch (e) {
    console.error('Error loading NYC crime data:', e);
  }
};

loadCrimeData();
