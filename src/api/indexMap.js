import * as API from './'

export const getAllIndexMap = params => {
  return API.GET('indexMap', params)
}
//    getIndexsByLevel
//
//    getIndexById
//
//    getIndexChild
export const getIndexsByLevel = params => {
  return API.GET('getIndexsByLevel', params)
}
export const getIndexById = params => {
  return API.GET('getIndexById', params)
}

export const getIndexChild = params => {
  return API.GET('getIndexChild', params)
}

export const insertIndexMap = params => {
  return API.POST('insertIndexMap', params)
}

export const deleteIndexMap = params => {
  return API.GET('deleteIndexMap', params)
}

export const updateIndexMap = params => {
  return API.POST('updateIndexMap', params)
}
