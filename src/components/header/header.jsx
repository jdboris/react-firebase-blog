import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useEffect } from "react";

export function Header({ theme, useFirebaseAuth, useSettings }) {
  const { currentUser, login, logout, isLoading } = useFirebaseAuth();
  const { logo } = useSettings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header>
      <nav className={theme.container + " " + (isMenuOpen ? theme.open : "")}>
        {logo ? (
          <Link to="/" className={theme.logo}>
            <img src={logo.url} />
          </Link>
        ) : (
          <Link to="/">Home</Link>
        )}

        <div
          className={theme.overlay}
          onClick={(e) => {
            setIsMenuOpen(false);
            e.target.closest("header").scrollTo({ top: 0 });
          }}
        ></div>

        {!isLoading &&
          (currentUser ? (
            <ul
              onFocus={(e) => {
                e.target.closest("header").scrollTo({ top: 0 });
                if (
                  e.target.getBoundingClientRect().top + 5 >=
                  e.target.closest("header").getBoundingClientRect().bottom
                ) {
                  setIsMenuOpen(true);
                }
              }}
            >
              {currentUser && currentUser.isAuthor && (
                <li>
                  <Link to="/article/new">New Article</Link>
                </li>
              )}

              <li>
                <Link to={`/user/${currentUser.id}`}>Profile</Link>
              </li>

              {currentUser && currentUser.isAdmin && (
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
              )}

              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <button onClick={login}>Login</button>
              </li>
            </ul>
          ))}

        <button
          className={theme.buttonAlt}
          onFocus={(e) => {
            e.target.closest("header").scrollTo({ top: 0 });
          }}
          onClick={(e) => {
            e.target.closest("header").scrollTo({ top: 0 });
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {!isMenuOpen ? <FaBars /> : <IoClose />}
        </button>
      </nav>
    </header>
  );
}
