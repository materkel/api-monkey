'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const express = require('express');
const apiMonkey = require('../index');
const app = express();
const port = process.env.PORT || process.env.port || 3000;

app.use(apiMonkey());

app.get('/test', (req, res) => {
  console.log('sending...');
  res.json({ test: true });
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
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(100);
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
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.lessThan(100);
        }
        done(err);
      });
  });

  it('should be successfully delayed', done => {
    let startTime = new Date().getTime();
    supertest(app)
      .get('/test')
      .set('Monkey_GET_test', '1000/none')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!err && res) {
          let endTime = new Date().getTime();
          let executionTime = endTime - startTime;
          expect(executionTime).to.be.greaterThan(500);
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
          expect(executionTime).to.be.lessThan(100);
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
          expect(executionTime).to.be.greaterThan(500);
        }
        done(err);
      });
  });
});
