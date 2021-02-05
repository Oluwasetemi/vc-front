/* eslint-disable no-shadow */
import axios from 'axios';
import {findAllRequests, findRequestById} from '../../services/request';

// function that accept the booking array and return the data we need to extract out
function cleanBooking(bookings) {
  const results = [];
  for (const booking of bookings) {
    const each = {};
    each.id = booking.id;
    each.state = booking.state;
    each.completed = booking.completed;
    each.what = booking.attributes.event.what;
    each.where = booking.attributes.event.where;
    each.description = booking.attributes.event.description;
    each.start = booking.attributes.event.start;
    each.email = booking.attributes.customer.email;
    results.push(each);
  }
  return results;
}

const requestQueries = {
  async fetchAllRequest(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const query = {};

      if (args.type) {
        query.type = args.type;
      }

      if (args.first) {
        query.first = args.first;
      }

      if (args.start || args.start === 0) {
        query.start = args.start;
      }

      if (args.sort) {
        query.sort = args.sort;
      }

      if (args.sortBy) {
        query.sortBy = args.sortBy;
      }

      const {req, total} = await findAllRequests(query);

      if (!req) {
        throw new Error('Request data not found');
      }
      if (!total) {
        throw new Error('Request data not found');
      }

      const results = {};
      results.total = total;
      results.data = req;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneRequest(_, {id}, {user}) {
    // must be done by an admin
    if (!user || user === null) {
      throw new Error("You're not logged in");
    }

    if (user.type !== 'ADMIN') {
      throw new Error('You do not have the permission to do this');
    }

    const req = await findRequestById(id);

    if (!req) {
      throw new Error(`Error find request with ${id}`);
    }

    return req;
  },
  async fetchBooking(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      const booking = await axios({
        method: 'get',
        url: `https://api.timekit.io/v2/bookings?include=available_actions,attributes,calendar,customers`,
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: '',
          password: `${process.env.TIMEKIT_API_KEY}`,
        },
        data: {},
      });

      if (!booking) {
        throw new Error(`Error finding booking`);
      }

      // filter by the current user's email
      let currentUserBooking;
      if (booking.data.data) {
        currentUserBooking = booking.data.data.filter((each) => {
          if (each.attributes.length !== 0) {
            return each.attributes.customer.email === user.email;
          }
        });
      }

      if (currentUserBooking.length === 0) {
        throw new Error('No booking found user');
      }

      let finalResult;
      // filter the data based on the args
      if (args.day && args.month === false) {
        const day = new Date(args.day).getDate();
        const month = new Date(args.day).getMonth();
        const year = new Date(args.day).getFullYear();
        finalResult = currentUserBooking.filter((each) => {
          if (each.attributes.length !== 0) {
            const eachDay = new Date(each.attributes.event.start).getDate();
            const eachMonth = new Date(each.attributes.event.start).getMonth();
            const eachYear = new Date(
              each.attributes.event.start,
            ).getFullYear();
            return day === eachDay && month === eachMonth && year === eachYear;
          }
        });

        const data = cleanBooking(finalResult);

        return data;
      }

      if (args.month) {
        // const day = new Date(args.day).getDate();
        const month = new Date(args.day).getMonth();
        const year = new Date(args.day).getFullYear();
        finalResult = currentUserBooking.filter((each) => {
          if (each.attributes.length !== 0) {
            // const eachDay = new Date(each.attributes.event.start).getDate();
            const eachMonth = new Date(each.attributes.event.start).getMonth();
            const eachYear = new Date(
              each.attributes.event.start,
            ).getFullYear();
            return month === eachMonth && year === eachYear;
          }
        });

        const data = cleanBooking(finalResult);

        return data;
      }

      const data = cleanBooking(currentUserBooking);

      return data;
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error('Error while finding booking');
      }
      console.log(error.message);
      throw new Error(error.message);
    }
  },
  async fetchOneBooking(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      const booking = await axios({
        method: 'get',
        url: `https://api.timekit.io/v2/bookings/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: '',
          password: `${process.env.TIMEKIT_API_KEY}`,
        },
        data: {},
      });

      if (!booking) {
        throw new Error(`Error finding booking with ${id}`);
      }

      return booking.data.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error('Error while finding booking');
      }
      console.log(error.message);
      throw new Error(error.message);
    }
  },
};

export default requestQueries;
