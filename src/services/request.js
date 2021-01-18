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

export const findAllRequests = (query = {}) => Request.find(query);

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
