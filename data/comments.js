import { getDb } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

const collectionName = 'comments';

export const addComment = async (crimeId, username, content) => {
  const db = await getDb();
  const comment = {
    crimeId: new ObjectId(crimeId),
    username,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  };
  
  const result = await db.collection(collectionName).insertOne(comment);
  return result.insertedId;
};

export const getCommentsByCrimeId = async (crimeId) => {
  const db = await getDb();
  return await db.collection(collectionName)
    .find({ 
      crimeId: new ObjectId(crimeId),
      isDeleted: false 
    })
    .sort({ createdAt: -1 })
    .toArray();
};

export const deleteComment = async (commentId, username) => {
  const db = await getDb();
  return await db.collection(collectionName).updateOne(
    { 
      _id: new ObjectId(commentId),
      username
    },
    { 
      $set: { 
        isDeleted: true,
        updatedAt: new Date()
      }
    }
  );
};

export const getCommentById = async (commentId) => {
  const db = await getDb();
  return await db.collection(collectionName).findOne({
    _id: new ObjectId(commentId),
    isDeleted: false
  });
};
