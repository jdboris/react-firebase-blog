import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaSave, FaPaperPlane } from "react-icons/fa";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { ArticleEditor } from "../article-editor";
import css from "./article-form.module.scss";
import "./react-datepicker.scss";

function formatDateRelative(date) {
  if (!date) return null;
  const now = new Date();
  const minuteDifference = (now - date) / 1000 / 60;

  if (minuteDifference < 60) {
    const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });
    return formatter.format(-Math.ceil(minuteDifference), "minute");
  }

  if (minuteDifference < 24 * 60) {
    const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });
    return formatter.format(-Math.floor(minuteDifference / 60), "hour");
  }

  if (minuteDifference < 24 * 60 * 2) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    });
    return "Yesterday at " + formatter.format(date);
  }

  if (minuteDifference < 24 * 60 * 4) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    });
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return weekdays[date.getDay()] + " at " + formatter.format(date);
  }

  const formatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
    dateStyle: "long",
  });
  return formatter.format(date);
}

export function ArticleForm({
  theme,
  useFirebaseAuth,
  useArticles,
  isPreview = false,
  useSettings,
  ...props
}) {
  const { uid } = useParams();
  const { user } = useFirebaseAuth();
  const { socialLinks } = useSettings();
  const { save, isLoading, get, draft, saveDraft } = useArticles();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const contentPreviewLimit = 256;
  const [article, setArticle] = useState(
    props.article ||
      (uid
        ? null
        : mode == "create" && draft
        ? draft
        : {
            authorName: user.displayName,
            // NOTE: Defaults required to start in sync
            content: "<p><span></span></p>",
            contentPreview: "<p><span></span></p>",
          })
  );

  useEffect(() => {
    (async () => {
      if (uid) {
        setArticle(await get(uid));
      }
    })();
  }, [uid]);

  useEffect(() => {
    if (mode == "create") {
      saveDraft(article);
    }
  }, [article]);

  const HeaderTag = useMemo(
    () => (props) => isPreview ? <h2 {...props}></h2> : <h1 {...props}></h1>,
    []
  );

  return useMemo(
    () =>
      ((!uid && article) || (uid && article)) && (
        <form
          className={theme.article + " " + css.articleForm}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isLoading) return;
            if (mode == "create" || mode == "edit") {
              if (!article.date) article.date = new Date();
              const newArticle = await save(article);
              if (newArticle) {
                setArticle(newArticle);
                setMode("read");
                if (mode == "create") {
                  saveDraft(null);
                }
              }
            }
          }}
        >
          <fieldset disabled={mode == "read" || isLoading}>
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
                  {article?.authorName}:{" "}
                  {mode == "read" ? (
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
                {(mode == "create" || mode == "edit" || !isPreview) && (
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

                {(mode == "create" || mode == "edit") && <h4>Preview View</h4>}

                {(mode == "create" || mode == "edit" || isPreview) && (
                  <ArticleEditor
                    theme={theme}
                    name="contentPreview"
                    placeholder="Content preview..."
                    value={article?.contentPreview}
                    hideToolbar={mode == "read"}
                    renderToolbar={mode != "read"}
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
              {!isPreview && (
                <aside>
                  <div>
                    {user && user.isAuthor && mode == "create" && (
                      <button className={theme.buttonAlt} disabled={isLoading}>
                        <FaPaperPlane />
                      </button>
                    )}
                    {user &&
                      user.isAuthor &&
                      (mode == "read" ? (
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
                      ) : mode == "edit" ? (
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
                      mode == "read" &&
                      socialLinks.map((link) => (
                        <a href={link.url} target="_blank">
                          <img src={link.iconUrl} />
                        </a>
                      ))}
                  </div>
                </aside>
              )}
            </main>
          </fieldset>
        </form>
      ),
    [uid, article, mode]
  );
}
