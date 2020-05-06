import * as API from './'

export const getAllMapCut = params => {
  return API.GET('MapCut', params)
}
export const insertMapCut = params => {
  return API.POST('insertMapCut', params)
}
export const updateMapCut = params => {
  return API.POST('updateMapCut', params)
}
export const deleteMapCut = params => {
  return API.GET('deleteMapCut', params)
}
export const getModelMapCut = params => {
  return API.GET('getModelMapCut', params)
}
