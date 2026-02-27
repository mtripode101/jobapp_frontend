import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>
          <Link className="app-title-link" to="/">
            JobApplication - Job search and Info
          </Link>
        </h1>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">Created By Carlos Martin Tripode</footer>
    </div>
  );
}

export default Layout;
