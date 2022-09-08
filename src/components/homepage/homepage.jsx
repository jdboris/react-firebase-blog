import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleForm } from "../article-form";
import { CommentList } from "../comment-list";
import css from "./homepage.module.scss";

export function Homepage({
  theme,
  useFirebaseAuth,
  useArticles,
  useComments,
  useSettings,
}) {
  // const { user } = useFirebaseAuth();
  const { getMostRecent } = useArticles();
  const [mostRecent, setMostRecent] = useState([]);

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={css.homepage}>
      {mostRecent.length > 0 && (
        <>
          <ArticleForm
            key={mostRecent[0].id}
            theme={theme}
            article={mostRecent[0]}
            mode="read"
            useFirebaseAuth={useFirebaseAuth}
            useArticles={useArticles}
            useSettings={useSettings}
          />
          <section>
            <h2>Comments</h2>
            <CommentList
              theme={theme}
              threadId={mostRecent[0].commentThreadId}
              useFirebaseAuth={useFirebaseAuth}
              useComments={useComments}
            />
          </section>
        </>
      )}

      <section className={css.newsSection}>
        <h2>Latest News</h2>
        <ul>
          {mostRecent.length > 1 &&
            mostRecent.slice(1).map((article) => (
              <li key={"news-" + article.id}>
                <Link to={`/article/${article.id}`} key={article.id}>
                  <ArticleForm
                    key={"article-link-" + article.id}
                    theme={theme}
                    article={article}
                    mode="read"
                    isPreview={true}
                    useFirebaseAuth={useFirebaseAuth}
                    useArticles={useArticles}
                    useSettings={useSettings}
                  />
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
