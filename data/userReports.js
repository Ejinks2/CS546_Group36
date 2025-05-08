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
  
  if (filters.status) {
    query.status = filters.status;
  }

  return await collection.find(query).toArray();
};

// Update the status of a report
export const updateReportStatus = async (id, newStatus) => {
  if (!ObjectId.isValid(id)) throw 'Invalid report ID';
  if (!['pending', 'approved', 'rejected'].includes(newStatus)) throw 'Invalid status';

  const db = await connectToDb();
  const collection = db.collection('userReports');

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: newStatus } }
  );

  if (result.modifiedCount === 0) {
    throw `Failed to update status for report ${id}`;
  }

  return true;
};