import { Outlet } from 'react-router-dom'
import styles from './Layout.module.scss'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <header>
          <h1 className={styles.title}>GripMovie</h1>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>

        <footer>
          <Navbar />
        </footer>
      </div>
    </div>
  )
}

export default Layout
