import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ArticleProvider, useArticles } from "../../contexts/articles";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { SettingsProvider, useSettings } from "../../contexts/settings";
import "../../firebase";
import { ArticleForm } from "../article-form";
import { Header } from "../header";
import { Homepage } from "../homepage";
import { SettingsForm } from "../settings-form";

export function App({ theme }) {
  return (
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
  );
}
