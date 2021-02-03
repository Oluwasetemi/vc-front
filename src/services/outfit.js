import Outfit from '../models/outfit';
import {findClosetById} from './closet';

export const createOutfit = (data) => Outfit.create(data);

export const findOneOutfitBasedOnQuery = (data) => Outfit.findOne(data);

export const findBasedOnQuery = (data) => Outfit.find(data);

export const findOutfitById = (id) => Outfit.findById(id);

export const findOutfitByIdPopulated = (id) =>
  Outfit.findById(id).populate('hra');

export const findOutfitsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const outfit = await Outfit.findById(each);

    delete outfit.password;
    result.push(outfit);
  }

  return result;
};

export const findAllOutfits = async (query = {}) => {
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }
  const outfit = await Outfit.find({}).limit(limit).skip(skip).sort(sortObject);
  const total = await Outfit.countDocuments({});

  return {outfit, total: total};
};

export const findAllOutfitsUser = async (query = {}) => {
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  const user = query.userId;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }
  const outfit = await Outfit.find({user})
    .limit(limit)
    .skip(skip)
    .sort(sortObject);
  const total = await Outfit.countDocuments({user});

  return {outfit, total: total};
};

export const removeOutfit = (id) => Outfit.findByIdAndRemove(id);

export const updateOutfit = (query, data) =>
  Outfit.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteOutfit = (id) => Outfit.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const outfit = await Outfit.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return outfit;
};

export const fetchOneItem = async (id, closetId) => {
  // fetch the closet
  const closet = await findClosetById(closetId);

  const item = closet && closet.items && closet.items.id(id);

  return item;
};
