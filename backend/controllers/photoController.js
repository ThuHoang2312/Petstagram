"use strict"
const photoModel = require("../models/photoModel")
const { validationResult } = require("express-validator")

const getAllphotosByUser = async (req, res) => {
  const photos = await photoModel.getAllphotosByUser(res)
  res.json(photos)
}

const getPhotoById = async (req, res) => {
  const photo = await photoModel.getPhotoById(req.params.photoId, res)
  if (photo) {
    res.json(photo)
  } else {
    res.sendStatus(404)
  }
}

const editPhotoAndDescription = async (req, res) => {
  console.log('editPhotoAndDescription')
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const photo = req.body
    photo.description = req.body.description
    photo.filename = req.file.filename
    if (req.params.photoId) {
      photo.photoId = req.params.photoId
    }
    const result = await photoModel.updateDescriptionAndPhotoById(photo, res)
    if (result.affectedRows > 0) {
      res.json({ message: "photo modified: " + photo.photoId })
    }
  } else {
    res.status(401).json({ message: "photo modify failed" })
  }
}

const editDescription = async (req, res) => {
  console.log('edit desc')
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const photo = req.body
    photo.description = req.body.description
    if (req.params.photoId) {
      photo.photoId = req.params.photoId
    }
    const result = await photoModel.updateDescriptionById(photo, res)
    if (result.affectedRows > 0) {
      res.json({ message: "photo modified: " + photo.photoId })
    }
  } else {
    res.status(401).json({ message: "photo modify failed" })
  }
}

const uploadPhoto = async (req, res) => {
  const errors = validationResult(req)
  console.log("validation errors", errors)
  //file empty or missing (not passing multer's fileFilter in route)
  if (!req.file) {
    res.status(400).json({ message: "file missing or invalid" })
  } else if (errors.isEmpty()) {
    const photo = req.body
    // photo.user_id = req.user.user_id
    photo.filename = req.file.filename
    photo.createdAt = new Date()
    console.log("create a new post: ", photo)
    const photoId = await photoModel.addPhoto(photo, res)
    res.status(201).json({ message: "post created", photoId })
  } else {
    res
      .status(400)
      .json({ message: "post creation failed", errors: errors.array() })
  }
}

const deletePhoto = async (req, res) => {
  const result = await photoModel.deletePhotosById(
    req.params.photoId,
    req.user.user_id,
    req.user.role,
    res
  )
  console.log("photo deleted", result)
  if (result.affectedRows > 0) {
    res.json({ message: "photo deleted" })
  } else {
    res.status(401).json({ message: "photo delete failed" })
  }
}

module.exports = {
  getAllphotosByUser,
  getPhotoById,
  editDescription,
  uploadPhoto,
  deletePhoto,
  editPhotoAndDescription
}

