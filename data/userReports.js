import { connectToDb } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

// Insert a new user-submitted report
export const createReport = async (data) => {
  if (!data || typeof data !== 'object') {
    throw 'Invalid report data';
  }

  const db = await connectToDb();
  const collection = db.collection('userReports');

  // ADD USER WHEN USERS ARE IMPLEMENTED
  const newReport = {
    offense: data.offense?.trim(),
    location: data.location?.trim(),
    borough: data.borough?.trim(),
    city: data.city?.trim(),
    description: data.description?.trim(),
    date: data.date,
    status: 'pending',
    flags: [],
    createdAt: new Date()
  };

  const result = await collection.insertOne(newReport);
  if (!result.acknowledged || !result.insertedId) {
    throw 'Failed to insert report';
  }

  return { _id: result.insertedId, ...newReport };
};

// Fetch all user-submitted reports
export const getAllReports = async (filters = {}) => {
  const db = await connectToDb();
  const collection = db.collection('userReports');
  const query = {};

  // Borough
  if (filters.city) {
    query.city = { $regex: filters.city, $options: 'i' };
  }

  if (filters.state) {
    query.state = { $regex: filters.state, $options: 'i' };
  }

  // Crime type 
  if (filters.offense) {
    query.offense = { $regex: filters.offense, $options: 'i' };
  }

  // Date range
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = filters.startDate;
    if (filters.endDate) query.date.$lte = filters.endDate;
  }


  return await collection.find(query).toArray();
};
