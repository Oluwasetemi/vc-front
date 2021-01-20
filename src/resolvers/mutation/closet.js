import {findLocationById} from '../../services/location';
import {createRequest} from '../../services/request';
import {findSubscriptionById} from '../../services/subscription';
import {updateUser} from '../../services/user';
import timekit from '../../utils/timekit';

const closetMutation = {
  // subscription
  async addItemToCloset(_, {input}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // check number of items from the users currentSubscriptionPlan
      // populate the currentSubscriptionPlan data
      const subscriptionPlan = await findSubscriptionById(
        user.currentSubscriptionPlan,
      );
      const totalRoom = Number(
        subscriptionPlan.services.storage &&
          subscriptionPlan.services.storage.split(' ')[0],
      );
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
        await updateUser({_id: user._id}, {$push: {locations: location._id}});
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
        description: `${input.type} request by ${user.email}`,
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
        contactPhoneNumber: user.phone,
        datetimePicked: dateISOFormat,
        metaData: {
          // anyData about the pick
          type: 'pickup',
        },
      };

      const req = await createRequest(reqData);

      if (!req) {
        throw new Error(`unable to create request of ${input.type}`);
      }

      return {message: 'Request created successfully'};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.data.error || 'Error while creating a request');
    }
  },
};

export default closetMutation;
