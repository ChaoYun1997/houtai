import Mock from 'mockjs2'
import { builder } from '../util'

const titles = [
  'What Is DC Motor?',
  'Automotive and Offroads',
  'Farming and Agriculture',
  'CAN OPEN Communication Protocol',
  'Hoists and Winches',
  'Food Processing',
  'HVAC Systems',
  'Industry and Material Handling',
  'Medical and Healthcare',
  'Farming and Agriculture'
]

const list = [
  'dc motor',
  'engine',
  'brushless dc motor',
  'brushless motor driver'
]

function articles(options) {
  const data = []
  titles.forEach((item, index) => {
    data.push({
      title: item,
      id: index + 1
    })
  })
  return builder({
    data: data
  })
}

function articleCategory() {
  const data = []
  list.forEach((item, index) => {
    data.push({
      name: item,
      id: index + 1
    })
  })
  return builder({
    data: data
  })
}

Mock.mock(/\/sys\/articles/, 'get', articles)
Mock.mock(/\/sys\/articleCategory/, 'get', articleCategory)
