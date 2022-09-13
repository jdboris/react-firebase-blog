import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArticleForm } from "../article-form";
import { CommentList } from "../comment-list";
import css from "./article-page.module.scss";

export function ArticlePage({
  theme,
  useFirebaseAuth,
  useArticles,
  useComments,
  useSettings,
}) {
  const { id } = useParams();
  const { get, getMostRecent } = useArticles();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    (async () => {
      if (id) {
        setArticle(await get(id));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [mostRecent, setMostRecent] = useState([]);

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={css.articlePage}>
      {article && (
        <>
          <ArticleForm
            key={article.id}
            theme={theme}
            article={article}
            mode="read"
            useFirebaseAuth={useFirebaseAuth}
            useArticles={useArticles}
            useSettings={useSettings}
          />

          <section>
            <h2>Comments</h2>
            <CommentList
              theme={theme}
              threadId={article.commentThreadId}
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
            mostRecent
              .filter((article) => article.id != id)
              .map((article) => (
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
