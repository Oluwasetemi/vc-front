import {
  createCloset,
  findClosetById,
  updateCloset,
} from '../../services/closet';
import {findRequestById} from '../../services/request';
import {findUserById, updateUser} from '../../services/user';

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

      // pickup status checked must be active
      const pickRequest = await findRequestById(input.items[0].pickupId);

      if (pickRequest.status !== 'Active') {
        throw new Error('Request must be active before you can add a new Item');
      }

      // find the user we want to add item to their closet
      const closetOwner = await findUserById(input.userId);

      if (closetOwner) {
        throw new Error('Closet owner not found');
      }

      // if the user has a closet already, then we need to add item to the closet and update currentClosetSize
      if (closetOwner.closet) {
        // fetch the current users closet
        const myCloset = await findClosetById(user.closet);

        const updatedCloset = await updateCloset(
          {_id: user.closet},
          {
            itemsIn: myCloset.itemsIn + input.items.length,
            $push: {items: input.items},
          },
        );

        // update the current user
        await updateUser(
          {_id: input.userId},
          {currentClosetSize: updatedCloset.itemsIn},
        );

        return {
          message: `${
            input && input.items && input.items.length
          } Items added successfully`,
        };
      }

      const createdCloset = await createCloset({
        items: input.items,
        itemsIn: input.items.length,
      });

      // add the created closet to the user
      await updateUser(
        {_id: input.userId},
        {closet: createdCloset._id, currentClosetSize: createdCloset.itemsIn},
      );

      return {
        message: `${
          input && input.items && input.items.length
        } Items added successfully`,
      };
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while adding item to closet');
    }
  },
};

export default closetMutation;
