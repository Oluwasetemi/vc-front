import Report from '../models/report';

export const createReport = (data) => Report.create(data);

export const findOneReportBasedOnQuery = (data) => Report.findOne(data);

export const findBasedOnQuery = (data) => Report.find(data);

export const findReportById = (id) => Report.findById(id);

export const findReportByIdPopulated = (id) =>
  Report.findById(id).populate('hra');

export const findReportsByIds = async (ids) => {
  const result = [];
  for (const each of ids) {
    const report = await Report.findById(each);

    delete report.password;
    result.push(report);
  }

  return result;
};

export const findAllReports = async (query = {}) => {
  const sortObject = {};
  const limit = query.first;
  const skip = query.start;
  if (query.sort && query.sortBy) {
    sortObject[query.sortBy] = `${query.sort}`;
  }

  const report = await Report.find({user: query.userId})
    .limit(limit)
    .skip(skip)
    .sort(sortObject);
  const total = await Report.countDocuments({user: query.userId});

  return {report, total: total};
};
export const removeReport = (id) => Report.findByIdAndRemove(id);

export const updateReport = (query, data) =>
  Report.findOneAndUpdate(query, data, {new: true, runValidators: true});

export const deleteReport = (id) => Report.deleteOne({_id: id});

export const search = async ({searchInput, id}) => {
  const report = await Report.find(
    {$text: {$search: searchInput}, company: id},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  return report;
};

export const fetchReportCount = async (data = {}) => {
  const count = await Report.countDocuments(data);
  return count;
};
