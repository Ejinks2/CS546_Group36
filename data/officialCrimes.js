import axios from "axios";
import { connectToDb } from '../config/mongoConnection.js';

//Can now pass filters
const getOfficialCrimes = async (filters = {}) => {
    const db = await connectToDb();
    const collection = db.collection('officialCrimes');

    const query = {};

    // Borough filter
    if (filters.borough) {
      query.borough = { $regex: filters.borough, $options: 'i' };
    }
  
    // Crime type filter (offense)
    if (filters.offense) {
      query.offense = { $regex: filters.offense, $options: 'i' };
    }
  
    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }
  

    const crimes = await collection.find(query).toArray();
    return crimes;


}

const importNYCData = async (crimeArray) => {
    if (!Array.isArray(crimeArray) || crimeArray.length === 0) {
      throw 'No data provided to import.';
    }
  
    const db = await connectToDb();
    const collection = db.collection('officialCrimes');
  
    //clear old records first
    await collection.deleteMany({});
  
    const result = await collection.insertMany(crimeArray);
    return result.insertedCount;
  };
  
export {getOfficialCrimes, importNYCData};