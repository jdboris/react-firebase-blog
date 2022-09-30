import { useMemo } from "react";
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
  // const { currentUser } = useFirebaseAuth();
  const { getMostRecent } = useArticles();
  const [mostRecent, setMostRecent] = useState([]);

  const featured = useMemo(
    () =>
      mostRecent.filter((article) =>
        article.lowercaseTags.includes("featured")
      ),
    [mostRecent]
  );
  const news = useMemo(
    () =>
      mostRecent.filter(
        (article) =>
          !article.lowercaseTags.includes("featured") &&
          article.lowercaseTags.includes("news")
      ),
    [mostRecent]
  );
  const blogPosts = useMemo(
    () =>
      mostRecent.filter(
        (article) =>
          !article.lowercaseTags.includes("featured") &&
          !article.lowercaseTags.includes("news") &&
          article.lowercaseTags.includes("blog")
      ),
    [mostRecent]
  );

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={css.homepage}>
      <section className={css.featuredSection}>
        {featured.length > 0 && (
          <Link to={`/article/${featured[0].id}`} key={featured[0].id}>
            <ArticleForm
              key={featured[0].id}
              isPreview={true}
              overlayMode={true}
              theme={theme}
              article={featured[0]}
              mode="read"
              useFirebaseAuth={useFirebaseAuth}
              useArticles={useArticles}
              useSettings={useSettings}
            />
          </Link>
        )}

        <aside>
          <h1>Featured</h1>
          <ul>
            {featured.length > 1 &&
              featured.slice(1).map((article) => (
                <li key={"news-" + article.id}>
                  <Link to={`/article/${article.id}`} key={article.id}>
                    <ArticleForm
                      key={"article-link-" + article.id}
                      theme={theme}
                      article={article}
                      mode="read"
                      isPreview={true}
                      overlayMode={true}
                      useFirebaseAuth={useFirebaseAuth}
                      useArticles={useArticles}
                      useSettings={useSettings}
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </aside>
      </section>

      <section className={css.newsSection}>
        <h1>News</h1>
        <ul>
          {news.map((article) => (
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

      <section className={css.blogSection}>
        <h1>Blog</h1>
        <ul>
          {blogPosts.map((article) => (
            <li key={"blogPosts-" + article.id}>
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
