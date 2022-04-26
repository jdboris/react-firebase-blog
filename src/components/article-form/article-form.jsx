import { useState } from "react";
import css from "./article-form.module.scss";

export function ArticleForm({
  useFirebaseAuth,
  useArticles: useArticles,
  ...props
}) {
  const { user } = useFirebaseAuth();
  const { save, isLoading } = useArticles();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const contentPreviewLimit = 256;
  const [article, setArticle] = useState(
    props.article
      ? props.article
      : { uid: "", title: "", date: "", content: "", contentPreview: "" }
  );

  return (
    <form
      className={css.ArticleForm}
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;
        if (mode == "create" || mode == "update") {
          const newArticle = await save(article);
          if (newArticle) {
            setArticle(newArticle);
            setMode("read");
          }
        }
      }}
    >
      <fieldset disabled={mode == "read" || isLoading}>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={(e) => {
              setArticle((old) => ({
                ...old,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </label>
        <label>
          Date
          <input
            type="datetime-local"
            name="date"
            value={article.date}
            onChange={(e) => {
              setArticle((old) => ({
                ...old,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </label>
        <label>
          Content
          <textarea
            name="content"
            value={article.content}
            onChange={(e) => {
              setArticle((old) => {
                return {
                  ...old,
                  contentPreview:
                    old.contentPreview !=
                    old.content.substring(0, contentPreviewLimit)
                      ? old.contentPreview
                      : e.target.value.substring(0, contentPreviewLimit),
                  [e.target.name]: e.target.value,
                };
              });
            }}
          ></textarea>
        </label>
        <label>
          Preview
          <textarea
            name="contentPreview"
            value={article.contentPreview}
            onChange={(e) => {
              setArticle((old) => {
                return {
                  ...old,
                  [e.target.name]: e.target.value,
                };
              });
            }}
          ></textarea>
        </label>
      </fieldset>
      {user.isAuthor &&
        (mode == "read" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setMode("update");
            }}
          >
            Edit
          </button>
        ) : mode == "create" ? (
          <button>Post</button>
        ) : mode == "update" ? (
          <button>Save</button>
        ) : (
          false
        ))}
    </form>
  );
}
