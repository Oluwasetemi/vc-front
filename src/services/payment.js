import stripe from '../utils/stripe';

export const findOrCreateStripeCustomer = async (dbUser, token) => {
  if (dbUser.stripeCustomerId) {
    // This Stripe service returns a source object
    const newSource = await stripe.customers.createSource(
      dbUser.stripeCustomerId,
      {source: token},
    );

    const stripeCustomer = await stripe.customers.update(
      dbUser.stripeCustomerId,
      {default_source: newSource.id},
    );

    return stripeCustomer;
  } else {
    // First payment
    return stripe.customers.create({
      email: dbUser.email,
      source: token,
    });
  }
};
