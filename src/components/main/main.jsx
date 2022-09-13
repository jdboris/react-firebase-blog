import { Route, Routes } from "react-router-dom";
import "../../firebase";
import { CommentList } from "../comment-list";
import { ArticleForm } from "../article-form";
import { Homepage } from "../homepage";
import { SettingsForm } from "../settings-form";
import { useParams } from "react-router-dom";
import { ArticlePage } from "../article-page/article-page";
import ScrollToTop from "../../utils/scroll-to-top";
import { UserForm } from "../user-form";
import { UserPage } from "../user-page/user-page";

export function Main({
  theme,
  useFirebaseAuth,
  useArticles,
  useUsers,
  useSettings,
  useComments,
}) {
  const { currentUser } = useFirebaseAuth();

  return (
    <main>
      <ScrollToTop />
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
            <SettingsForm
              theme={theme}
              useFirebaseAuth={useFirebaseAuth}
              useSettings={useSettings}
            />
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
              currentUser && (
                <ArticleForm
                  key="new-article"
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useArticles={useArticles}
                  useComments={useComments}
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
