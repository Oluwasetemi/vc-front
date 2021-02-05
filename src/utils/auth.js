import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {findUserById} from '../services/user';

if (!process.env.TOKEN_SECRET) {
  throw new Error('Please set a TOKEN_SECRET in the environment variable');
}

/**
 * generates a token for a user
 * @function
 * @param {string} id - id of the user.
 * @param {string} email - email of the user.
 * @param {string} role - role of the user.
 * @returns {string} token - for authenticating the user.
 */

export const sign = (id) =>
  new Promise((resolve, reject) => {
    jwt.sign({id}, process.env.TOKEN_SECRET, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });

/**
 * authenticates a token
 * @function
 * @param {string} token - user token.
 * @returns {object} decoded - authenticated user details.
 */

export const verify = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);

      return resolve(decoded);
    });
  });

/**
 * hashes a user's password
 * @function
 * @param {string} password - user password.
 * @returns {Promise(string)} hashed - a hashed password
 */
export const hash = (password) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashed) => {
      if (err) return reject(err);

      return resolve(hashed);
    });
  });
};

/**
 *  compares a user's password with the hashed version
 * @param {string} password user password
 * @param {string} hashedPassword
 * @returns {Promise(boolean)} match - the boolean of the password compare
 */
export const match = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

/**
 *  return user from their jwt token
 * @param {string} token user token
 * @returns {Promise(Object)} user - the user data
 */
export const findUserFromToken = async (token) => {
  const {id} = await verify(token);

  if (!id) {
    throw new Error('Invalid token');
  }

  return findUserById(id);
};
