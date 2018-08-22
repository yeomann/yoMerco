const bodyParser = require('body-parser')
const awsInstance = require('../services/aws')
const fs = require('fs')
const Util = require('../util')
const getParameterValue = require('../functions/get-parameter-value')

module.exports = (app) => {
  app.use(
    bodyParser.json({
      limit: '2048kb'
    })
  )

  // Install a "/ping" route that returns "pong"
  app.get('/api/upload', (req, res) => {
    res.send('pong')
  })

  app.post('/api/upload', async (req, res, next) => {
    // Obtengo los attributos
    let formData
    try {
      formData = await Util.getFormData(req)
    } catch (error) {
      return next(error.message)
    }

    if (!formData.fields['path']) {
      let error = new Error('path key is missing')
      return next(error.message)
    }

    let pathToS3 = formData.fields['path']

    // Get the bucket name
    const parameterName = 'BUCKET_NAME'
    let bucketName
    try {
      bucketName = await getParameterValue(parameterName)
    } catch (error) {
      return next(error.message)
    }

    let locations = []
    for (const key in formData.files) {
      // convert the file into a buffer
      const file = formData.files[key]
      const buffer = fs.readFileSync(file.path)

      // Upload the file
      let location
      try {
        location = await awsInstance.uploadFile(
          bucketName,
          buffer,
          `${pathToS3}/${file.originalFilename}`
        )
      } catch (error) {
        console.log('error', error)
        return next(error.message)
      }

      locations.push(location)
    }
    return res.status(200).send(locations)
  })
}
