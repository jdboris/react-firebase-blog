import { useEffect, useState } from "react";
import { Article } from "../article";

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
        <Article
          theme={theme}
          article={mostRecent[0]}
          useFirebaseAuth={useFirebaseAuth}
        />
      )}
      {mostRecent.length > 1 &&
        mostRecent
          .slice(1)
          .map((article) => (
            <Article
              theme={theme}
              key={article.uid}
              article={article}
              isPreview={true}
              useFirebaseAuth={useFirebaseAuth}
            />
          ))}
    </>
  );
}
