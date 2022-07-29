import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { useState } from "react";
import css from "./social-link-form.module.scss";
import FileInput from "../file-input/file-input";
import { useEffect } from "react";

export function SocialLinkForm({
  theme,
  useFirebaseAuth,
  useSettings,
  onSuccess,
  ...props
}) {
  const { user } = useFirebaseAuth();
  const { uploadIcon, saveSocialLink, deleteSocialLink, isLoading } =
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
        className={css.socialLinkForm}
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
                <FaEdit />
              </button>
            )}

            {(mode === "create" || mode === "edit") && (
              <button className={theme.buttonAlt}>
                <FaSave />
              </button>
            )}

            {mode === "edit" && (
              <button
                className={css.buttonAlt + " " + css.red}
                onClick={(e) => {
                  e.preventDefault();
                  deleteSocialLink(link);
                }}
              >
                <RiCloseFill />
              </button>
            )}
          </aside>

          <label>
            Icon:
            {link.iconUrl && <img src={link.iconUrl} />}
          </label>

          <div>
            {(mode === "create" || mode === "edit") && (
              <>
                <div>
                  <FileInput
                    disabled={isIconLocked}
                    onChange={async (files) => {
                      const iconUrl = await uploadIcon(files[0]);
                      setLink((link) => ({
                        ...link,
                        iconUrl,
                      }));
                      setIsIconLocked(true);
                    }}
                  />
                </div>
                <label>
                  or...
                  <input
                    disabled={isIconLocked}
                    placeholder="Image URL..."
                    type="text"
                    value={link.iconUrl}
                    onChange={(e) => {
                      setLink((link) => ({
                        ...link,
                        iconUrl: e.target.value,
                      }));
                    }}
                  />
                </label>
              </>
            )}
          </div>

          {mode === "read" ? (
            <div>
              <label>Link URL:</label>
              <a href={link.url} target="_blank">
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
