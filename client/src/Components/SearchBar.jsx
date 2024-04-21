import React from 'react'
import styles from '../styles/SearchBar.module.css'

const SearchBar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.searchContainer}>
            <input className={styles.search} type="text" placeholder="Search" />
            <img src="https://cdn-icons-png.flaticon.com/128/2811/2811806.png" alt="search" />
        </div>
    </div>
  )
}

export default SearchBar