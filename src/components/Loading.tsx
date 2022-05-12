import styles from './Loading.module.scss'

const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loader} />
    </div>
  )
}

export default Loading
