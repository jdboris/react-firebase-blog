import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { useState } from "react";
import css from "./social-link-form.module.scss";
import { FileInput } from "../file-input/file-input";

export function SocialLinkForm({
  theme,
  useFirebaseAuth,
  useSettings,
  onSuccess,
  ...props
}) {
  const { user } = useFirebaseAuth();
  const { saveSocialLink, deleteSocialLink, isLoading } = useSettings();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [link, setLink] = useState(props.link || {});

  return (
    user &&
    user.isAdmin && (
      <form
        className={css.socialLinkForm}
        onSubmit={async (e) => {
          e.preventDefault();
          if (isLoading) return;
          if (mode == "create" || mode == "edit") {
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
        <fieldset>
          <aside>
            {mode == "read" && (
              <button
                className={theme.buttonAlt}
                onClick={() => {
                  setMode("edit");
                }}
              >
                <FaEdit />
              </button>
            )}

            {(mode == "create" || mode == "edit") && (
              <button className={theme.buttonAlt}>
                <FaSave />
              </button>
            )}

            {mode == "edit" && (
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
            {(mode == "create" || mode == "edit") && (
              <>
                <div>
                  <FileInput />
                </div>
                <label>
                  or...
                  <input placeholder="Image URL..." type="text" />
                </label>
              </>
            )}
          </label>
          {mode == "read" && (
            <a href={link.url} target="_blank">
              <img src={link.iconUrl} />
            </a>
          )}

          {mode == "read" ? (
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
