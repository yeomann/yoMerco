const multiparty = require('multiparty')
const moment = require('moment-timezone')

/**
 * Function to get the no present keys in a object
 * @param {array} keys
 * @param {Object} object
 * @returns {array}
 */
function getMissinKeys (keys, object) {
  const array = keys
    .map(element => {
      const hasOwnProperty = Object.prototype.hasOwnProperty.call(
        object,
        element
      )
      if (!hasOwnProperty) {
        return element
      }

      return null
    })
    .filter(element => element !== null)
  return array
}

/**
 * Function to validate if an object has the all keys that send in keys param
 *
 * @param {any} keys
 * @param {any} object
 * @returns
 */
function validateKeys (keys, object) {
  const array = keys
    .map(element => {
      const hasOwnProperty = Object.prototype.hasOwnProperty.call(
        object,
        element
      )
      if (hasOwnProperty) { return element }

      return null
    })
    .filter(element => element !== null)
  if (array.length > 0) { return true }

  return false
}

/**
 * Function to generate a random string
 *
 * @return {String}
 */
function generateRandomString () {
  let value = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let index = 0
  while (index < 15) {
    value += possible.charAt(Math.floor(Math.random() * possible.length))
    index += 1
  }
  return value
}

const validateValueInKeys = (keys, value) => keys.includes(value)

/**
 * Function to generate a date adding the days
 *
 * @return {Date}
 */
function addDaysFromDate (startDate, numberOfDays) {
  const returnDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + numberOfDays,
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds()
  )
  return returnDate
}

/**
 * Funcion para optener el archivo de una petición
 *
 * @param {Request} req
 * @returns {Promise}
 */
function getFormData (req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      let fieldsToReturn = []
      for (const key in fields) {
        fieldsToReturn[key] = fields[key][0]
      }

      let filesToReturn = []
      for (const key in files) {
        filesToReturn[key] = files[key][0]
      }

      const response = {
        fields: fieldsToReturn,
        files: filesToReturn
      }
      return resolve(response)
    })
  })
}

/**
 * Funcion para obtener la fecha formateada
 *
 * @param {String} [date=null]
 * @param {String} format
 * @returns
 */
const getFormattedDate = (date = null, format) => {
  const timeZone = 'America/Bogota'
  let formettedDate = null
  if (date === null) {
    formettedDate = moment().tz(timeZone).format(format)
  } else {
    formettedDate = moment(date).tz(timeZone).format(format)
  }
  return formettedDate
}

/**
 * Funcion encargada de retornar un objeto de la clase Error
 *
 * @param {String} errorMessage
 * @param {Number} statusCode
 * @returns {Object} de la clase Error
 */
const returnError = (errorMessage, statusCode) => {
  const error = new Error(errorMessage)
  error.status = statusCode
  return error
}

module.exports = {
  getMissinKeys,
  validateKeys,
  generateRandomString,
  validateValueInKeys,
  addDaysFromDate,
  getFormData,
  getFormattedDate,
  returnError
}
