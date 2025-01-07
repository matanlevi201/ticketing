import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops! Something went wrong.</h1>
        <p>Status: {error.status}</p>
        <p>{error.statusText}</p>
      </div>
    );
  }
};

export default ErrorElement;
