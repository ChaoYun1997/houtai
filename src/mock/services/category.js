import Mock from 'mockjs2'
import { builder } from '../util'

const categorys = [
  {
    id: 0,
    category: 'Auto-door Motor',
    count: 10
  },
  {
    id: 1,
    category: 'Small DC Motor Driver',
    count: 14
  },
  {
    id: 2,
    category: 'Low Voltage Motor Controller',
    count: 12
  },
  {
    id: 3,
    category: '2000w Motor Controller',
    count: 5
  },
  {
    id: 4,
    category: 'AC/ DC Convert Driver',
    count: 6
  }
]

function category() {
  return builder({
    data: categorys
  })
}

Mock.mock(/\/sys\/category/, 'get', category)
