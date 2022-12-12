'use strict'
const photoModel = require('../models/photoModel')
const { validationResult } = require('express-validator')
const { getCoordinates, makeThumbnail } = require('../utils/image')

// Get all photos by a specific user
const getAllphotosByUser = async (req, res) => {
  const photos = await photoModel.getAllPhotosByUser(req.params.userId, res)
  res.json(photos)
}

// Get photo by photo id
const getPhotoById = async (req, res) => {
  const photo = await photoModel.getPhotoById(req.params.photoId, res)
  if (photo) {
    console.log('photo', photo)
    res.json(photo)
  } else {
    res.status(404).json({ message: 'photo controller' })
  }
}

// Get photos randomly
const getPhotosRandom = async (req, res) => {
  const photo = await photoModel.getPhotoRandomly(req, res)
  if (photo) {
    res.json(photo)
  } else {
    res.status(404)
  }
}

// Create new photo
const uploadPhoto = async (req, res) => {
  const errors = validationResult(req)
  console.log('validation errors', errors)
  //file empty or missing (not passing multer's fileFilter in route)
  if (!req.file) {
    res.status(400).json({ message: 'file missing or invalid' })
  } else if (errors.isEmpty()) {
    const photo = req.body
    await makeThumbnail(req.file.path, req.file.filename)
    photo.userId = req.user.user_id
    photo.coords = JSON.stringify(await getCoordinates(req.file.path))
    photo.filename = req.file.filename
    console.log('create a new post: ', photo)
    const photoId = await photoModel.addPhoto(photo, res)
    res.status(201).json({ message: 'post created', photoId })
  } else {
    res
      .status(400)
      .json({ message: 'post creation failed', errors: errors.array() })
  }
}

// Delete a photo
const deletePhoto = async (req, res) => {
  const result = await photoModel.deletePhotosById(
    req.params.photoId,
    req.user,
    res
  )
  console.log('photo deleted', result)
  if (result.affectedRows > 0) {
    res.json({ message: 'photo deleted' })
  } else {
    res.status(401).json({ message: 'photo delete failed' })
  }
}

// Get photos by user's followers
const getPhotoByUserFollower = async (req, res) => {
  const photo = await photoModel.getPhotoByFollower(req.user.user_id, res)
  if (photo.length < 1) {
    res.json(photo)
  } else {
    res.sendStatus(404)
  }
}

module.exports = {
  getAllphotosByUser,
  getPhotoById,
  uploadPhoto,
  deletePhoto,
  getPhotoByUserFollower,
  getPhotosRandom
}
