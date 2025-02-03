import request from '@/utils/request'

export function getResourceList(params) {
  return request({
    url: '/resources',
    method: 'get',
    params
  })
}

export function getResourceDetail(id) {
  return request({
    url: `/resources/${id}`,
    method: 'get'
  })
}

export function createResource(data) {
  return request({
    url: '/resources',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return request({
    url: `/resources/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: `/resources/${id}`,
    method: 'delete'
  })
}

export function getRecommendations(userId) {
  return request({
    url: `/recommendations/${userId}`,
    method: 'get'
  })
}

export function getResourceCategories() {
  return request({
    url: '/resources/categories',
    method: 'get'
  })
}

export function getResourceTags() {
  return request({
    url: '/resources/tags',
    method: 'get'
  })
} 