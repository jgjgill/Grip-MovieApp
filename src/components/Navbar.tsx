import styles from './Navbar.module.scss'
import { Link } from 'react-router-dom'
import { BookmarkInon, SearchIcon } from 'assets/svgs'

const Navbar = () => {
  return (
    <nav>
      <ul className={styles.nav}>
        <li>
          <Link to='/'>
            <SearchIcon className={styles.searchIcon} />
          </Link>
        </li>

        <li>
          <Link to='/bookmark'>
            <BookmarkInon className={styles.bookmarkIcon} />
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
