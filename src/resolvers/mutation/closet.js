import {createCloset} from '../../services/closet';

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

      await createCloset({items: input});

      return {message: `${input && input.length} Items added successfully`};
    } catch (error) {
      console.error(error.message);
      throw new Error(error.data.error || 'Error while creating a request');
    }
  },
};

export default closetMutation;
