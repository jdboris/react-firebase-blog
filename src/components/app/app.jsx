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
import { SettingsForm } from "../settings-form";
import { SettingsProvider, useSettings } from "../../contexts/settings";

export function App({ theme }) {
  return (
    <Router>
      <div className={theme.root}>
        <FirebaseAuthProvider>
          <SettingsProvider useFirebaseAuth={useFirebaseAuth}>
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
                        useSettings={useSettings}
                      />
                    }
                  ></Route>
                  <Route
                    path="settings"
                    element={
                      <SettingsForm
                        theme={theme}
                        useFirebaseAuth={useFirebaseAuth}
                        useSettings={useSettings}
                      />
                    }
                  ></Route>

                  <Route path="article">
                    <Route
                      path=":uid"
                      element={
                        <ArticleForm
                          key="uid"
                          theme={theme}
                          useFirebaseAuth={useFirebaseAuth}
                          useArticles={useArticles}
                          useSettings={useSettings}
                          mode="read"
                        />
                      }
                    ></Route>
                    <Route
                      path="new"
                      element={
                        <ArticleForm
                          key="new"
                          theme={theme}
                          useFirebaseAuth={useFirebaseAuth}
                          useArticles={useArticles}
                          useSettings={useSettings}
                          mode="create"
                        />
                      }
                    ></Route>
                  </Route>
                </Routes>
              </main>
              <footer></footer>
            </ArticleProvider>
          </SettingsProvider>
        </FirebaseAuthProvider>
      </div>
    </Router>
  );
}
