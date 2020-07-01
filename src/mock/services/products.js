import Mock from 'mockjs2'
import { builder } from '../util'

const imgs = [
  'http://a3.ldycdn.com/cloud/mrBqmKqiRlpSroiipjnp/GP78-motor-60-60.jpg',
  'http://a3.ldycdn.com/cloud/lpBqmKqiRlqSkmmplmnm/BL4805F-60-60.jpg',
  'http://a3.ldycdn.com/cloud/liBqmKqiRlqSkmiqrnnp/BL2210F-60-60.jpg',
  'http://a3.ldycdn.com/cloud/lmBqmKqiRlqSmpnpmlnm/BL48D10-60-60.jpg',
  'http://a2.ldycdn.com/cloud/liBqmKqiRlqSjolknnnp/2-60-60.jpg',
  'http://a2.ldycdn.com/cloud/ljBqmKqiRlqSjqnrjrnq/DC-Motor-63ZY90-60-60.jpg',
  'http://a2.ldycdn.com/cloud/loBqmKqiRlqSkqpmlmnm/DC-Motor-80ZYT102-60-60.jpg',
  'http://a2.ldycdn.com/cloud/liBqmKqiRlqSjolknnnp/2-60-60.jpg',
  'http://a2.ldycdn.com/cloud/lrBqmKqiRlqSmpqnilnm/BLDC-Motor-110BL170-60-60.jpg',
  'http://a2.ldycdn.com/cloud/lqBqmKqiRlqSiprkpinq/DC-Motor-78ZYT12-60-60.jpg'
]

const name = [
  'DC Motor 78ZYT110',
  'BLDC Motor Driver BL4805F',
  'BLDC Motor 80BL',
  'BLDC Motor 180BL',
  'DC Motor 63ZYT100'
]

const shopModel = ['78ZYT110', 'BL4805F', '80BL', '180BL', '63ZYT100']

// const category = ['Brushless Motor Driver', 'Brushless DC Motor', 'PMDC Motor ', 'Brushless DC Motor', 'PMDC Motor ']

const date = [
  '2020-06-11 16:31:06',
  '2019-08-22 14:53:35 ',
  '2019-08-23 10:42:57',
  '2019-08-22 14:18:01 ',
  '2019-08-22 14:02:26 '
]
const links = [
  'https://www.baidu.com',
  'https://www.qq.com',
  'https://www.weibo.com',
  'https://www.sohu.com',
  'https://www.taobao.com'
]

const totalCount = 10

const skus = ['color', 'size', 'material', 'power', 'type', 'diameter', 'voltage', 'speed']

function getTags() {
  const tagNum = parseInt(Math.random() * (2 + 1), 10)
  const tags = ['新产品', '热点产品', '推荐产品']
  const arr = []
  for (let i = 0; i <= tagNum; i++) {
    const num = parseInt(Math.random() * (2 + 1), 10)
    if (!arr.includes(tags[num])) arr.push(tags[num])
  }
  return arr
}

const productList = options => {
  // const parameters = getQueryParameters(options)
  const result = []
  // const pageNo = parseInt(parameters.pageNo)
  // const pageSize = parseInt(parameters.pageSize)
  // const totalPage = Math.ceil(totalCount / pageSize)
  // const key = (pageNo - 1) * pageSize
  // const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 0; i < 10; i++) {
    const randNum = parseInt(Math.random() * (4 + 1), 10)
    const booleanNum = parseInt(Math.random() * (1 + 1), 10)
    // const tmpKey = key + i
    result.push({
      id: i,
      shopImg: imgs[i],
      shopTitle: name[randNum],
      shopModel: shopModel[randNum],
      catId: randNum,
      updateDate: date[randNum],
      isShelve: booleanNum !== 0,
      shopTags: getTags(),
      shopUrl: links[randNum]
    })
  }
  return builder({
    // pageSize: pageSize,
    // pageNo: pageNo,
    totalCount: totalCount,
    // totalPage: totalPage,
    data: result
  })
}

const category = ['PMDC Motor', 'DC Hydraulic Pump Motor', 'Brushless DC Motor', 'Brushless Motor Driver']

const productCategory = () => {
  const data = []
  category.forEach((item, index) => {
    const num = parseInt(Math.random() * (20 + 1), 10)
    data.push({
      id: index,
      catName: item,
      shops: num,
      catUrl: '',
      catPage: '',
      catDetailPage: ''
    })
  })
  return builder({
    data: data
  })
}

const setCategory = options => {
  return builder({
    data: 'success'
  })
}

const delProduct = options => {
  return builder({
    data: 'success'
  })
}

const sellAction = options => {
  return builder({
    data: 'success'
  })
}

const skuList = () => {
  return builder({
    data: skus
  })
}

Mock.mock(/\/sys\/shop\/shops/, 'get', productList)
Mock.mock(/\/sys\/productCategory/, 'get', productCategory)
Mock.mock(/\/sys\/setCategory/, 'post', setCategory)
Mock.mock(/\/sys\/delProduct/, 'post', delProduct)
Mock.mock(/\/sys\/sellAction/, 'post', sellAction)
Mock.mock(/\/sys\/skuList/, 'get', skuList)
