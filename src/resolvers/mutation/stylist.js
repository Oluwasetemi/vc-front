import {send} from '../../mail/mail';
import {createStylist, findStylistById} from '../../services/stylist';

const stylistMutation = {
  // subscription
  async createStylist(_, {input}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const createdStylist = await createStylist({
        name: input.name,
        email: input.email,
        bio: input.bio,
        tags: input.tags,
        strength: input.tags,
      });

      // send email to stylist that they have been added to virtual closets as a stylist
      // send email to the new user
      await send({
        filename: 'new_user_stylist',
        to: user.email,
        subject: 'Welcome to Virtual Closet As A Stylist',
        email: createdStylist.email,
        password: '12345678',
      });

      return {message: `stylist created successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while creating an stylist');
    }
  },
  async updateStylistMutation(_, {id, input}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const stylistToBeUpdated = await findStylistById(id);

      if (!stylistToBeUpdated) {
        throw new Error('the stylist to update not found');
      }

      // loop thru dataToBeUpdated and add to the subscriptionToBeUpdated
      // name, email, bio, image, tags, strength
      if (input) {
        for (const each in input) {
          stylistToBeUpdated[each] = input[each];

          if (Object.keys(input).includes('tags')) {
            stylistToBeUpdated.tags.addToSet(...input.tags);
          }

          if (Object.keys(input).includes('strength')) {
            stylistToBeUpdated.strength.addToSet(...input.strength);
          }
        }
      }

      // final update
      await stylistToBeUpdated.save();

      return {message: `outfit updated successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while updating an stylist');
    }
  },
};

export default stylistMutation;
