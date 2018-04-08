# Simple push notification service

## Setup
Check that your Node.js version is `9.4.0` or above:
```
node -v
```
Install the dependencies:
```
npm install
```
Run the unit tests:
```
npm test
```
Start the service on port 3000:
```
npm start
```

## API

### POST /users
Adds a new user and access token pair. Returns a `409` status if the user already exists.

#### Request
Field         | Type   | Description
------------- | ------ | -------------------------------------
`username`    | string | Name associated with the access token
`accessToken` | string | Pushbullet access token

#### Example
```
curl --header 'Content-Type: application/json' \
     --data '{"username":"ben","accessToken":"<access_token>"}' \
     --request POST \
     http://localhost:3000/users
```

#### Response
```json
{
  "username": "ben",
  "accessToken": "<access_token>",
  "creationTime": "2018-04-08T18:13:56.195Z",
  "numOfNotificationsPushed": 0
}
```

### GET /users
Returns all of the users added to the service.

#### Request
```
curl http://localhost:3000/users
```

#### Response
```json
[
  {
    "username": "ben",
    "accessToken": "<access_token>",
    "creationTime": "2018-04-08T18:13:56.195Z",
    "numOfNotificationsPushed": 0
  }
]
```

### POST /push/:username
Sends a push notification to `:username`. Returns a `404` status if the user does not exist.

#### Request
Field   | Type   | Description
------- | ------ | ------------------------------------------
`title` | string | Message title
`body`  | string | Message body
`type`  | string | Must be `note` or `link`
`url`   | string | Must be present if `type` is set to `link`

#### Example
```
curl --header 'Content-Type: application/json' \
     --data '{"title":"Greetings","body":"Hello, world!","type":"note"}' \
     --request POST \
     http://localhost:3000/push/ben
```

#### Response
```json
{
  "title": "Greetings",
  "body": "Hello, world!",
  "type": "note"
}
```
