import Closet from '../models/closet';

export const createCloset = (data) => Closet.create(data);

export const findOneClosetBasedOnQuery = (data) => Closet.findOne(data);

export const findBasedOnQuery = (data) => Closet.find(data);

export const findClosetById = (id) => Closet.findById(id);

export const findClosetByIdPopulated = (id) =>
  Closet.findById(id).populate('hra');

export const findClosetsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const closet = await Closet.findById(each);

    delete closet.password;
    result.push(closet);
  }

  return result;
};

export const findAllClosets = async (query = {}) => {
  let req;
  let total;
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }
  if (query.type === 'All') {
    req = await Closet.find({}).limit(limit).skip(skip).sort(sortObject);
    total = await Closet.countDocuments({});
  } else {
    req = await Closet.find({type: query.type})
      .limit(limit)
      .skip(skip)
      .sort(sortObject);
    total = await Closet.countDocuments({type: query.type});
  }

  return {req, total: total};
};
export const removeCloset = (id) => Closet.findByIdAndRemove(id);

export const updateCloset = (query, data) =>
  Closet.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteCloset = (id) => Closet.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const closet = await Closet.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return closet;
};
