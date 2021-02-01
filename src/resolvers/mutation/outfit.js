import {
  createOutfit,
  findOutfitById,
  updateOutfit,
} from '../../services/outfit';
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
      await updateUser(
        {_id: args.userId},
        {$push: {outfit: createdOutfit._id}},
      );

      return {message: `outfit created successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while creating an outfit');
    }
  },
  async updateOutfitMutation(_, {input: {id, ...dataToBeUpdated}}, {user}) {
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
  async updateUserOutfitMutation(_, {id, dataToBeUpdated}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      // if (user.type !== 'ADMIN') {
      //   throw new Error('You do not have the permission to do this');
      // }

      // check if the outfit was created by the user
      const checkIfUserOwnsOutfit = Array.from(user.outfit)
        .map((each) => each.toString())
        .includes(id);

      if (!checkIfUserOwnsOutfit) {
        throw new Error('Update user outfit failed');
      }

      const outfitToBeUpdated = await findOutfitById(id);

      // loop thru dataToBeUpdated and add to the subscriptionToBeUpdated
      if (dataToBeUpdated) {
        for (const each in dataToBeUpdated) {
          if (each === 'tags') {
            if (Object.keys(dataToBeUpdated).includes(each)) {
              outfitToBeUpdated.tags.addToSet(...dataToBeUpdated.tags);
            }
            continue;
          }

          if (each === 'items') {
            if (Object.keys(dataToBeUpdated).includes(each)) {
              outfitToBeUpdated.items.addToSet(...dataToBeUpdated.items);
            }
            continue;
          }
          outfitToBeUpdated[each] = dataToBeUpdated[each];
        }
      }

      // final update
      const res = await outfitToBeUpdated.save();

      return res;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while updating an outfit');
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

      const updatedOutfit = await updateOutfit(
        {_id: id},
        {$push: {items: items}},
      );

      return {message: `${items.length} Items added to outfit successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while adding item to an outfit');
    }
  },
  async likeAnOutfit(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      const updatedOutfit = await updateOutfit({_id: id}, {liked: true});

      return {message: `Outfit liked successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while adding item to an outfit');
    }
  },
  async unlikeAnOutfit(_, {id}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      const updatedOutfit = await updateOutfit({_id: id}, {liked: false});

      return {message: `Outfit unliked successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while adding item to an outfit');
    }
  },
};

export default outfitMutation;
