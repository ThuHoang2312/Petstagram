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
  if (result.length == 0) {
    res.json({ message: false })
  } else {
    res.json({ message: true })
  }
}

// Count likes in a photo
const countLikesByPhoto = async (req, res) => {
  const photoId = req.params.photoId
  const result = await likeModel.getAllLikesByPhoto(photoId, res)
  if (result) {
    res.json(result.length)
  } else {
    res.status(404).json({ message: false })
  }
}

module.exports = {
  addLike,
  removeLike,
  isPhotoLikedByUser,
  countLikesByPhoto
}