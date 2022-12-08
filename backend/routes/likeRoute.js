const express = require('express')
const router = express.Router()

const likeController = require('../controllers/likeController')

router
  .post('/:photoId', likeController.addLike)
  .get('/:photoId', likeController.isPhotoLikedByUser)
  .delete('/:photoId', likeController.removeLike)


  module.exports = router