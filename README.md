[![Build Status](https://travis-ci.org/mfressdorf/api-monkey.svg?branch=master)](https://travis-ci.org/mfressdorf/api-monkey)

# API-Monkey

Middleware for test simulations with multi layered [Express](http://expressjs.com/) APIs.  
Delay requests to specific API Endpoints and return custom Error codes.

## Usage

Add API-Monkey to your express applications

```js
  const express = require('express');
  const apiMonkey = require('../index');
  const app = express();

  app.use(apiMonkey());

  app.get('/test', (req, res) => {
    res.status(200).end();
  });

  app.listen(3000);
```

Then add information about which API Endpoints you want to delay/error in the header of your requests.

```js
  const request = require('request-promise');

  request
    .get({
      uri: 'http://localhost:3000/test',
      headers: { 'monkey_get_test': '1000/none' }
    })
    .then(res => {
      // delayed response by ~1000ms
    })
```


## Options

### Request Headers

Delay requests to /test/:id
```js
  request
    .get({
      uri: '/test/12345',
      headers: { 'monkey_get_test_12345': '500/none'}
    })
    .then(res => {
      // delayed response by ~500ms
    })
    ...
```

Get Error on a request (default Error statuscode is 500)

```js
  headers: {
    'monkey_get_test': 'none/true'
  }
```

Get custom Errorcode on a request

```js
  headers: {
    'monkey_get_test': 'none/404'
  }
```

Get delayed Error on a request

```js
  headers: {
    'monkey_get_test': '1000/true'
  }
```

### Multi-layered/deep API requests

Forward API-Monkey headers in your applications to reach and control deeper nested Endpoints

```js
  app.use(apiMonkey());

  app.get('/test', (req, res) => {
    request
      .get({
        uri: '/test2',
        headers: req.monkeyHeaders // API-Monkey adds all monkey request headers to the express request object
      })
      .then(testData => {
        res.json(testData);
      });
  });
```

### Wildcards

Match route paths with wildcards. (currently supports: "\*" for single path tokens and "\*\*" for all remaining path tokens)

```js
request
    .get({
      uri: '/aggregationApi',
      headers: { 'monkey_get_info_*': '500/none'}
    })
    .then(res => {
      // delayed response by ~500ms from the GET /info/:whatever API
    })
```

Other examples:

```js
headers: { 'monkey_get_users_*_stories' : 'none/500' } // matches routes like: GET users/:id/stories
```

```js
headers: { 'monkey_get_users_**' : 'none/500' } // matches routes like: GET users/../...
```
