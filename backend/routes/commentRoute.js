const express = require('express')
const router = express.Router()

const commentController = require('../controllers/commentController')

router
  .post('/:photoId', commentController.uploadComment)
  .get('/:photoId', commentController.getAllCommentsByPhotoId)
  .delete('/:commentId', commentController.removeComment)

  module.exports = router
