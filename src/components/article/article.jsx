import { Link } from "react-router-dom";

export function Article({ article, isPreview = false, useFirebaseAuth }) {
  const { user } = useFirebaseAuth();

  return (
    <article>
      <h1>
        {article.title}
        {user.isAuthor && <Link to={`/articles/${article.uid}`}>Edit</Link>}
      </h1>
      <small>
        {article.authorName} - {article.date}
      </small>
      <p>{isPreview ? article.contentPreview : article.content}</p>
    </article>
  );
}
