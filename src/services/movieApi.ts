import { axios } from 'hooks/worker'
import { ISearch } from 'types/movie'

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
