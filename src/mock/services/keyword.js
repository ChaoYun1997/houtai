import Mock from 'mockjs2'
import { builder } from '../util'

const keywords = [
  {
    id: 0,
    keyword: 'Auto-door Motor',
    count: 10
  },
  {
    id: 1,
    keyword: 'Small DC Motor Driver',
    count: 14
  },
  {
    id: 2,
    keyword: 'Low Voltage Motor Controller',
    count: 12
  },
  {
    id: 3,
    keyword: '2000w Motor Controller',
    count: 5
  },
  {
    id: 4,
    keyword: 'AC/ DC Convert Driver',
    count: 6
  }
]

function keyword() {
  return builder({
    data: keywords
  })
}

Mock.mock(/\/sys\/keyword/, 'get', keyword)
