import { connectToDb } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

// Insert a new user-submitted report
export const createReport = async (data, user) => {
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
    suspectDescription: data.suspectDescription?.trim(),
    date: data.date,
    status: 'pending',
    user,
    comments: [],
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
  if (filters.user) {
    query.user = filters.user;
  }

  return await collection.find(query).toArray();
};

// Update the status of a report
export const updateReportStatus = async (id, newStatus) => {
  if (!ObjectId.isValid(id)) throw 'Invalid report ID';
  if (!['pending', 'approved', 'rejected'].includes(newStatus)) throw 'Invalid status';

  const db = await connectToDb();
  const collection = db.collection('userReports');

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: newStatus } }
  );

  const collection2 = db.collection('users');
  const updatedUser = await collection2.updateOne(
    { username: result.user },
    { $set : { "reports.$[elem].status": newStatus } },
    { arrayFilters: [ { "elem._id": new ObjectId(id) } ]}
  );


  if (result.modifiedCount === 0) {
    throw `Failed to update status for report ${id}`;
  }

  const collection3 = db.collection('officialCrimes');
  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (user.status === "approved") await collection3.insertOne({ 
        offense: user.offense, 
        borough: user.borough.toUpperCase(), 
        location: user.location, 
        date: user.date });

  return true;
};