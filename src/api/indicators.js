import * as API from './'

export const getAllIndicators = params => {
  return API.GET('indicators', params)
}

export const getThirdIndicators = params => {
  return API.GET('thirdIndicators', params)
}
