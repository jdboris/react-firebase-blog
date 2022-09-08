import { Route, Routes } from "react-router-dom";
import "../../firebase";
import { CommentList } from "../comment-list";
import { ArticleForm } from "../article-form";
import { Homepage } from "../homepage";
import { SettingsForm } from "../settings-form";
import { useParams } from "react-router-dom";
import { ArticlePage } from "../article-page/article-page";
import ScrollToTop from "../../utils/scroll-to-top";

export function Main({
  theme,
  useFirebaseAuth,
  useArticles,
  useSettings,
  useComments,
}) {
  const { user } = useFirebaseAuth();

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

        <Route path="article">
          <Route
            path=":uid"
            element={
              <ArticlePage
                key="uid"
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
              user && (
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
