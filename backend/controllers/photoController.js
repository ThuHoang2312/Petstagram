"use strict"
const photoModel = require("../models/photoModel")
const { validationResult } = require("express-validator")

const getAllphotosByUser = async (req, res) => {
  const photos = await photoModel.getAllPhotos(res)
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

const editPhoto = async (req, res) => {
  const errors = validationResult(req)
  console.log("validation errors", errors)
  if (errors.isEmpty()) {
    const photo = req.body
    if (req.params.catId) {
      photo.id = req.params.catId
    }
    const result = await photoModel.updatePhotoById(photo, req.user.user_id, req.user.role, res)
    if (result.affectedRows > 0) {
      res.json({ message: "photo modified: " + photo.id })
    }
  } else {
    res.status(401).json({ message: "cat modify failed" })
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
    photo.owner = req.user.user_id
    photo.filename = req.file.filename
    console.log("create a new post: ", photo)
    const photoId = await photoModel.addPhoto(photo, res)
    res.status(201).json({ message: "cat created", photoId })
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
  editPhoto,
  uploadPhoto,
  deletePhoto
}

