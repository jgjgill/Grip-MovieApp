import BookmarkModal from 'components/BookmarkModal'
import MovieItem from 'components/MovieItem'
import { useRecoilValue } from 'recoil'
import { bookmarkMovieList, bookmarkToggle } from 'recoils/atom'
import styles from './Bookmark.module.scss'

const Bookmark = () => {
  const bmMovieList = useRecoilValue(bookmarkMovieList)
  const bmToggleValue = useRecoilValue(bookmarkToggle)

  return (
    <div className={styles.bookmarkWrapper}>
      <h1 className={styles.title}>내 즐겨찾기</h1>

      <ul>
        {bmMovieList.length === 0 ? (
          <span className={styles.noBookmarkMovieText}>즐겨찾기를 추가해주세요.</span>
        ) : (
          <div>
            {bmToggleValue.toggle && <BookmarkModal bookmarkText={bmToggleValue.text} />}
            {bmMovieList?.map((bookmarkItem) => (
              <MovieItem key={bookmarkItem.imdbID} movieItem={bookmarkItem} />
            ))}
          </div>
        )}
      </ul>
    </div>
  )
}

export default Bookmark
