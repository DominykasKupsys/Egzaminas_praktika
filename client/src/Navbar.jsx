import React from "react";
import { useNavigate } from "react-router-dom";
export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          Navbar
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-link active" aria-current="page" href="/">
              Home
            </a>
            <a class="nav-link" href="/create">
              Create
            </a>
            {user && (
              <a class="nav-link" href="/profile">
                Profile
              </a>
            )}
            {user && user.role === 1 && (
              <a class="nav-link" href="/adminpanel">
                Admin Panel
              </a>
            )}
          </div>
          <div className="ms-auto">
            {user ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
