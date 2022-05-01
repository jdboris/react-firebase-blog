import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ArticleEditor } from "../article-editor";
import TextareaAutosize from "react-textarea-autosize";
import css from "./article-form.module.scss";

export function ArticleForm({
  theme,
  useFirebaseAuth,
  useArticles,
  isPreview = false,
  ...props
}) {
  const { uid } = useParams();
  const { user } = useFirebaseAuth();
  const { save, isLoading, get } = useArticles();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const contentPreviewLimit = 256;
  const [article, setArticle] = useState(
    props.article || {
      authorName: user.displayName,
      date: new Date(),
      // NOTE: Defaults required to start in sync
      content: "<p><span></span></p>",
      contentPreview: "<p><span></span></p>",
    }
  );

  useEffect(() => {
    (async () => {
      if (!article) {
        if (uid) {
          setArticle(await get(uid));
        }
      }
    })();
  }, [uid]);

  return (
    !(mode != "create" && !article) && (
      <form
        className={theme.article + " " + css.articleForm}
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
          <header>
            <h1>
              <TextareaAutosize
                type="text"
                name="title"
                value={article?.title}
                placeholder="New Article..."
                onChange={(e) => {
                  setArticle((old) => ({
                    ...old,
                    [e.target.name]: e.target.value,
                  }));
                }}
              />
            </h1>

            <small>
              {article?.authorName} -
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
            </small>
          </header>
          <main>
            <article>
              {(mode == "create" || mode == "update" || !isPreview) && (
                <ArticleEditor
                  theme={theme}
                  name="content"
                  placeholder="Article content..."
                  value={article?.content}
                  autoFocus={mode != "read"}
                  hideToolbar={mode == "read"}
                  disabled={mode == "read"}
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
              )}

              {(mode == "create" || mode == "update") && <h4>Preview View</h4>}

              {(mode == "create" || mode == "update" || isPreview) && (
                <ArticleEditor
                  theme={theme}
                  name="contentPreview"
                  placeholder="Content preview..."
                  value={article?.contentPreview}
                  hideToolbar={mode == "read"}
                  disabled={mode == "read"}
                  onChange={(value) => {
                    setArticle((old) => {
                      return {
                        ...old,
                        contentPreview: value,
                      };
                    });
                  }}
                />
              )}
            </article>
            <aside>
              <div>
                {user && user.isAuthor && mode == "create" && (
                  <button disabled={isLoading}>Post</button>
                )}
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
                  ) : mode == "update" ? (
                    <button className={theme.buttonAlt} disabled={isLoading}>
                      <FaSave />
                    </button>
                  ) : (
                    false
                  ))}
              </div>
            </aside>
          </main>
        </fieldset>
      </form>
    )
  );
}
