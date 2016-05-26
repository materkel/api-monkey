# API-Monkey

Middleware for testing multi layered express APIs.
docs coming soon...

## Usage

Add API-Monkey to your express applications

```
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

```
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
```
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

Get Error on a request

```
  headers: {
    'monkey_get_test': 'none/true'
  }
```

Get delayed Error on a request

```
  headers: {
    'monkey_get_test': '1000/true'
  }
```

### Multi-layered/deep API requests

Forward API-Monkey headers in your applications to reach and control deeper nested Endpoints

```
  app.use(apiMonkey());

  app.get('/test', (req, res) => {
    request
      .get({
        uri: '/test2',
        headers: req.monkeyHeaders
      })
      .then(testData => {
        res.json(testData);
      });
  });
```
