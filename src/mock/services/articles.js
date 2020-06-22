import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const titles = ['Alipay', 'Angular', 'Ant Design', 'Ant Design Pro', 'Bootstrap', 'React', 'Vue', 'Webpack']

const avatar = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
]

function articles() {
  console.log(avatar, titles)
}

Mock.mock(/\/api\/articles/, 'get', articles)
