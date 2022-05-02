import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

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
          <Link to={`/article/${article.uid}`}>
            <FaEdit />
          </Link>
        )}
        <small>
          {article.authorName} |{" "}
          {new Intl.DateTimeFormat(undefined, {
            timeStyle: "short",
            dateStyle: "medium",
          }).format(article.date)}
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
