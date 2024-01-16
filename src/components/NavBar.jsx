import { useNavigate } from "react-router-dom";

function NavBar({ isLogin, logout, action }) {
  const navigate = useNavigate();
  const [handleExpanded] = action;

  return (
    <nav className="navbar bg-body-tertiary bg-light" style={{}}>
      <div className="container-fluid justify-content-start h-100">
        {isLogin ? (
          <div
            className="h-100"
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "start",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => handleExpanded("search")}
            >
              Search
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleExpanded("requests")}
            >
              Requests
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleExpanded("suggestion")}
            >
              Suggestion
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleExpanded("update")}
            >
              Profile
            </button>
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div
            className="w-auto h-100"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
