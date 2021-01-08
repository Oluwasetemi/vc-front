import {findOrCreateStripeCustomer} from '../../services/payment';
import {
  createSubscription,
  findSubscriptionById,
  removeSubscription,
} from '../../services/subscription';
import {updateUser} from '../../services/user';
import stripe from '../../utils/stripe';

const subscriptionMutation = {
  // subscription
  async createSubscriptionMutation(_, {input}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const product = await stripe.products.create({
        name: input.name,
        description: input.name,
      });

      if (!product) {
        throw new Error('Server Error');
      }

      const subData = {
        name: input.name,
        amount: input.amount,
        services: {
          storage: input.storage,
          accessories: input.accessories,
          shoes: input.shoes,
          helpMePack: input.helpMePack,
          stylist: input.stylist,
          vault: input.vault,
          note: input.note ? input.note : 'none',
          type: input.type,
        },
        stripeProductId: product.id,
      };

      const sub = await createSubscription(subData);

      if (!sub) {
        throw new Error('unable to create subscription');
      }

      return {message: 'Subscription created successfully'};
    } catch (error) {
      throw new Error('Error while creating a subscription');
    }
  },
  async updateSubscriptionMutation(_, {id, dataToBeUpdated}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // update Location
      const subscriptionToBeUpdated = await findSubscriptionById(id);

      if (!subscriptionToBeUpdated) {
        throw new Error('subscription not found');
      }

      let product;
      if (!subscriptionToBeUpdated.stripeProductId) {
        product = await stripe.products.create({
          name: subscriptionToBeUpdated.name,
          description: subscriptionToBeUpdated.name,
        });
      }

      subscriptionToBeUpdated.stripeProductId = product.id;

      // loop thru dataToBeUpdated and add to the subscriptionToBeUpdated
      if (dataToBeUpdated) {
        for (const each in dataToBeUpdated) {
          subscriptionToBeUpdated[each] = dataToBeUpdated[each];
        }
      }

      // final update
      await subscriptionToBeUpdated.save();

      return {message: 'Subscription/addon/onDemand updated successfully'};
    } catch (error) {
      throw new Error('Error while updating a subscription');
    }
  },
  async deleteSubscription(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      // update Location
      const deletedSubscription = await removeSubscription(id);

      if (!deletedSubscription) {
        throw new Error('unable to delete subscription');
      }

      return {message: 'Subscription deleted successfully'};
    } catch (error) {
      throw new Error('Error while deleting a subscription');
    }
  },
  async makePayment(_, {id, token}, {user}) {
    try {
      // must be done by a user
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (!id && !token) {
        throw new Error('Invalid data sent');
      }

      // findOrCreateStripeCustomer
      const stripeCustomer = await findOrCreateStripeCustomer(user, token);

      if (!stripeCustomer) {
        throw new Error('Server Error');
      }

      // fetch the subscription
      const subscriptionToChargeFor = await findSubscriptionById(id);

      const amount = Number(subscriptionToChargeFor.amount) * 100;

      // update the user data
      const updatedUser = await updateUser(
        {_id: user._id},
        {stripeCustomerId: stripeCustomer.id},
      );

      // create a price
      const stripePrice = await stripe.prices.create({
        unit_amount: amount,
        currency: 'usd',
        recurring: {interval: 'month'},
        product: subscriptionToChargeFor.stripeProductId,
      });

      if (!stripePrice) {
        throw new Error('Server Error');
      }
      // create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{price: stripePrice.id}],
      });
      // charge the customer
      // return stripe.charges.create({
      //   amount: amount, // Unit: usd
      //   currency: 'usd',
      //   customer: stripeCustomer.id,
      //   source: stripeCustomer.default_source.id,
      //   description: `Payment for ${subscriptionToChargeFor.name} by ${updatedUser.email}`,
      // })

      return {message: 'Subscription was created successfully'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default subscriptionMutation;
