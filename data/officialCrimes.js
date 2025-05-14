import { connectToDb } from '../config/mongoConnection.js';

//Can now pass filters
const getOfficialCrimes = async (filters = {}) => {
  const db = await connectToDb();
  const collection = db.collection('officialCrimes');

  const query = [];

  if (filters.searchTerm && typeof filters.searchTerm == 'string' && filters.searchTerm.trim().length > 0){
    const regex = { $regex: filters.searchTerm, $options: 'i'};
    query.push({borough: regex}, {offense: regex})
  } else {
    // Borough filter
    if (filters.borough && typeof filters.borough == 'string' && filters.borough.trim().length > 0) {
      query.push({ $regex: filters.borough, $options: 'i' });
    }
    // Crime type filter (offense)
    if (filters.offense && typeof filters.offense == 'string' && filters.offense.trim().length >0) {
      query.push({ $regex: filters.offense, $options: 'i' });
    }
  }
  // Date range filter
  if (filters.startDate || filters.endDate) {
    const dateQuery = {};
    if (filters.startDate) dateQuery.$gte = filters.startDate;
    if (filters.endDate) dateQuery.$lte = filters.endDate;
    query.push({ date: dateQuery })
  }
    
  let mongoFilter = {};
  if (filters.searchTerm) {
    mongoFilter = { $or: query };
  } else if (query.length > 1) {
    mongoFilter = { $and: query };
  } else if (query.length === 1) {
    mongoFilter = query[0];
  }

  return await collection.find(mongoFilter).toArray();
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