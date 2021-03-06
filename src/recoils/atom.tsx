import { atom } from 'recoil'
import store from 'storejs'

import { ISearch } from 'types/movie'

export const searchMovieList = atom<ISearch[]>({
  key: '#searchMovieList',
  default: [],
})

export const bookmarkMovieList = atom<ISearch[]>({
  key: '#bookmarkMovieList',
  default: store.get('bookmarkMovie') || [],
})

export const bookmarkToggle = atom<{ toggle: boolean; text: string; movieItem?: ISearch | null }>({
  key: '#bookmarkToggle',
  default: {
    toggle: false,
    text: '',
    movieItem: null,
  },
})

export const movieLoading = atom<boolean>({
  key: '#movieLoading',
  default: false,
})
