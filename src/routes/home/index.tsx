import MovieItem from 'components/MovieItem'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { getMovieAPi, totalPageNumberFunc } from 'services/movieApi'
import styles from './Home.module.scss'
import store from 'storejs'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookmarkToggle, searchMovieList } from 'recoils/atom'
import { useInView } from 'react-intersection-observer'
import { useMount, useUnmount } from 'react-use'
import BookmarkModal from 'components/BookmarkModal'
import { SearchIcon } from 'assets/svgs'

const Home = () => {
  const [searchMovie, setSearchMovie] = useRecoilState(searchMovieList)
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
    getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
      if (res.data.Response === 'False') {
        setSearchMovie([])
      }
    })
  }, [searchInput, setSearchMovie])

  useEffect(() => {
    getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
      if (res.data.Search) {
        const totalPageNumber = totalPageNumberFunc(res)
        setMaxPage(totalPageNumber)

        resetScrollRef.current?.scrollIntoView()
        setSearchMovie(res.data.Search)
      }
    })
  }, [searchInput, setSearchMovie])

  useEffect(() => {
    if (searchMovie.length !== 0 && inView && nowPage.current < maxPage) {
      nowPage.current += 1
      getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
        setSearchMovie((prev) => prev.concat(res.data.Search))
      })
    }
  }, [inView, maxPage, searchInput, searchMovie, setSearchMovie])

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

      {bmToggleValue.toggle && <BookmarkModal bookmarkText={bmToggleValue.text} />}
    </div>
  )
}

export default Home
