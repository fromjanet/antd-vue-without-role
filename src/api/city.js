import * as API from './'

export const getAllCity = params => {
  return API.GET('City', params)
}

export const updateCity = params => {
  return API.POST('updateCity', params)
}

export const getCityById = params => {
  return API.GET('getCityById', params)
}
