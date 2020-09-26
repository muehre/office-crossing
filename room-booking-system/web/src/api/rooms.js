import React from 'react'
import moment from 'moment'
import api from './init'

const basePath = 'http://localhost:7000'

export function listRooms() {
  return api.get(basePath + '/rooms').then(res => res.data)
}
