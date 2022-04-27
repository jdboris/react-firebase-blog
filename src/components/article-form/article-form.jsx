import { useEffect, useMemo, useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ArticleEditor } from "../article-editor/article-editor";
import css from "./article-form.module.scss";
import { useParams } from "react-router-dom";

export function ArticleForm({ useFirebaseAuth, useArticles, ...props }) {
  const { uid } = useParams();
  const { user } = useFirebaseAuth();
  const { save, isLoading, get } = useArticles();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const contentPreviewLimit = 256;
  const [article, setArticle] = useState(props.article || null);

  useEffect(() => {
    (async () => {
      if (uid && !article) {
        setArticle(await get(uid));
      }
    })();
  }, [uid]);

  return (
    !(mode != "create" && !article) && (
      <form
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
              value={article?.title}
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
              value={article?.date}
              onChange={(e) => {
                setArticle((old) => ({
                  ...old,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </label>

          <label>Content</label>
          <ArticleEditor
            name="content"
            value={article?.content}
            onChange={(value) => {
              setArticle((old) => {
                const isPreviewInSync =
                  old.content &&
                  old.contentPreview ==
                    old.content.substring(0, contentPreviewLimit);

                return {
                  ...old,
                  contentPreview: isPreviewInSync
                    ? value.substring(0, contentPreviewLimit)
                    : old.contentPreview,
                  content: value,
                };
              });
            }}
          />

          <label>Preview</label>
          <ArticleEditor
            name="contentPreview"
            value={article?.contentPreview}
            onChange={(value) => {
              setArticle((old) => {
                return {
                  ...old,
                  contentPreview: value,
                };
              });
            }}
          />
        </fieldset>
        {user &&
          user.isAuthor &&
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
    )
  );
}
