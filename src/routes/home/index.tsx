import MovieItem from 'components/MovieItem'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { getMovieAPi } from 'services/movieApi'
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
  const resetScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<any>(null)

  const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchInput !== changeInput) {
      nowPage.current = 1
    }

    if (searchInput === changeInput) {
      resetScrollRef.current?.scrollIntoView()
    }

    inputRef.current.placeholder = changeInput
    setChangeInput('')
    setSearchInput(changeInput)
  }

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setChangeInput(e.currentTarget.value)
  }

  useMount(() => {
    store.get('bookmarkMovie') || store.set('bookmarkMovie', [])
    inputRef.current.focus()
  })

  // 검색 결과 -> 리팩토링
  useEffect(() => {
    getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
      if (res.data.Response === 'False') {
        setSearchMovie([])
      }

      if (res.data.Search) {
        const pageNumber =
          Number(res.data.totalResults) % 10
            ? Number(res.data.totalResults) / 10 + 1
            : Number(res.data.totalResults) / 10

        setMaxPage(pageNumber)
        resetScrollRef.current?.scrollIntoView()
        setSearchMovie(res.data.Search)
      }
    })
  }, [searchInput, setSearchMovie])
  // 검색결과 -> 리팩토링

  // 페이지네이션 -> 리팩토링
  useEffect(() => {
    if (inView && nowPage.current < maxPage) {
      nowPage.current += 1
      getMovieAPi({ s: searchInput, page: nowPage.current }).then((res) => {
        setSearchMovie((prev) => prev.concat(res.data.Search))
      })
    }
  }, [inView, maxPage, searchInput, setSearchMovie])
  // 페이지네이션 -> 리팩토링

  useUnmount(() => setSearchMovie([]))

  return (
    <div className={styles.homeWrapper}>
      <form onSubmit={handleSubmitSearch}>
        <input type='text' value={changeInput} ref={inputRef} onChange={handleChangeSearch} />
        <button type='submit'>
          <SearchIcon className={styles.searchIcon} />
        </button>
      </form>

      <ul>
        {searchMovie.length === 0 ? (
          <span className={styles.noMovieText}>검색 결과가 없습니다.</span>
        ) : (
          <div>
            <div ref={resetScrollRef} />
            {bmToggleValue.toggle && <BookmarkModal bookmarkText={bmToggleValue.text} />}
            {searchMovie.map((movieItem) => (
              <MovieItem key={movieItem.imdbID} movieItem={movieItem} />
            ))}
            <div ref={movieDataFetchRef} />
          </div>
        )}
      </ul>
    </div>
  )
}

export default Home
