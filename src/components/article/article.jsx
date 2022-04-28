import { Link } from "react-router-dom";

export function Article({
  theme,
  article,
  isPreview = false,
  useFirebaseAuth,
}) {
  const { user } = useFirebaseAuth();

  return (
    <div className={theme.article}>
      <header>
        <h1>{article.title}</h1>
        {user && user.isAuthor && (
          <Link to={`/articles/${article.uid}`} className={theme.button}>
            Edit
          </Link>
        )}
        <small>
          {article.authorName} {article.date}
        </small>
      </header>
      <article>
        <p
          dangerouslySetInnerHTML={{
            __html: isPreview ? article.contentPreview : article.content,
          }}
        ></p>
      </article>
    </div>
  );
}
