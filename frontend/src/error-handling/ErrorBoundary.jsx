import React, { useState } from "react";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const errorHandler = (error, errorInfo) => {
    setHasError(true);
    setError(error);
    setErrorInfo(errorInfo);
  };

  if (hasError) {
    // You can customize the error UI here
    return (
      <div>
        <h1>Something went wrong.</h1>
        <p>{error && error.toString()}</p>
        <p>Component Stack Error Details:</p>
        <pre>{errorInfo && errorInfo.componentStack}</pre>
      </div>
    );
  }

  // If there's no error, render the children as usual
  return children;
}

export default ErrorBoundary;
