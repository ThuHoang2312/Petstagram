"use strict"
const commentModel = require("../models/commentModel")
const { validationResult } = require("express-validator")

const uploadComment = async (req, res) => {
  const errors = validationResult(req)
  console.log("validation errors", errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    console.log("create a new comment: ", comment)
    const result = await commentModel.addComment(comment, photoId, res)
    res.status(201).json({ message: "post created", result })
  } else {
    res
      .status(400)
      .json({ message: "post creation failed", errors: errors.array() })
  }
}

const modifyComment = async (req, res) => {
  const errors = validationResult(req)
  console.log("validation errors", errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    const result = await commentModel.editComment(comment, req.user, photoId, res)
    if (result.affectedRows > 0) {
      res.json({ message: "Comment modified" })
    }
  } else {
    res.status(401).json({ message: "user modify failed" })
  }
}

const removeComment = async (req, res) => {
  const errors = validationResult(req)
  console.log("validation errors", errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    const result = await commentModel.deleteComment(comment, req.user, photoId, res)
    if (result.affectedRows > 0) {
      res.json({ message: "Comment modified" })
    }
  } else {
    res.status(401).json({ message: "user modify failed" })
  }
}

module.export = {
  uploadComment,
  modifyComment,
  removeComment
}

