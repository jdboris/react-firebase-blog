import { Link } from "react-router-dom";

export function Header({ theme, useFirebaseAuth, useSettings }) {
  const { currentUser, login, logout, isLoading } = useFirebaseAuth();
  const { logo } = useSettings();

  return (
    <header>
      <div className={theme.container}>
        <nav>
          {logo ? (
            <Link to="/" className={theme.logo}>
              <img src={logo.url} />
            </Link>
          ) : (
            <Link to="/">Home</Link>
          )}
        </nav>
        <nav>
          {!isLoading &&
            (currentUser ? (
              <>
                {currentUser && currentUser.isAuthor && (
                  <>
                    <Link to="/article/new">New Article</Link>
                  </>
                )}

                <Link to={`/user/${currentUser.id}`}>Profile</Link>

                {currentUser && currentUser.isAdmin && (
                  <Link to="/settings">Settings</Link>
                )}

                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <span onClick={login}>Signup</span>
                <span onClick={login}>Login</span>
              </>
            ))}
        </nav>
      </div>
    </header>
  );
}
