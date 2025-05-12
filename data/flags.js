import { getDb } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

const collectionName = 'flags';

export const addFlag = async (contentId, contentType, userId, reason) => {
  const db = await getDb();
  const flag = {
    contentId: new ObjectId(contentId),
    contentType, // 'comment' or 'report'
    userId, // store as string (username)
    reason,
    createdAt: new Date()
  };
  
  const result = await db.collection(collectionName).insertOne(flag);
  return result.insertedId;
};

export const getFlagsByContentId = async (contentId, contentType) => {
  const db = await getDb();
  return await db.collection(collectionName)
    .find({ 
      contentId: new ObjectId(contentId),
      contentType
    })
    .toArray();
};

export const getFlagCount = async (contentId, contentType) => {
  const db = await getDb();
  return await db.collection(collectionName)
    .countDocuments({ 
      contentId: new ObjectId(contentId),
      contentType
    });
};

export const hasUserFlagged = async (contentId, contentType, userId) => {
  const db = await getDb();
  const flag = await db.collection(collectionName)
    .findOne({ 
      contentId: new ObjectId(contentId),
      contentType,
      userId // query as string (username)
    });
  return !!flag;
};

export const removeFlag = async (contentId, contentType, userId) => {
  const db = await getDb();
  return await db.collection(collectionName)
    .deleteOne({ 
      contentId: new ObjectId(contentId),
      contentType,
      userId // query as string (username)
    });
};
