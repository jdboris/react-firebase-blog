import { Navigate, Route, Routes } from "react-router-dom";
import "../../firebase";
import ScrollToTop from "../../utils/scroll-to-top";
import { ArticleForm } from "../article-form";
import { ArticlePage } from "../article-page/article-page";
import { Homepage } from "../homepage";
import { SettingsForm } from "../settings-form";
import { UserPage } from "../user-page/user-page";

export function Main({
  theme,
  useFirebaseAuth,
  useArticles,
  useUsers,
  useSettings,
  useComments,
}) {
  const { currentUser, isLoading } = useFirebaseAuth();

  return (
    <main>
      <ScrollToTop />

      {(currentUser || !isLoading) && (
        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                theme={theme}
                useFirebaseAuth={useFirebaseAuth}
                useArticles={useArticles}
                useSettings={useSettings}
                useComments={useComments}
              />
            }
          ></Route>
          <Route
            path="settings"
            element={
              currentUser ? (
                <SettingsForm
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useSettings={useSettings}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          ></Route>

          <Route path="user">
            <Route
              path=":id"
              element={
                <UserPage
                  theme={theme}
                  useUsers={useUsers}
                  useFirebaseAuth={useFirebaseAuth}
                />
              }
            />
          </Route>

          <Route path="article">
            <Route
              path=":id"
              element={
                <ArticlePage
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useArticles={useArticles}
                  useComments={useComments}
                  useSettings={useSettings}
                  mode="read"
                />
              }
            ></Route>
            <Route
              path="new"
              element={
                currentUser ? (
                  <div className={theme.container}>
                    <ArticleForm
                      key="new-article"
                      theme={theme}
                      useFirebaseAuth={useFirebaseAuth}
                      useArticles={useArticles}
                      useComments={useComments}
                      useSettings={useSettings}
                      mode="create"
                    />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            ></Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </main>
  );
}
