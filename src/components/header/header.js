import css from "./header.module.scss";

export function Header({ useFirebaseAuth }) {
  const { user, login, logout } = useFirebaseAuth();

  return (
    <header>
      <nav>
        {user ? (
          <span onClick={logout}>Logout</span>
        ) : (
          <>
            <span onClick={login}>Signup</span>
            <span onClick={login}>Login</span>
          </>
        )}
      </nav>
    </header>
  );
}
