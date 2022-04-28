import { toHaveErrorMessage } from "@testing-library/jest-dom/dist/matchers";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ArticleEditor } from "../article-editor";

export function ArticleForm({ theme, useFirebaseAuth, useArticles, ...props }) {
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
              value={
                article?.date
                  ? new Date(
                      article.date.getTime() -
                        article.date.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, -1)
                  : ""
              }
              onChange={(e) => {
                setArticle((old) => ({
                  ...old,
                  [e.target.name]: new Date(e.target.value),
                }));
              }}
            />
          </label>

          <label>Content</label>
          <ArticleEditor
            theme={theme}
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
            theme={theme}
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
              className={theme.buttonAlt}
              onClick={(e) => {
                e.preventDefault();
                setMode("update");
              }}
              disabled={isLoading}
            >
              <FaEdit />
            </button>
          ) : mode == "create" ? (
            <button disabled={isLoading}>Post</button>
          ) : mode == "update" ? (
            <button className={theme.buttonAlt} disabled={isLoading}>
              <FaSave />
            </button>
          ) : (
            false
          ))}
      </form>
    )
  );
}
