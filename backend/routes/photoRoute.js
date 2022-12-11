const express = require('express')
const router = express.Router()
const multer = require('multer')
// const { body } = require('express-validator')

const photoController = require('../controllers/photoController')

const fileFilter = (req, file, cb) => {
  const acceptedType = ['image/jpeg', 'image/png', 'image/gif']
  if (acceptedType.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ dest: 'uploads/', fileFilter })

router
  .get('', photoController.getPhotoByUserFollower) 
  .get('/explore', photoController.getPhotosRandom)
  .get('/user/:userId', photoController.getAllphotosByUser) //this one should be in user route
  .get('/:photoId', photoController.getPhotoById)
  .post('', upload.single('image'), photoController.uploadPhoto)
  .delete('/:photoId', photoController.deletePhoto)
  .put(
    '/:photoId',
    upload.single('photo'),
    photoController.editPhotoAndDescription
  )

module.exports = router
