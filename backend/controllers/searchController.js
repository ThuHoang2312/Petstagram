'use strict'
const searchModel = require('../models/searchModel')

const getDataForSearch = async (req, res) => {
  const searchQuery = req.query.query //need to change according to frontend
  const data = await searchModel.getDataForSearch(searchQuery, res)
  res.json(data)
}
module.exports = {
  getDataForSearch
}
