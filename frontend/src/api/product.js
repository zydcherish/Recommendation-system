import request from '@/utils/request'

// 获取产品列表
export function getProducts(params) {
  return request({
    url: '/resources',
    method: 'get',
    params
  })
}

// 获取热门产品
export function getHotProducts() {
  return request({
    url: '/resources/hot',
    method: 'get'
  })
}

// 获取产品详情
export function getProductDetail(id) {
  return request({
    url: `/resources/${id}`,
    method: 'get'
  })
} 