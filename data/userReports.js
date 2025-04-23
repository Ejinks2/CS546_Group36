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
export const getAllReports = async () => {
  const db = await connectToDb();
  const collection = db.collection('userReports');
  return await collection.find({}).toArray();
};
