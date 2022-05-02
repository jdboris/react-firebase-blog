import { Link } from "react-router-dom";
import css from "./header.module.scss";

export function Header({ useFirebaseAuth }) {
  const { user, login, logout, isLoading } = useFirebaseAuth();

  return (
    <header>
      <nav>
        <Link to="/">Homepage</Link>
      </nav>
      <nav>
        {!isLoading &&
          (user ? (
            <>
              {" "}
              {user && user.isAuthor && (
                <Link to="/article/new">New Article</Link>
              )}
              <span onClick={logout}>Logout</span>
            </>
          ) : (
            <>
              <span onClick={login}>Signup</span>
              <span onClick={login}>Login</span>
            </>
          ))}
      </nav>
    </header>
  );
}
