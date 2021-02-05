import Stylist from '../models/stylist';

export const createStylist = (data) => Stylist.create(data);

export const findOneStylistBasedOnQuery = (data) => Stylist.findOne(data);

export const findBasedOnQuery = (data) => Stylist.find(data);

export const findStylistById = (id) => Stylist.findById(id);

export const findStylistByIdPopulated = (id) =>
  Stylist.findById(id).populate('hra');

export const findStylistsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const stylist = await Stylist.findById(each);

    delete stylist.password;
    result.push(stylist);
  }

  return result;
};

export const findAllStylists = async (query = {}) => {
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }
  const stylist = await Stylist.find({})
    .limit(limit)
    .skip(skip)
    .sort(sortObject);
  const total = await Stylist.countDocuments({});

  return {stylist, total: total};
};
export const removeStylist = (id) => Stylist.findByIdAndRemove(id);

export const updateStylist = (query, data) =>
  Stylist.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteStylist = (id) => Stylist.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const stylist = await Stylist.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return stylist;
};
