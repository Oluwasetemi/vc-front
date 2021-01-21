import Request from '../models/request';

export const createRequest = (data) => Request.create(data);

export const findOneRequestBasedOnQuery = (data) => Request.findOne(data);

export const findBasedOnQuery = (data) => Request.find(data);

export const findRequestById = (id) => Request.findById(id);

export const findRequestByIdPopulated = (id) =>
  Request.findById(id).populate('hra');

export const findRequestsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const request = await Request.findById(each);

    delete request.password;
    result.push(request);
  }

  return result;
};

export const findAllRequests = async (query = {}) => {
  let req;
  let total;
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }
  if (query.type === 'All') {
    req = await Request.find({}).limit(limit).skip(skip).sort(sortObject);
    total = await Request.countDocuments({});
  } else {
    req = await Request.find({type: query.type})
      .limit(limit)
      .skip(skip)
      .sort(sortObject);
    total = await Request.countDocuments({type: query.type});
  }

  return {req, total: total};
};
export const removeRequest = (id) => Request.findByIdAndRemove(id);

export const updateRequest = (query, data) =>
  Request.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteRequest = (id) => Request.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const request = await Request.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return request;
};
