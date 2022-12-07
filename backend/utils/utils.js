'use strict'

const httpError = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}

const errorCode = {
  400: 'Bad request',
  500: 'Internal Server Error',
  401: 'Unauthorized',
  403: 'Unauthenticated'
}

//specific error, so we do not need to repeat httErrors and write the same error code again and again
const badRequestError = (message) => httpError(400, message ?? errorCode[400])
const internalServerError = () => httpError(500, errorCode[500])
const unauthorizedError = () => httpError(401, errorCode[401])
const unauthenticatedError = () => httpError(403, errorCode[403])

module.exports = {
  httpError,
  badRequestError,
  internalServerError,
  unauthorizedError,
  unauthenticatedError
}
