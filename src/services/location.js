import Location from '../models/location';

export const createLocation = (data) => Location.create(data);

export const findOneLocationBasedOnQuery = (data) => Location.findOne(data);

export const findBasedOnQuery = (data) => Location.find(data);

export const findLocationById = (id) => Location.findById(id);

export const findLocationByIdPopulated = (id) =>
  Location.findById(id).populate('hra');

export const findLocationsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const location = await Location.findById(each);

    delete location.password;
    result.push(location);
  }

  return result;
};

export const findAllLocations = (query = {}) => Location.find(query);

export const removeLocation = (id) => Location.findByIdAndRemove(id);

export const updateLocation = (query, data) =>
  Location.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteLocation = (id) => Location.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const location = await Location.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return location;
};
