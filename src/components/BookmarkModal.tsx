import { useRecoilState } from 'recoil'
import { bookmarkMovieList, bookmarkToggle } from 'recoils/atom'
import styles from './BookmarkModal.module.scss'
import store from 'storejs'

interface BookmarkModalProps {
  bookmarkText: string
}

const BookmarkModal = ({ bookmarkText }: BookmarkModalProps) => {
  const [bmToggle, setBmToggle] = useRecoilState(bookmarkToggle)
  const [, setBmMovieList] = useRecoilState(bookmarkMovieList)

  const modalOutClick = () => {
    setBmToggle({ ...bmToggle, toggle: !bmToggle })
  }

  const handleToggleClick = () => {
    if (bookmarkText === '즐겨찾기') {
      store.set('bookmarkMovie', [...store.get('bookmarkMovie'), bmToggle.movieItem])
      setBmMovieList(store.get('bookmarkMovie'))
    }

    if (bookmarkText === '즐겨찾기 제거') {
      store.set(
        'bookmarkMovie',
        [...store.get('bookmarkMovie')].filter((item) => item.imdbID !== bmToggle.movieItem?.imdbID)
      )
      setBmMovieList(store.get('bookmarkMovie'))
    }

    setBmToggle({ ...bmToggle, toggle: !bmToggle })
  }

  const handleResetClick = () => {
    setBmToggle({ ...bmToggle, toggle: !bmToggle })
  }

  return (
    <div className={styles.bookmarkButtonWrapper}>
      <button type='button' onClick={modalOutClick} className={styles.modalClickButton}>
        <div />
      </button>

      <div className={styles.bookmarkModal}>
        <span>{`${bookmarkText}할까요?`}</span>

        <div className={styles.buttonWrapper}>
          <button type='button' onClick={handleToggleClick}>
            {bookmarkText}
          </button>

          <button type='button' onClick={handleResetClick}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookmarkModal
