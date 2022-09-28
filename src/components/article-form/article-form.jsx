import { serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPencilAlt, FaRegSave, FaPaperPlane } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { formatDateRelative } from "../../utils/date";
import { ArticleEditor } from "../article-editor";
import css from "./article-form.module.scss";
import AutosizeInput from "react-input-autosize";
import "./react-datepicker.scss";

export function ArticleForm({
  theme,
  useFirebaseAuth,
  useArticles,
  isBigPreview = false,
  useSettings,
  ...props
}) {
  const isPreview = props.isPreview || isBigPreview;
  const { currentUser, isLoading: isLoadingUser } = useFirebaseAuth();
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
            author: currentUser && {
              id: currentUser.id,
              displayName: currentUser.displayName,
            },
            tags: [],
            lowercaseTags: [],
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

  return useMemo(
    () =>
      !(mode !== "read" && !currentUser) && (
        <form
          className={
            theme.article +
            " " +
            css.articleForm +
            " " +
            (isBigPreview ? css.bigPreview : "")
          }
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
              {!isPreview && (
                <>
                  <h1>
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
                      <span>
                        {" "}
                        {"By "}
                        {article?.author.displayName}{" "}
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
                      </span>
                    </small>
                  </h1>
                </>
              )}
            </header>
            <main>
              <article>
                <div className={css.tagSection}>
                  {!isPreview &&
                    (article?.tags
                      ? mode === "create" || mode === "edit"
                        ? [...article?.tags, ""]
                        : article?.tags
                      : [""]
                    )?.map((tag, i) => (
                      <label key={`tag-${i}`}>
                        {/* NOTE: Must include a " " */} #
                        <AutosizeInput
                          placeholder="tag..."
                          name={`tag-${i}`}
                          value={tag}
                          onChange={(e) => {
                            setArticle((old) => {
                              const tags = [
                                ...old.tags.slice(0, i),
                                e.target.value,
                                ...old.tags.slice(i + 1),
                              ]
                                .map((tag) => tag.trim().replace(/\W_/g, ""))
                                .filter((tag) => tag);

                              // // If this is the last tag AND the value ends with a whitespace
                              // if (
                              //   (mode === "create" || mode === "edit") &&
                              //   i === old.tags.length - 1 &&
                              //   (/\s$/.test(e.target.value) ||
                              //     e.target.value.trim() === "")
                              // ) {
                              //   tags.push("");
                              // }

                              return {
                                ...old,
                                tags,
                                lowercaseTags: tags.map((tag) =>
                                  tag.toLowerCase()
                                ),
                              };
                            });
                          }}
                          onBlur={(e) => {
                            // const tags = article.tags
                            //   .map((tag) =>
                            //     tag.trim().toLowerCase().replace(/\W/g, "")
                            //   )
                            //   .filter((tag) => tag);
                            // // if (mode === "create" || mode === "edit")
                            // //   tags.push("");
                            // setArticle((old) => {
                            //   return {
                            //     ...old,
                            //     tags,
                            //   };
                            // });
                          }}
                        />
                      </label>
                    ))}
                </div>

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
                    {currentUser && currentUser.isAuthor && mode === "create" && (
                      <button className={theme.buttonAlt} disabled={isLoading}>
                        <FaPaperPlane />
                      </button>
                    )}
                    {currentUser &&
                      currentUser.isAuthor &&
                      (mode === "read" ? (
                        <button
                          className={theme.buttonAlt}
                          onClick={(e) => {
                            e.preventDefault();
                            setMode("edit");
                          }}
                          disabled={isLoading}
                        >
                          <FaPencilAlt />
                        </button>
                      ) : mode === "edit" ? (
                        <button
                          className={theme.buttonAlt}
                          disabled={isLoading}
                        >
                          <FaRegSave />
                        </button>
                      ) : (
                        false
                      ))}

                    {mode === "read" &&
                      socialLinks.map((link) => (
                        <a
                          key={link.id}
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
            <footer>
              {isPreview && (
                <h2>
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
                    <span>
                      {" "}
                      {"By "}
                      {article?.author.displayName}{" "}
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
                    </span>
                  </small>
                </h2>
              )}
            </footer>
          </fieldset>
        </form>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      article,
      mode,
      isLoadingUser,
      isPreview,
      isLoading,
      socialLinks,
      currentUser,
    ]
  );
}
