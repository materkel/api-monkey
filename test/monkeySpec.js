'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const express = require('express');
const request = require('request-promise');
const apiMonkey = require('../index');
const app = express();
const port = process.env.PORT || process.env.port || 3000;

app.use(apiMonkey());

app.get('/test', (req, res) => {
  request.get({
    uri: `http://localhost:${port}/nested`,
    headers: req.monkeyHeaders
  })
  .then(data => {
    res.status(200).end();
  });
});

app.get('/nested', (req, res) => {
  res.status(200).end();
});

app.listen(port);
console.log(`API-Monkey Test API listening at ${port}`);

/**
 * API Monkey Test Specs
 */
describe('A normal Request', () => {
  it('should be successful', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(200);
        }
        done(err);
      });
  });
});

describe('A monkey Request', () => {
  it('should be successful with none parameters', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', 'none/none')
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(200);
        }
        done(err);
      });
  });

  it('should be successfully delayed', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', '1000/none')
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.greaterThan(1000);
        }
        done(err);
      });
  });

  it('should throw an error', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', 'none/true')
      .expect(500)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(200);
        }
        done(err);
      });
  });

  it('should throw a custom error', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', 'none/404')
      .expect(404)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(200);
        }
        done(err);
      });
  });

  it('should throw a delayed error', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', '1000/true')
      .expect(500)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.greaterThan(1000);
        }
        done(err);
      });
  });

  it('should be delayed with forwarded monkey header', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_nested', '1000/none')
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.greaterThan(1000);
        }
        done(err);
      });
  });
});
