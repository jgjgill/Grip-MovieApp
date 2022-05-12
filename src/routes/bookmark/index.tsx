import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import store from 'storejs'

import { bookmarkMovieList, bookmarkToggle } from 'recoils/atom'
import { ISearch } from 'types/movie'
import BookmarkModal from 'components/BookmarkModal'
import MovieItem from 'components/MovieItem'
import styles from './Bookmark.module.scss'

const reorder = (list: ISearch[], startIndex: number, endIndex: number): ISearch[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Bookmark = () => {
  const [bmMovieList, setBmMovieList] = useRecoilState(bookmarkMovieList)
  const bmToggleValue = useRecoilValue(bookmarkToggle)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items: ISearch[] = reorder(bmMovieList, result.source.index, result.destination.index)

    setBmMovieList(items)
  }

  useEffect(() => {
    store.set('bookmarkMovie', bmMovieList)
  }, [bmMovieList])

  return (
    <div className={styles.bookmarkWrapper}>
      <h1 className={styles.title}>내 즐겨찾기</h1>
      {bmMovieList.length === 0 && <span className={styles.noBookmarkMovieText}>즐겨찾기를 추가해주세요.</span>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='bookmarkDroppable'>
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {bmMovieList.map((bookmarkItem, i) => (
                <Draggable key={bookmarkItem.imdbID} draggableId={bookmarkItem.imdbID} index={i}>
                  {(innerProvided) => (
                    <MovieItem
                      movieItem={bookmarkItem}
                      innerRef={innerProvided.innerRef}
                      innerProvided={innerProvided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {bmToggleValue.toggle && <BookmarkModal bookmarkText={bmToggleValue.text} />}
    </div>
  )
}

export default Bookmark
