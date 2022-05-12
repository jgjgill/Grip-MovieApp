import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useInView } from 'react-intersection-observer'
import store from 'storejs'

import { bookmarkToggle, movieLoading, searchMovieList } from 'recoils/atom'
import { getMovieAPi, totalPageNumberFunc } from 'services/movieApi'
import { useMount, useUnmount } from 'react-use'
import { SearchIcon } from 'assets/svgs'
import BookmarkModal from 'components/BookmarkModal'
import MovieItem from 'components/MovieItem'
import Loading from 'components/Loading'
import styles from './Home.module.scss'

const Home = () => {
  const [searchMovie, setSearchMovie] = useRecoilState(searchMovieList)
  const [movieApiLoading, setMovieApiLoading] = useRecoilState(movieLoading)
  const bmToggleValue = useRecoilValue(bookmarkToggle)

  const [changeInput, setChangeInput] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [maxPage, setMaxPage] = useState<number>(1)

  const { ref: movieDataFetchRef, inView } = useInView()

  const nowPage = useRef(1)
  const resetScrollRef = useRef<HTMLLIElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput !== changeInput) {
      nowPage.current = 1
    }

    if (searchInput === changeInput) {
      resetScrollRef.current?.scrollIntoView()
    }

    if (inputRef.current !== null) {
      inputRef.current.placeholder = changeInput
    }

    setChangeInput('')
    setSearchInput(changeInput)
  }

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setChangeInput(e.currentTarget.value)
  }

  useMount(() => {
    store.get('bookmarkMovie') || store.set('bookmarkMovie', [])
    if (inputRef.current !== null) {
      inputRef.current.focus()
    }
  })

  useEffect(() => {
    if (searchInput === '') return

    getMovieAPi({ s: searchInput, page: nowPage.current })
      .then((res) => {
        if (res.data.Response === 'False') {
          setSearchMovie([])
          setMaxPage(1)
        }
      })
      .catch(() => {
        setSearchMovie([])
        setMaxPage(1)
      })
  }, [searchInput, setSearchMovie])

  useEffect(() => {
    if (searchInput === '') return
    setMovieApiLoading(true)

    getMovieAPi({ s: searchInput, page: 1 })
      .then((res) => {
        if (res.data.Search) {
          const totalPageNumber = totalPageNumberFunc(res)
          setMaxPage(totalPageNumber)

          resetScrollRef.current?.scrollIntoView()
          setSearchMovie(res.data.Search)
        }
      })
      .finally(() => setMovieApiLoading(false))
  }, [searchInput, setSearchMovie, setMovieApiLoading])

  useEffect(() => {
    if (inView && maxPage > 1) {
      nowPage.current += 1
    }
  }, [inView, maxPage])

  useEffect(() => {
    if (searchInput === '') return

    if (inView && nowPage.current < maxPage) {
      getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
        if (res.data.Search) {
          setSearchMovie((prev) => prev.concat(res.data.Search))
        }
      })
    }
  }, [inView, maxPage, searchInput, setSearchMovie])

  useEffect(() => {
    if (searchMovie.length > 10 && inView) {
      setMovieApiLoading(true)
    } else {
      setMovieApiLoading(false)
    }
  }, [inView, searchMovie, setMovieApiLoading])

  useUnmount(() => setSearchMovie([]))

  return (
    <div className={styles.homeWrapper}>
      <form onSubmit={handleSubmitSearch}>
        <input type='text' value={changeInput} ref={inputRef} onChange={handleChangeSearch} />
        <button type='submit'>
          <SearchIcon className={styles.searchIcon} />
        </button>
      </form>

      {searchMovie.length === 0 && <span className={styles.noMovieText}>검색 결과가 없습니다.</span>}

      <ul>
        <li ref={resetScrollRef} />
        {searchMovie.map((movieItem) => (
          <MovieItem key={movieItem.imdbID} movieItem={movieItem} />
        ))}
        <li ref={movieDataFetchRef} />
      </ul>

      {movieApiLoading && <Loading />}
      {bmToggleValue.toggle && <BookmarkModal bookmarkText={bmToggleValue.text} />}
    </div>
  )
}

export default Home
