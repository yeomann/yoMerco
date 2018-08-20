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
    // Obtengo el file
    let file
    try {
      file = await Util.getFileFromRequest(req)
    } catch (error) {
      return next(error.message)
    }
    if (!file) return new Error('file not found.')

    // convierto el file en un buffer
    const buffer = fs.readFileSync(file.path)

    const parameterName = 'BUCKET_NAME'
    let bucketName
    try {
      bucketName = await getParameterValue(parameterName)
    } catch (error) {
      return next(error.message)
    }

    let location
    try {
      location = await awsInstance.uploadFile(
        bucketName,
        buffer,
        `test/${file.originalFilename}`
      )
    } catch (error) {
      console.log('Hola', error)
      return next(error.message)
    }

    res.send(location)
  })
}
