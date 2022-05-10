import { ISearch } from 'types/movie'
import styles from './MovieItem.module.scss'
import store from 'storejs'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookmarkToggle, bookmarkMovieList } from 'recoils/atom'
import { BookmarkInon, ExclamationCircleIcon } from 'assets/svgs'
import { SyntheticEvent, useEffect, useState } from 'react'
import cx from 'classnames'

interface MovieItemProps {
  movieItem: ISearch
  innerRef?: any
  innerProvided?: any
  [key: string]: any
}

const MovieItem = ({ movieItem, innerRef, innerProvided }: MovieItemProps) => {
  const [bmToggle, setBmToggle] = useRecoilState(bookmarkToggle)
  const [draggableProps, setDraggableProps] = useState(null)
  const [dragHandleProps, setDragHandleProps] = useState(null)
  const bookmarkIdList = useRecoilValue(bookmarkMovieList).map((item) => item.imdbID)

  const handleClick = () => {
    const bookmarIdList = store.get('bookmarkMovie').map((item: ISearch) => item.imdbID)

    bookmarIdList.includes(movieItem.imdbID)
      ? setBmToggle({ ...bmToggle, toggle: !bmToggle.toggle, text: '즐겨찾기 제거', movieItem })
      : setBmToggle({ ...bmToggle, toggle: !bmToggle.toggle, text: '즐겨찾기', movieItem })
  }

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://www.svgrepo.com/show/157825/error.svg'
  }

  useEffect(() => {
    if (innerProvided) {
      setDraggableProps(innerProvided.draggableProps)
      setDragHandleProps(innerProvided.dragHandleProps)
    }
  }, [innerProvided])

  return (
    <li ref={innerRef} {...draggableProps} {...dragHandleProps}>
      <div role='button' tabIndex={0} className={styles.movieItem} onClick={handleClick}>
        {movieItem.Poster === 'N/A' ? (
          <ExclamationCircleIcon className={styles.exclamationCircleIcon} />
        ) : (
          <img src={movieItem.Poster} onError={handleImgError} alt={movieItem.Title} />
        )}

        <div className={styles.movieIntroWrapper}>
          <div className={styles.introMain}>
            <span className={styles.movieTitle}>{movieItem.Title}</span>
            <time className={styles.movieYear} dateTime={movieItem.Year}>
              ({movieItem.Year})
            </time>
          </div>

          <div className={styles.introSub}>
            <span className={styles.movieType}>{movieItem.Type}</span>
            <BookmarkInon
              className={cx(styles.bookmarkIcon, { [styles.temp]: bookmarkIdList.includes(movieItem.imdbID) })}
            />
          </div>
        </div>
      </div>
    </li>
  )
}
export default MovieItem
