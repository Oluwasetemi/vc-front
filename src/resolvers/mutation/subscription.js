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
        description: `${input.name}${
          process.env.NODE_ENV === 'development'
            ? 'product created in development'
            : 'product created in production'
        }`,
      });

      if (!product) {
        throw new Error('Server Error');
      }

      const amount = Number(input.amount) * 100;

      // create price for the subscription
      const stripePrice = await stripe.prices.create({
        unit_amount: amount,
        currency: 'usd',
        recurring: {interval: 'month'},
        product: product.id,
      });

      if (!stripePrice) {
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
        stripePriceId: stripePrice.id,
      };

      const sub = await createSubscription(subData);

      if (!sub) {
        throw new Error('unable to create subscription');
      }

      return {message: 'Subscription created successfully'};
    } catch (error) {
      console.error(error.message);
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
      product.id = subscriptionToBeUpdated.stripeProductId;

      let amount;
      if (!subscriptionToBeUpdated.amount) {
        amount = Number(dataToBeUpdated.amount) * 100;
      }
      amount = Number(subscriptionToBeUpdated.amount) * 100;

      let price;
      if (!subscriptionToBeUpdated.stripePriceId) {
        price = await stripe.prices.create({
          unit_amount: amount,
          currency: 'usd',
          recurring: {interval: 'month'},
          product: product.id,
        });
      }

      subscriptionToBeUpdated.stripeProductId = product.id;
      subscriptionToBeUpdated.stripePriceId = price.id;

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

      // delete Subscription
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

      // if user have a currentSubscriptionPlan throw a error
      if (user.currentSubscriptionPlan) {
        throw new Error('User have a current subscription plan');
      }

      // fetch the subscription
      const subscriptionToChargeFor = await findSubscriptionById(id);

      // update the user data
      await updateUser({_id: user._id}, {stripeCustomerId: stripeCustomer.id});

      // create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{price: subscriptionToChargeFor.stripePriceId}],
      });

      // update the current user with subscription id
      await updateUser(
        {_id: user._id},
        {currentSubscriptionPlan: id, stripeSubscriptionId: subscription.id},
      );

      return {message: 'Subscription was created successfully'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async cancelSubscription(_, args, {user}) {
    try {
      // must be done by a user
      if (!user) {
        throw new Error('You must be logged In');
      }

      const deleted = await stripe.subscriptions.del(user.stripeSubscriptionId);

      if (!deleted) {
        throw new Error(
          'error while delete from canceling this sub from stripe',
        );
      }

      // update user
      await updateUser(
        {_id: user._id},
        {currentSubscriptionPlan: null, stripeSubscriptionId: null},
      );

      return {message: 'User subscription deleted successfully'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async upgradeSubscription(_, {id, token}, {user}) {
    try {
      // must be done by a user
      if (!user) {
        throw new Error('You must be logged In');
      }

      // if user have a currentSubscriptionPlan throw a error
      if (!user.currentSubscriptionPlan) {
        throw new Error('User must have a current subscription plan');
      }

      // the id of the new subscription must not be the currentSubscriptionPlan
      if (id === user.currentSubscriptionPlan.toString()) {
        throw new Error('You cannot upgrade to your current plan');
      }

      // findOrCreateStripeCustomer
      const stripeCustomer = await findOrCreateStripeCustomer(user, token);

      // fetch the subscription
      const subscriptionToChargeFor = await findSubscriptionById(id);

      const amount = Number(subscriptionToChargeFor.amount) * 100;

      // // update the user data
      // const updatedUser = await updateUser(
      //   {_id: user._id},
      //   {stripeCustomerId: user.stripeCustomerId},
      // );

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
      const subscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          items: [{price: stripePrice.id}],
        },
      );

      // update the current user with subscription id
      await updateUser(
        {_id: user._id},
        {currentSubscriptionPlan: id, stripeSubscriptionId: subscription.id},
      );

      return {message: 'User subscription updated successfully'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default subscriptionMutation;
