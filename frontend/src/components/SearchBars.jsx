import ErrorBoundary from "../error-handling/ErrorBoundary";
import styles from "./SearchBar.module.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function SearchBar() {
  return (
    <ErrorBoundary>
      <div className="d-flex justify-content-center mt-3">
        {" "}
        {/* Bootstrap class for centering */}
        <input
          type="text"
          placeholder="Search here"
          className={`form-control ${styles["search-bar"]}`} // Use Bootstrap class and CSS Module class
        />
      </div>
    </ErrorBoundary>
  );
}

export default SearchBar;
