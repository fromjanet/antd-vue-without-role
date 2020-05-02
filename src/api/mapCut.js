import * as API from './'

export const getAllMapCut = params => {
  return API.GET('MapCut', params)
}
