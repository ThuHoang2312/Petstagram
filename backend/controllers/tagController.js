'use strict'
const tagModel = require('../models/tagModel')

// Add tag
const addTag = async (req, res) => {
  const tagNameArray = req.body.tag
  tagNameArray.forEach(async(tag) => {
    const tagName = await tagModel.getTagName(tag, res)
    if(tagName.length == 0){
      await tagModel.addTag(tag, res)
    }
  });
  res.status(201).json({ message: 'Tag added' })
}

const deleteTag = async (req, res) => {
  const tagId = req.params.tagId
  const result = await tagModel.deleteTag(tagId, res)
  if (result.affectedRows > 0) {
    res.json({ message: "Tag removed" })
  } 
}



module.exports = { addTag, deleteTag }
