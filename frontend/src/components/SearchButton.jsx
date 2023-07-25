import styles from "./SearchButton.module.css";

function SearchButton() {
  return (
    <button type="submit" className={styles["search-button"]}>
      Search
    </button>
  );
}

export default SearchButton;
