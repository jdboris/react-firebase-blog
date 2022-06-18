import { useState } from "react";
import { SocialLinkForm } from "../social-link-form/social-link-form";
import css from "./settings-form.module.scss";

export function SettingsForm({
  theme,
  useFirebaseAuth,
  useSettings,
  ...props
}) {
  const { user } = useFirebaseAuth();
  const { socialLinks, isLoading } = useSettings();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [newLink, setNewLink] = useState(null);

  return (
    user &&
    user.isAdmin && (
      <div
      // className={theme.article + " " + css.articleForm}
      // onSubmit={async (e) => {
      //   e.preventDefault();
      //   if (isLoading) return;
      //   if (mode == "create" || mode == "edit") {
      //     const newArticle = await save(article);
      //     if (newArticle) {
      //       setArticle(newArticle);
      //       setMode("read");
      //       if (mode == "create") {
      //         saveDraft(null);
      //       }
      //     }
      //   }
      // }}
      >
        <header>
          <h3>Social Media Links</h3>
        </header>
        <main>
          {socialLinks.map((link) => (
            <SocialLinkForm
              theme={theme}
              key={link.uid}
              link={link}
              useFirebaseAuth={useFirebaseAuth}
              useSettings={useSettings}
            />
          ))}

          {newLink ? (
            <SocialLinkForm
              link={newLink}
              mode={"create"}
              useFirebaseAuth={useFirebaseAuth}
              useSettings={useSettings}
              onSuccess={() => {
                setNewLink(null);
              }}
            />
          ) : (
            <button
              onClick={() => {
                setNewLink({ url: "", iconUrl: "" });
              }}
            >
              Add
            </button>
          )}
        </main>
      </div>
    )
  );
}