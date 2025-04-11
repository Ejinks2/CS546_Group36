import axios from "axios";
import { connectToDb } from '../config/mongoConnection.js';

const getOfficialCrimes = async () => {
    const db = await connectToDb();
    const collection = db.collection('officialCrimes');
    const crimes = await collection.find({}).toArray();
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