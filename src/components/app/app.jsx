import css from "./app.module.scss";
import "../../firebase";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { Header } from "../header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ArticleForm } from "../article-form";
import { ArticleProvider, useArticles } from "../../contexts/articles";
import { Homepage } from "../homepage";

export function App({ theme }) {
  return (
    <Router>
      <div className={theme.root}>
        <FirebaseAuthProvider>
          <ArticleProvider useFirebaseAuth={useFirebaseAuth}>
            <Header useFirebaseAuth={useFirebaseAuth} />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Homepage
                      theme={theme}
                      useFirebaseAuth={useFirebaseAuth}
                      useArticles={useArticles}
                    />
                  }
                ></Route>
                <Route path="articles">
                  <Route
                    path="new"
                    element={
                      <ArticleForm
                        theme={theme}
                        useFirebaseAuth={useFirebaseAuth}
                        useArticles={useArticles}
                        mode="create"
                      />
                    }
                  ></Route>
                  <Route
                    path=":uid"
                    element={
                      <ArticleForm
                        theme={theme}
                        useFirebaseAuth={useFirebaseAuth}
                        useArticles={useArticles}
                        mode="update"
                      />
                    }
                  ></Route>
                </Route>
              </Routes>
            </main>
            <footer></footer>
          </ArticleProvider>
        </FirebaseAuthProvider>
      </div>
    </Router>
  );
}
