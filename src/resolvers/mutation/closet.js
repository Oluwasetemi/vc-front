/* eslint-disable no-shadow */
import {
  createCloset,
  findClosetById,
  updateCloset,
} from '../../services/closet';
import {createReport} from '../../services/report';
import {findRequestById} from '../../services/request';
import {findUserById, updateUser} from '../../services/user';

// get the id of the items added to closet
export function getIdOfItemsAddToCloset(closet, numberOfItems) {
  const items = JSON.parse(JSON.stringify(closet.items));

  // slice the last set of items added based on the number of items added
  const newItems = items.slice(-numberOfItems).map((item) => item._id);

  return newItems;
}

export function classifyItems(items) {
  // filter out the dresses
  const shirt = items.filter((item) => item.type === 'Shirt').length || 0;
  const dresses = items.filter((item) => item.type === 'Dress').length || 0;
  // filter out the accessories
  const accessories =
    items.filter((item) => item.type === 'Accessories').length || 0;
  // filter out the shoes
  const shoes = items.filter((item) => item.type === 'Shoe').length || 0;

  return {dresses, accessories, shoes, shirt};
}

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

      if (!input.items[0].pickup) {
        throw new Error('pickup must be set along');
      }

      // pickup status checked must be active
      const pickupRequest = await findRequestById(input.items[0].pickup);

      if (!pickupRequest) {
        throw new Error('Pick up not found');
      }

      if (pickupRequest.status !== 'Active') {
        throw new Error('Request must be active before you can add a new Item');
      }

      // find the user we want to add item to their closet
      const closetOwner = await findUserById(input.userId);

      // check if the user's subscription plan and closet capacity for
      // Storage (Dress + Shirts) Clothing Items,
      // Accessories
      // shoes

      // check the number of items from pickup === input.items
      if (pickupRequest.numberOfItems !== input.items.length) {
        throw new Error(
          'You must add equal number of items and the pickup request',
        );
      }

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

        // loop thru items and add updateAt and createdAt
        for (const item of input.items) {
          item.createdAt = new Date();
          item.updatedAt = new Date();
        }

        const updatedCloset = await updateCloset(
          {_id: myCloset._id},
          {
            itemsIn: myCloset.itemsIn + input.items.length,
            $push: {items: input.items},
          },
        );

        const {dresses, shirt, accessories, shoes} = classifyItems(input.items);

        const resultItems = getIdOfItemsAddToCloset(
          updatedCloset,
          pickupRequest.numberOfItems,
        );

        // generate report
        const createdReport = await createReport({
          numberOfItems: pickupRequest.numberOfItems,
          items: resultItems,
          user: input.userId,
          datetimePicked: pickupRequest.datetimePicked,
          stat: {
            numberOfItems: pickupRequest.numberOfItems,
            accessories,
            dresses,
            shoes,
            shirt,
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

      // loop thru items and add updateAt and createdAt
      for (const item of input.items) {
        item.createdAt = new Date();
        item.updatedAt = new Date();
      }

      const createdCloset = await createCloset({
        items: input.items,
        itemsIn: input.items.length,
      });

      // filter out the dresses
      const shirt =
        input.items.filter((item) => item.type === 'Shirt').length || 0;
      const dresses =
        input.items.filter((item) => item.type === 'Dress').length || 0;
      // filter out the accessories
      const accessories =
        input.items.filter((item) => item.type === 'Accessories').length || 0;
      // filter out the shoes
      const shoes =
        input.items.filter((item) => item.type === 'Shoe').length || 0;

      const resultItems = getIdOfItemsAddToCloset(
        createdCloset,
        pickupRequest.numberOfItems,
      );

      // generate report
      const createdReport = await createReport({
        numberOfItems: pickupRequest.numberOfItems,
        items: resultItems,
        user: input.userId,
        datetimePicked: pickupRequest.datetimePicked,
        stat: {
          numberOfItems: pickupRequest.numberOfItems,
          accessories,
          dresses,
          shoes,
          shirt,
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
