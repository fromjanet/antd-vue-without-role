import * as API from './'

export const insertCol = params => {
  return API.GET('insertCol', params)
}

export const getAllCity = params => {
  return API.GET('getAllCity', params)
}

export const deleteCollect = params => {
  return API.GET('deleteCollect', params)
}
