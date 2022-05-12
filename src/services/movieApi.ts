import { axios } from 'hooks/worker'
import { ISearch } from 'types/movie'
import { AxiosResponse } from 'axios'

const url = `http://www.omdbapi.com/?apikey=92e32667`

interface Params {
  s: string
  page: number
}

interface IMovieApi {
  Response: string
  Search: ISearch[]
  totalResults: string
}

export const getMovieAPi = (params: Params) => {
  return axios.get<IMovieApi>(`${url}`, { params })
}

export const totalPageNumberFunc = (res: AxiosResponse<IMovieApi>) => {
  const numTotalResults = Number(res.data.totalResults)
  let totalpageNumber

  if (numTotalResults < 10) {
    totalpageNumber = 1
  } else {
    totalpageNumber = numTotalResults % 10 ? numTotalResults / 10 + 1 : numTotalResults / 10
  }

  return totalpageNumber
}
