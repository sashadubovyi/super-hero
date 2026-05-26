import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" style={{ color: "#e50914" }}>Go home</Link>
    </div>
  );
}

export default NotFound;