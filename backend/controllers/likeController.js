"use strict"
const likeModel = require("../models/likeModel")

// Add like to photos
const addLike = async (req, res) => {
    const photoId = req.params.photoId
    await likeModel.addLike(req.user.user_id, photoId, res)
    res.status(201).json({ message: "Like added"})
}

// Remove like from photos
const removeLike = async (req, res) => {
  const photoId = req.params.photoId
  const result = await likeModel.removeLike(req.user.user_id, photoId, res)
  if (result.affectedRows > 0) {
    res.json({ message: "Like removed" })
  }
}

// Checking if the photo is liked by a user
const isPhotoLikedByUser = async (req, res) => {
  const photoId = req.params.photoId
  const result = await likeModel.getLikeStatusByPhotoId(req.user.user_id, photoId, res)
  console.log(result)
}

module.exports = {
  addLike,
  removeLike,
  isPhotoLikedByUser
}