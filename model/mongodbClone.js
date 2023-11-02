//Schema Imports

const countryClone = require('../schema/clone/country_clone')
const laneClone = require('../schema/clone/lane_clone')
const scheduleClone = require('../schema/clone/schedule_clone')

//DB Collection Schema
const dbClone = {
  countryClone,
  laneClone,
  scheduleClone,
}

const insertSingleDocument = async (collection, document) => {
  try {
    let result = await dbClone[collection].create(document)

    return result;
  } catch (error) {
    console.error("Error inserting document: ", error)

    throw error;
  }
}
// Function to retrieve paginated results from a collection
const getPaginatedData = async (collection, filter, options, pageNumber, pageSize) => {
  try {
    let skipCount = (pageNumber - 1) * pageSize, totalCount, documents
    totalCount = await dbClone[collection].countDocuments(filter)
    documents = await dbClone[collection].find(filter, options).sort({ createdAt: -1 }).skip(skipCount).limit(pageSize)

    return { totalCount, documents }
  } catch (error) {
    console.error("Error:", error);
  }
}

const performCaseInsensitiveSearch = async (collection, options, fields, searchTerm, pageNumber, pageSize) => {
  let skipCount = (pageNumber - 1) * pageSize, query, totalCount, documents
  // const query = { [field]: { $regex: searchTerm, $options: 'i' } };
  query = {
    $or: fields.map(field => ({ [field]: { $regex: searchTerm, $options: 'i' } }))
  };

  totalCount = await dbClone[collection].countDocuments(query);

  documents = await dbClone[collection].find(query, options).sort({ createdAt: -1 }).skip(skipCount).limit(pageSize)

  return { totalCount, documents }
};

module.exports = {
  insertSingleDocument,
  getPaginatedData,
  performCaseInsensitiveSearch
}