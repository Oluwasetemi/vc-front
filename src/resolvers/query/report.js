/* eslint-disable no-shadow */
import {findAllReports, findReportById} from '../../services/report';

const reportQueries = {
  async fetchAllUserReport(_, args, {user}) {
    try {
      // must be done by an admin
      if (!user || user === null) {
        throw new Error("You're not logged in");
      }

      const query = {};

      if (args.type) {
        query.type = args.type;
      }

      if (args.first) {
        query.first = args.first;
      }

      if (args.start) {
        query.start = args.start;
      }

      if (args.sort) {
        query.sort = args.sort;
      }

      if (args.sortBy) {
        query.sortBy = args.sortBy;
      }

      if (args.userId) {
        query.userId = args.userId;
      }

      const {report, total} = await findAllReports(query);

      if (!report) {
        throw new Error('report data not found');
      }
      if (!total) {
        throw new Error('report data not found');
      }

      const results = {};
      results.total = total;
      results.data = report;

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async fetchOneReport(_, {id}, {user}) {
    // must be done by an admin
    if (!user || user === null) {
      throw new Error("You're not logged in");
    }

    const report = await findReportById(id);

    if (!report) {
      throw new Error(`Error find report with ${id}`);
    }

    return report;
  },
};

export default reportQueries;
