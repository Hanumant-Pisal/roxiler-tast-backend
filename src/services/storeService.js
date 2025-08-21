const mongoose = require('mongoose');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

function regex(v) {
  return { $regex: v, $options: 'i' };
}


async function adminCreateStore({ name, email = '', address, ownerId = null }) {
  const store = await Store.create({ name, email, address, ownerId: ownerId || null });
  if (ownerId) {
    
    await mongoose.model('User').findByIdAndUpdate(ownerId, { storeId: store._id });
  }
  return store;
}

async function adminListStores(query) {
  const { page = 1, limit = 10, name, email, address, minRating } = query;
  const filter = {};
  if (name) filter.name = regex(name);
  if (email) filter.email = regex(email);
  if (address) filter.address = regex(address);
  if (minRating) filter.avgRating = { $gte: Number(minRating) };

  const [items, total] = await Promise.all([
    Store.find(filter)
      .select('name email address avgRating ratingsCount ownerId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    Store.countDocuments(filter)
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function listStoresForUser(userId, query) {
  const { page = 1, limit = 10, name, address } = query;

  const match = {};
  if (name) match.name = regex(name);
  if (address) match.address = regex(address);

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'ratings',
        let: { storeId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$storeId', '$$storeId'] }, { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }] } } },
          { $project: { _id: 0, value: 1 } }
        ],
        as: 'myRatingArr'
      }
    },
    { $addFields: { myRating: { $ifNull: [{ $arrayElemAt: ['$myRatingArr.value', 0] }, null] } } },
    { $project: { myRatingArr: 0 } },
    { $sort: { createdAt: -1 } },
    { $skip: (Number(page) - 1) * Number(limit) },
    { $limit: Number(limit) }
  ];

  const [items, totalArr] = await Promise.all([
    Store.aggregate(pipeline),
    Store.aggregate([{ $match: match }, { $count: 'total' }])
  ]);

  const total = totalArr[0]?.total || 0;
  return { items, total, page: Number(page), limit: Number(limit) };
}


async function getOwnerStore(ownerId) {
  const store = await Store.findOne({ ownerId }, 'name address avgRating ratingsCount').lean();
  if (!store) throw new Error('Store not found for this owner');
  return store;
}

async function getOwnerStoreRatings(ownerId, { page = 1, limit = 10, search, storeId }) {
  // If storeId is provided, get ratings for that specific store
  // Otherwise, get all stores for the owner and show their ratings
  const storeMatch = storeId ? { _id: storeId, ownerId } : { ownerId };
  
  const stores = await Store.find(storeMatch, '_id name').lean();
  if (!stores || stores.length === 0) {
    throw new Error('No stores found for this owner');
  }

  const storeIds = stores.map(store => store._id);
  const match = { storeId: { $in: storeIds } };
  
  const userMatch = search
    ? { $or: [{ name: regex(search) }, { email: regex(search) }, { address: regex(search) }] }
    : {};

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        pipeline: [{ $match: userMatch }, { $project: { name: 1, email: 1, address: 1 } }],
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'stores',
        localField: 'storeId',
        foreignField: '_id',
        pipeline: [{ $project: { name: 1 } }],
        as: 'storeInfo'
      }
    },
    { $unwind: '$user' },
    { $unwind: '$storeInfo' },
    { 
      $project: { 
        value: 1, 
        createdAt: 1, 
        storeId: 1,
        'storeInfo.name': 1,
        'user.name': 1, 
        'user.email': 1, 
        'user.address': 1 
      } 
    },
    { $sort: { createdAt: -1 } },
    { $skip: (Number(page) - 1) * Number(limit) },
    { $limit: Number(limit) }
  ];

  const [items, total] = await Promise.all([
    require('mongoose').model('Rating').aggregate(pipeline),
    require('mongoose').model('Rating').countDocuments(match)
  ]);

  return { 
    stores: stores.map(s => ({ _id: s._id, name: s.name })),
    items, 
    total, 
    page: Number(page), 
    limit: Number(limit) 
  };
}

module.exports = {
  adminCreateStore,
  adminListStores,
  listStoresForUser,
  getOwnerStore,
  getOwnerStoreRatings
};
