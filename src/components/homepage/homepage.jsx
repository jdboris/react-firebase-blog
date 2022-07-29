import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleForm } from "../article-form";
import css from "./homepage.module.scss";

export function Homepage({ theme, useFirebaseAuth, useArticles, useSettings }) {
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
        <ArticleForm
          theme={theme}
          article={mostRecent[0]}
          mode="read"
          useFirebaseAuth={useFirebaseAuth}
          useArticles={useArticles}
          useSettings={useSettings}
        />
      )}
      <section>
        {mostRecent.length > 1 &&
          mostRecent.slice(1).map((article) => (
            <Link to={`/article/${article.uid}`} key={article.uid}>
              <ArticleForm
                theme={theme}
                article={article}
                mode="read"
                isPreview={true}
                useFirebaseAuth={useFirebaseAuth}
                useArticles={useArticles}
                useSettings={useSettings}
              />
            </Link>
          ))}
      </section>
    </div>
  );
}
