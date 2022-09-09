import { serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaSave, FaPaperPlane } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { formatDateRelative } from "../../utils/date";
import { ArticleEditor } from "../article-editor";
import css from "./article-form.module.scss";
import "./react-datepicker.scss";

export function ArticleForm({
  theme,
  useFirebaseAuth,
  useArticles,
  isPreview = false,
  useSettings,
  ...props
}) {
  const { user, isLoading: isLoadingUser } = useFirebaseAuth();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const navigate = useNavigate();
  const { socialLinks } = useSettings();
  const { save, isLoading, get, draft, saveDraft } = useArticles();
  const contentPreviewLimit = 256;

  const [article, setArticle] = useState(
    props.article ||
      (mode === "create" && draft
        ? draft
        : {
            authorName: user && user.displayName,
            content: "<p><span></span></p>",
            contentPreview: "<p><span></span></p>",
          })
  );

  useEffect(() => {
    if (mode === "create") {
      saveDraft(article);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, mode]);

  const HeaderTag = useMemo(
    () =>
      ({ children, ...props }) =>
        isPreview ? (
          <h2 {...props}>{children}</h2>
        ) : (
          <h1 {...props}>{children}</h1>
        ),
    [isPreview]
  );

  return useMemo(
    () =>
      !(mode !== "read" && !user) && (
        <form
          className={theme.article + " " + css.articleForm}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isLoading) return;
            if (mode === "create" || mode === "edit") {
              const newArticle = await save({
                ...article,
                date: article.date || serverTimestamp(),
              });
              if (newArticle) {
                setMode("read");
                if (mode === "create") {
                  saveDraft(null);
                  navigate(`/article/${newArticle.id}`);
                }
              }
            }
          }}
        >
          <fieldset disabled={mode === "read" || isLoading}>
            <header>
              <HeaderTag>
                <TextareaAutosize
                  type="text"
                  name="title"
                  value={article?.title}
                  placeholder="New Article..."
                  onChange={(e) => {
                    setArticle((old) => {
                      return {
                        ...old,
                        [e.target.name]: e.target.value,
                      };
                    });
                  }}
                />

                <small>
                  {"By " + article?.authorName + " "}
                  {mode === "read" ? (
                    formatDateRelative(article?.date)
                  ) : (
                    <DatePicker
                      name="date"
                      selected={article?.date}
                      value={!article?.date ? "[AUTOMATIC DATE]" : null}
                      onChange={(date, e) => {
                        setArticle((old) => ({
                          ...old,
                          date,
                        }));
                      }}
                      showTimeSelect
                      timeIntervals={5}
                      dateFormat={"LLL d, yyyy h:mma"}
                    />
                  )}
                </small>
              </HeaderTag>
            </header>
            <main>
              <article>
                {(mode === "create" || mode === "edit" || !isPreview) && (
                  <ArticleEditor
                    theme={theme}
                    className={css.articleEditor}
                    name="content"
                    placeholder="Article content..."
                    value={article?.content}
                    autoFocus={mode !== "read"}
                    renderToolbar={mode !== "read"}
                    disabled={mode === "read"}
                    onChange={(value) => {
                      setArticle((old) => {
                        return {
                          ...old,
                          content: value,
                        };
                      });
                    }}
                  />
                )}

                {(mode === "create" || mode === "edit") && (
                  <h4>Article Preview</h4>
                )}

                {(mode === "create" || mode === "edit" || isPreview) && (
                  <ArticleEditor
                    theme={theme}
                    className={css.articleEditor}
                    name="contentPreview"
                    placeholder="Content preview..."
                    value={article?.contentPreview}
                    // hideToolbar={mode === "read"}
                    renderToolbar={mode !== "read"}
                    disabled={mode === "read"}
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
              {!isPreview && (
                <aside>
                  <div>
                    {user && user.isAuthor && mode === "create" && (
                      <button className={theme.buttonAlt} disabled={isLoading}>
                        <FaPaperPlane />
                      </button>
                    )}
                    {user &&
                      user.isAuthor &&
                      (mode === "read" ? (
                        <button
                          className={theme.buttonAlt}
                          onClick={(e) => {
                            e.preventDefault();
                            setMode("edit");
                          }}
                          disabled={isLoading}
                        >
                          <FaEdit />
                        </button>
                      ) : mode === "edit" ? (
                        <button
                          className={theme.buttonAlt}
                          disabled={isLoading}
                        >
                          <FaSave />
                        </button>
                      ) : (
                        false
                      ))}

                    {!isPreview &&
                      mode === "read" &&
                      socialLinks.map((link) => (
                        <a
                          key={link.uid}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={link.iconUrl} alt="social icon" />
                        </a>
                      ))}
                  </div>
                </aside>
              )}
            </main>
          </fieldset>
        </form>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [article, mode, isLoadingUser, isPreview, isLoading, socialLinks, user]
  );
}
