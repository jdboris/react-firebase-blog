import css from "./app.module.scss";
import "../../firebase";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { Header } from "../header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PostForm } from "../post-form/post-form";
import { PostProvider, usePosts } from "../../contexts/posts";

export function App({ theme }) {
  return (
    <Router>
      <div className={theme.theme}>
        <FirebaseAuthProvider>
          <PostProvider>
            <Header useFirebaseAuth={useFirebaseAuth} />
            <main>
              <Routes>
                <Route path="posts">
                  <Route
                    path="new"
                    element={
                      <PostForm
                        useFirebaseAuth={useFirebaseAuth}
                        usePosts={usePosts}
                        mode="create"
                      />
                    }
                  ></Route>
                </Route>
              </Routes>
            </main>
            <footer></footer>
          </PostProvider>
        </FirebaseAuthProvider>
      </div>
    </Router>
  );
}
