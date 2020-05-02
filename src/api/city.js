import * as API from './'

export const getAllCity = params => {
  return API.GET('City', params)
}
