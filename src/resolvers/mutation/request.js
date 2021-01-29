import axios from 'axios';
import {findLocationById} from '../../services/location';
import {
  createRequest,
  findRequestById,
  updateRequest,
} from '../../services/request';
import {findSubscriptionById} from '../../services/subscription';
import {updateUser} from '../../services/user';
import timekit from '../../utils/timekit';

const requestMutation = {
  // subscription
  async createRequestMutation(_, {input}, {user, pubsub}) {
    try {
      // must be done by a user
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (!user.currentSubscriptionPlan) {
        throw new Error('You do not have a current subscription plan');
      }

      // check number of items from the users currentSubscriptionPlan
      // populate the currentSubscriptionPlan data
      const subscriptionPlan = await findSubscriptionById(
        user.currentSubscriptionPlan,
      );
      const totalRoom = Number(subscriptionPlan.services.storage);
      const availableRoom = totalRoom - user.currentClosetSize;

      if (input.numberOfItems > availableRoom) {
        throw new Error(
          'Number of Items is greater than available room size, try on Demand',
        );
      }

      // create dateTime object from the time and date picked for the request
      const {date, time} = input;
      const [d, M, y] = date.split('/');
      const [h, m] = time.split(':');
      const dateObj = new Date(y, M - 1, d, h, m);

      if (Date.now() > Date.parse(dateObj.toISOString())) {
        throw new Error('Pick a future date');
      }
      // convert the dateObj to ISO format
      const dateISOFormat = dateObj.toISOString().split('.')[0] + 'Z';

      // add 5 days to dateISOFormat
      const after5DaysOfStart =
        new Date(Date.parse(dateObj) + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('.')[0] + 'Z';

      // load current location
      let location;
      if (input.pickupLocation) {
        // create a new location
        location = await findLocationById(input.pickupLocation);

        if (!location) {
          throw new Error('Invalid location data, Try Again');
        }

        // add it to user location data
        // await updateUser({_id: user._id}, {$push: {locations: location._id}});
      }
      // else use user current location
      location = await findLocationById(user.currentLocation);

      // create a book on timeKit and save the bookingId
      const booking = await timekit.createBooking({
        resource_id: 'db5a3704-6690-43b6-bffc-48dc9d0cc3e2',
        graph: 'confirm_decline',
        start: dateISOFormat,
        end: after5DaysOfStart,
        what: `${input.type} request by ${user.email}`,
        where: location.location,
        description: `${input.numberOfItems} due for ${input.type} request by ${user.email}`,
        customer: {
          name: user.email.split('@')[0],
          email: user.email,
          phone: user.phone,
          // voip: 'McFly',
          // timezone: 'America/Los_Angeles',
        },
        settings: {
          allow_double_bookings: true,
        },
      });

      const reqData = {
        type: input.type,
        numberOfItems: input.numberOfItems,
        pickupLocation: location.id,
        user: user._id,
        bookingId: booking.data.id,
        contactPhoneNumber: input.contactPhoneNumber
          ? input.contactPhoneNumber
          : user.phone,
        datetimePicked: dateISOFormat,
        metaData: {
          // anyData about the pick
          type: input.type,
          note: input.note ? input.note : 'no note',
        },
        items: input.type === 'Delivery' ? input.items : [],
      };

      const req = await createRequest(reqData);

      if (!req) {
        throw new Error(`unable to create request of ${input.type}`);
      }

      // publish the result
      pubsub.publish('new-request', {newRequest: req});

      // update the user with their request
      await updateUser({_id: user._id}, {$push: {requests: req._id}});

      return req;
    } catch (error) {
      const message =
        (error && error.data && error.data.error) ||
        (error &&
          error.data &&
          error.data.errors &&
          error.data.errors.customer &&
          error.data.errors.customer[0]) ||
        error.message ||
        'Error while creating a request';
      console.error(message);

      throw new Error(message);
    }
  },
  async updateRequestMutation(_, {id, dataToBeUpdated}, {user}) {
    try {
      // must be done by a user
      if (!user) {
        throw new Error('You must be logged In');
      }

      // update Location
      const subscriptionToBeUpdated = await findSubscriptionById(id);

      if (!subscriptionToBeUpdated) {
        throw new Error('subscription not found');
      }

      return {message: 'Subscription/addon/onDemand updated successfully'};
    } catch (error) {
      throw new Error('Error while updating a subscription');
    }
  },
  async deleteRequest(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // delete request

      return {message: 'Subscription deleted successfully'};
    } catch (error) {
      throw new Error('Error while deleting a subscription');
    }
  },
  async acceptRequest(_, {id, bookingId}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // find the request
      const request = await findRequestById(id);

      if (!request) {
        throw new Error('Request ID invalid');
      }

      if (request.status === 'Pending') {
        return {message: 'Pickup Request accepted successfully Already'};
      }

      // confirm the booking
      // Send a POST request
      const confirmedBooking = await axios({
        method: 'put',
        url: `https://api.timekit.io/v2/bookings/${bookingId}/confirm`,
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: '',
          password: `${process.env.TIMEKIT_API_KEY}`,
        },
        data: {},
      });

      // update the pickup request data from unconfirmed to Pending
      const updatedRequest = await updateRequest(
        {_id: id},
        {status: 'Pending'},
      );

      if (!updatedRequest) {
        throw new Error('Error while updating the Request');
      }

      return updatedRequest;
    } catch (error) {
      console.log(error.message);
      throw new Error('Error while accepting a pickup');
    }
  },
  async sendOutRequest(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // update the pickup request data from unconfirmed to Pending
      const updatedRequest = await updateRequest({_id: id}, {status: 'Active'});

      if (!updatedRequest) {
        throw new Error('Error while updating the Request');
      }

      return {message: 'Pickup Request sent out successfully'};
    } catch (error) {
      throw new Error('Error while accepting a pickup');
    }
  },
  async confirmPickup(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // update the pickup request data from unconfirmed to Pending
      const updatedRequest = await updateRequest(
        {_id: id},
        {status: 'Confirmed'},
      );

      // create a report

      // send report email to user about the pick

      if (!updatedRequest) {
        throw new Error('Error while updating the Request');
      }

      return {message: 'Pickup Request confirmed successfully'};
    } catch (error) {
      throw new Error('Error while accepting a pickup');
    }
  },
};

export default requestMutation;
