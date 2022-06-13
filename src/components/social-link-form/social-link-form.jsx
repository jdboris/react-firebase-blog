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
  const { saveSocialLink, isLoading } = useSettings();
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
          if (mode == "create" || mode == "update") {
            const newLink = await saveSocialLink(link);
            if (newLink) {
              setMode("read");
              onSuccess();
            }
          }
        }}
      >
        <fieldset disabled={mode == "read" || isLoading}>
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

          {(mode == "create" || mode == "update") && <button>Save</button>}
        </fieldset>
      </form>
    )
  );
}
