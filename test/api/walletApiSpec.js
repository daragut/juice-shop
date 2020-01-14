/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const frisby = require('frisby')

const API_URL = 'http://localhost:3000/api'
const REST_URL = 'http://localhost:3000/rest'

const jsonHeader = { 'content-type': 'application/json' }
let authHeader // eslint-disable-line

beforeAll(() => {
  return frisby.post(REST_URL + '/user/login', {
    headers: jsonHeader,
    body: {
      email: 'jim@juice-sh.op',
      password: 'ncc-1701'
    }
  })
    .expect('status', 200)
    .then(({ json }) => {
      authHeader = { Authorization: 'Bearer ' + json.authentication.token, 'content-type': 'application/json' }
    })
})

describe('/api/Wallets', () => {
  it('GET wallet is forbidden via public API', () => {
    return frisby.get(API_URL + '/Wallets')
      .expect('status', 401)
  })

  it('GET wallet retrieves wallet amount of requesting user', () => {
    return frisby.get(API_URL + '/Wallets', {
      headers: authHeader
    })
      .expect('status', 200)
      .expect('header', 'content-type', /application\/json/)
      .expect('json', {
        data: 100
      })
  })

  it('PUT wallet is forbidden via public API', () => {
    return frisby.put(API_URL + '/Wallets', {
      body: {
        balance: 10
      }
    })
      .expect('status', 401)
  })

  it('GET wallet retrieves wallet amount of requesting user', () => {
    return frisby.put(API_URL + '/Wallets', {
      headers: authHeader,
      body: {
        balance: 10
      }
    })
      .expect('status', 200)
      .then(({ json }) => {
        return frisby.get(API_URL + '/Wallets', {
          headers: authHeader
        })
          .expect('status', 200)
          .expect('header', 'content-type', /application\/json/)
          .expect('json', {
            data: 110
          })
      })
  })
})
