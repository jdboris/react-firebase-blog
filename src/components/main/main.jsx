import { Route, Routes } from "react-router-dom";
import "../../firebase";
import { ArticleForm } from "../article-form";
import { Homepage } from "../homepage";
import { SettingsForm } from "../settings-form";

export function Main({ theme, useFirebaseAuth, useArticles, useSettings }) {
  const { user } = useFirebaseAuth();

  return (
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
              user && (
                <ArticleForm
                  key="new"
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useArticles={useArticles}
                  useSettings={useSettings}
                  mode="create"
                />
              )
            }
          ></Route>
        </Route>
      </Routes>
    </main>
  );
}
