import {createOutfit, findOutfitById} from '../../services/outfit';
import {updateUser} from '../../services/user';

const outfitMutation = {
  // subscription
  async createOutfit(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const createdOutfit = await createOutfit({
        name: args.name,
        description: args.description,
        items: args.items,
        user: args.userId,
        tags: args.tags,
        recommendations: args.recommendations,
      });

      // add the created closet to the user
      await updateUser({_id: args.userId}, {outfit: createdOutfit._id});

      return {message: `outfit created successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while creating an outfit');
    }
  },
  async updateOutfitMutation(_, {id, dataToBeUpdated}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const outfitToBeUpdated = await findOutfitById(id);

      // loop thru dataToBeUpdated and add to the subscriptionToBeUpdated
      if (dataToBeUpdated) {
        for (const each in dataToBeUpdated) {
          outfitToBeUpdated[each] = dataToBeUpdated[each];
        }
      }

      // final update
      await outfitToBeUpdated.save();

      return {message: `outfit updated successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.data.error || 'Error while updating an outfit');
    }
  },
  async addItemToOutfit(_, {id, items}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (user.type !== 'ADMIN') {
        throw new Error('You do not have the permission to do this');
      }

      const updatedOutfit = await updatedOutfit(
        {_id: id},
        {$push: {items: items}},
      );

      return {message: `Items added to outfit successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while adding item to an outfit');
    }
  },
};

export default outfitMutation;
