import User from '../models/user';

export const createUser = (data) => User.create(data);

export const findOneByEmail = (email) => User.findOne({email});

export const findOneBasedOnQuery = (data) => User.findOne(data);

export const findBasedOnQuery = (data) => User.find(data);

export const findUserById = (id) => User.findById(id);

export const findUserByIdPopulated = (id) => User.findById(id).populate('hra');

export const findUsersByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const user = await User.findById(each);

    delete user.password;
    result.push(user);
  }

  return result;
};

export const findAllUsers = (query = {}) => User.find(query);

export const removeUser = (id) => User.findByIdAndRemove(id);

export const updateUser = (query, data) =>
  User.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteUserByEmail = (email) => User.deleteOne({email});

export const search = async ({searchInput, id}) => {
  const user = await User.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return user;
};
