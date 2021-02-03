/* eslint-disable no-shadow */
import {
  createCloset,
  findClosetById,
  updateCloset,
} from '../../services/closet';
import {createReport} from '../../services/report';
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

      if (!closetOwner) {
        throw new Error('Closet owner not found');
      }

      // if the user has a closet already, then we need to add item to the closet and update currentClosetSize
      if (closetOwner.closet) {
        // fetch the current users closet
        const myCloset = await findClosetById(closetOwner.closet);

        if (!myCloset) {
          throw new Error('closet not found');
        }

        const updatedCloset = await updateCloset(
          {_id: myCloset._id},
          {
            itemsIn: myCloset.itemsIn + input.items.length,
            $push: {items: input.items},
          },
        );

        // filter out the dresses
        const dresses = 0;
        // filter out the accessories
        const accessories = 0;
        // filter out the shoes
        const shoes = 0;

        // generate report
        const createdReport = await createReport({
          numberOfItems: updatedCloset.numberOfItems,
          items: updatedCloset.items,
          user: updatedCloset.user,
          datetimePicked: updatedCloset.datetimePicked,
          stat: {
            numberOfItems: updatedCloset.numberOfItems,
            accessories,
            dresses,
            shoes,
          },
          condition: 'good',
        });

        // update the current user
        await updateUser(
          {_id: input.userId},
          {
            currentClosetSize: updatedCloset.itemsIn,
            $push: {reports: createdReport._id},
          },
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

      //filter out the dresses
      const dresses = 0;
      // filter out the accessories
      const accessories = 0;
      // filter out the shoes
      const shoes = 0;

      // generate report
      const createdReport = await createReport({
        numberOfItems: createdCloset.numberOfItems,
        items: createdCloset.items,
        user: createdCloset.user,
        datetimePicked: createdCloset.datetimePicked,
        stat: {
          numberOfItems: createdCloset.numberOfItems,
          accessories,
          dresses,
          shoes,
        },
        condition: 'good',
      });

      // add the created closet to the user
      await updateUser(
        {_id: input.userId},
        {
          closet: createdCloset._id,
          currentClosetSize: createdCloset.itemsIn,
          $push: {reports: createdReport._id},
        },
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
  async updateOneItemNameMe(_, {id, name}, {user}) {
    try {
      // must be done by an admin
      if (!user) {
        throw new Error('You must be logged In');
      }

      if (!user.closet) {
        throw new Error('Closet owner not found');
      }

      // find the user we want to add item to their closet
      const closet = await findClosetById(user.closet);

      if (!closet) {
        throw new Error('Closet owner not found');
      }

      // const item = await fetchOneItem(id, closet._id);
      const item = await closet.items.id(id);

      if (!item) {
        throw new Error('Item not found');
      }

      item.set({name: name});

      const updatedCloset = await closet.save();

      return item;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || 'Error while updating item in closet');
    }
  },
};

export default closetMutation;
