import { useEffect, useState } from "react";
import { FaPencilAlt, FaRegSave, FaImage, FaTrashAlt } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import FileInput from "../file-input/file-input";
import css from "./social-link-form.module.scss";

export function SocialLinkForm({
  theme,
  useFirebaseAuth,
  useSettings,
  onSuccess,
  ...props
}) {
  const { user } = useFirebaseAuth();
  const { uploadFile, saveSocialLink, deleteSocialLink, isLoading } =
    useSettings();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [link, setLink] = useState(props.link || { url: "", iconUrl: "" });
  const [isIconLocked, setIsIconLocked] = useState(false);

  useEffect(() => {
    setIsIconLocked(false);
  }, [mode]);

  return (
    user &&
    user.isAdmin && (
      <form
        className={css.socialLinkForm + " " + css[mode]}
        onSubmit={async (e) => {
          e.preventDefault();
          if (isLoading) return;
          if (mode === "create" || mode === "edit") {
            const newLink = await saveSocialLink(link);
            if (newLink) {
              setMode("read");
              if (onSuccess) {
                onSuccess();
              }
            }
          }
        }}
      >
        <fieldset disabled={isLoading}>
          <aside>
            {mode === "read" && (
              <button
                className={theme.buttonAlt}
                onClick={() => {
                  setMode("edit");
                }}
              >
                <FaPencilAlt />
              </button>
            )}

            {(mode === "create" || mode === "edit") && (
              <button className={theme.buttonAlt}>
                <FaRegSave />
              </button>
            )}

            {mode === "edit" && (
              <button
                className={css.buttonAlt + " " + css.delete}
                onClick={(e) => {
                  e.preventDefault();
                  deleteSocialLink(link);
                }}
              >
                <FaTrashAlt />
              </button>
            )}
          </aside>

          <div>
            {(mode === "create" || mode === "edit") && "Icon:"}
            <div className={css.row}>
              {link.iconUrl ? (
                <img
                  className={css.socialLink}
                  src={link.iconUrl}
                  alt="social icon"
                />
              ) : (
                <FaImage className={css.socialLink} />
              )}
              {(mode === "create" || mode === "edit") && (
                <FileInput
                  onChange={async (files) => {
                    const iconUrl = await uploadFile(files[0]);
                    setLink((link) => ({
                      ...link,
                      iconUrl,
                    }));
                    setIsIconLocked(true);
                  }}
                />
              )}
            </div>
          </div>

          {mode === "read" ? (
            <div>
              {(mode === "create" || mode === "edit") && (
                <label>Link URL:</label>
              )}
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.url}
              </a>
            </div>
          ) : (
            <label>
              Link URL:
              <input
                name="url"
                value={link.url}
                onChange={(e) => {
                  setLink((link) => ({ ...link, url: e.target.value }));
                }}
              />
            </label>
          )}
        </fieldset>
      </form>
    )
  );
}
