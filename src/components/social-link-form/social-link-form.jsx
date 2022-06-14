import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { useState } from "react";
import css from "./social-link-form.module.scss";

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

          {mode == "read" ? (
            <a href={link.url} target="_blank">
              <img src={link.iconUrl} />
            </a>
          ) : (
            <label>
              Icon URL:
              <input
                name="iconUrl"
                value={link.iconUrl}
                onChange={(e) => {
                  setLink((link) => ({ ...link, iconUrl: e.target.value }));
                }}
              />
            </label>
          )}
          {mode == "read" ? (
            <a href={link.url} target="_blank">
              {link.url}
            </a>
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

          {mode == "edit" && (
            <button
              className={theme.buttonAlt}
              onClick={(e) => {
                e.preventDefault();
                deleteSocialLink(link);
              }}
            >
              <FaTrash />
            </button>
          )}
        </fieldset>
      </form>
    )
  );
}
