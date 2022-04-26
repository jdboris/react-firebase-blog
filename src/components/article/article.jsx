import { Link } from "react-router-dom";

export function Article({ article, useFirebaseAuth }) {
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
      <p>{article.content}</p>
    </article>
  );
}
