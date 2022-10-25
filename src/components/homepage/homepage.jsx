import { useMemo } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleForm } from "../article-form";
import { LandingPage } from "../landing-page/landing-page";
import css from "./homepage.module.scss";

export function Homepage({ theme, useFirebaseAuth, useArticles, useSettings }) {
  // const { currentUser } = useFirebaseAuth();
  const { getMostRecent } = useArticles();
  const [mostRecent, setMostRecent] = useState([]);

  const articlesByTag = useMemo(() => {
    const limit = 8;
    const articlesByTag = {
      featured: [],
      news: [],
      blog: [],
    };

    // For each article...
    for (const article of mostRecent) {
      // ...for each tag...
      for (const tag in articlesByTag) {
        const lowercaseTag = tag.toLocaleLowerCase();
        // ...if the article has the tag...
        if (
          article.tags.includes(lowercaseTag) &&
          articlesByTag[lowercaseTag].length < limit
        ) {
          // ...add it to the corresponding array, and BREAK.
          articlesByTag[lowercaseTag].push(article);
          break;
        }
      }
    }

    return articlesByTag;
  }, [mostRecent]);

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    articlesByTag && (
      <>
        <LandingPage theme={theme} useSettings={useSettings} />
        <div>
          {(articlesByTag.featured.length > 0 ||
            articlesByTag.news.length > 0 ||
            articlesByTag.blog.length > 0) && (
            <>
              <header className={theme.pageHeader}>
                <h1>BLOG</h1>
              </header>
              <div className={css.homePage + " " + theme.container}>
                {articlesByTag.featured.length > 0 && (
                  <section className={css.featuredSection}>
                    <Link
                      to={`/article/${articlesByTag.featured[0].id}`}
                      key={articlesByTag.featured[0].id}
                    >
                      <ArticleForm
                        key={articlesByTag.featured[0].id}
                        isPreview={true}
                        overlayMode={true}
                        theme={theme}
                        article={articlesByTag.featured[0]}
                        mode="read"
                        useFirebaseAuth={useFirebaseAuth}
                        useArticles={useArticles}
                        useSettings={useSettings}
                      />
                    </Link>

                    {articlesByTag.featured.length > 1 && (
                      <aside>
                        <h1>Featured</h1>
                        <ul>
                          {articlesByTag.featured.slice(1).map((article) => (
                            <li key={"news-" + article.id}>
                              <Link
                                to={`/article/${article.id}`}
                                key={article.id}
                              >
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

                          {/* NOTE: Effectively limits the width of the remainders */}
                          <li></li>
                        </ul>
                      </aside>
                    )}
                  </section>
                )}

                {articlesByTag.news.length > 0 && (
                  <section>
                    <h1>News</h1>
                    <ul>
                      {articlesByTag.news.map((article) => (
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

                      {/* NOTE: Effectively limits the width of the remainders */}
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </section>
                )}

                {articlesByTag.blog.length > 0 && (
                  <section className={css.blogSection}>
                    <h1>Blog</h1>
                    <ul>
                      {articlesByTag.blog.map((article) => (
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

                      {/* NOTE: Effectively limits the width of the remainders */}
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </>
    )
  );
}
