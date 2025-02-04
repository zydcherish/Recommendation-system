import request from '@/utils/request'

// 获取产品列表
export function getProducts(params) {
  return request({
    url: '/resources',
    method: 'get',
    params
  })
}

// 获取产品详情
export function getProductDetail(id) {
  console.log('调用产品详情API, ID:', id)
  return request({
    url: `/resources/${id}`,
    method: 'get'
  })
}

// 获取热门产品
export function getHotProducts() {
  console.log('调用热门产品API')
  return request({
    url: '/resources/hot',
    method: 'get'
  })
}

// 获取推荐产品
export function getRecommendProducts() {
  return request({
    url: '/recommend/products',
    method: 'get'
  })
} 