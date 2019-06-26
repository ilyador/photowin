const environment = process.env.ENV
const region = process.env.REGION
const authPhotowinampdeva1cef837UserPoolId = process.env.AUTH_PHOTOWINAMPDEVA1CEF837_USERPOOLID
const storagePhotowinpicturesName = process.env.STORAGE_PHOTOWINPICTURES_NAME
const storagePhotowinpicturesArn = process.env.STORAGE_PHOTOWINPICTURES_ARN

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

AWS.config.update({ region: process.env.TABLE_REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient()

let tableName = 'photowinpictures'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV
}

const userIdPresent = false
const partitionKeyName = 'userid'
const partitionKeyType = 'S'
const sortKeyName = 'pictureurl'
const sortKeyType = 'S'
const hasSortKey = sortKeyName !== ''
const path = '/userpictures'
const UNAUTH = 'UNAUTH'
const hashKeyPath = '/:' + partitionKeyName
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : ''


app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param)
    default:
      return param
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function (req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] =
      [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH]
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] =
        [convertUrlType(req.params[partitionKeyName], partitionKeyType)]
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err })
    } else {
      res.json(data.Items)
    }
  })
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] =
        convertUrlType(req.params[partitionKeyName], partitionKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err.message })
    } else {
      if (data.Item) {
        res.json(data.Item)
      } else {
        res.json(data)
      }
    }
  })
})


/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  })
})

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  })
})

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] =
        convertUrlType(req.params[partitionKeyName], partitionKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url })
    } else {
      res.json({ url: req.url, data: data })
    }
  })
})


app.listen(3000, function () {
  console.log('App started')
})

module.exports = app
