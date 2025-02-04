import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

export function getUserOrders(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

export function getOrderDetail(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

export function cancelOrder(id) {
  return request({
    url: `/orders/${id}/cancel`,
    method: 'post'
  })
}

export function payOrder(data) {
  return request({
    url: `/orders/${data.orderId}/pay`,
    method: 'post',
    data: {
      paymentMethod: data.paymentMethod
    }
  })
}

export function getOrderStatistics() {
  return request({
    url: '/orders/statistics',
    method: 'get'
  })
}
// ... existing code ...