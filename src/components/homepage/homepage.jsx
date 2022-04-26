import { useEffect, useState } from "react";
import { Article } from "../article";

export function Homepage({ useFirebaseAuth, useArticles }) {
  const { user } = useFirebaseAuth();
  const { getMostRecent } = useArticles();
  const [mostRecent, setMostRecent] = useState([]);

  useEffect(() => {
    (async () => {
      setMostRecent(await getMostRecent());
    })();
  }, []);

  return (
    <section>
      {mostRecent.length && (
        <Article article={mostRecent[0]} useFirebaseAuth={useFirebaseAuth} />
      )}
    </section>
  );
}
