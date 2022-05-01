import { useEffect, useState } from "react";
import { Article } from "../article";
import { ArticleForm } from "../article-form";

export function Homepage({ theme, useFirebaseAuth, useArticles }) {
  const { user } = useFirebaseAuth();
  const { getMostRecent } = useArticles();
  const [mostRecent, setMostRecent] = useState([]);

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();
  }, []);

  return (
    <>
      {mostRecent.length > 0 && (
        <ArticleForm
          theme={theme}
          article={mostRecent[0]}
          mode="read"
          useFirebaseAuth={useFirebaseAuth}
          useArticles={useArticles}
        />
      )}
      {mostRecent.length > 1 &&
        mostRecent
          .slice(1)
          .map((article) => (
            <ArticleForm
              theme={theme}
              key={article.uid}
              article={article}
              mode="read"
              isPreview={true}
              useFirebaseAuth={useFirebaseAuth}
              useArticles={useArticles}
            />
          ))}
    </>
  );
}
