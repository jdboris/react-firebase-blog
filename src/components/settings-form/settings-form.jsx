import { useState } from "react";
import { uploadFile } from "../../utils/files";
import { BusinessForm } from "../business-form/business-form";
import FileInput from "../file-input/file-input";
import { SocialLinkForm } from "../social-link-form/social-link-form";
import css from "./settings-form.module.scss";

export function SettingsForm({
  theme,
  useFirebaseAuth,
  useSettings,
  // ...props
}) {
  const { currentUser } = useFirebaseAuth();
  const { socialLinks, logo, saveLogo } = useSettings();
  // const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [newLink, setNewLink] = useState(null);

  return (
    currentUser &&
    currentUser.isAdmin && (
      <div className={css.settingsForm}>
        <section className={css.logoForm}>
          <header>
            <h3>Business</h3>
          </header>
          <main>
            <BusinessForm
              theme={theme}
              useFirebaseAuth={useFirebaseAuth}
              useSettings={useSettings}
              mode={"read"}
            />
          </main>
        </section>
        <section className={css.logoForm}>
          <header>
            <h3>Logo</h3>
          </header>
          <main>
            {logo && <img src={logo.url} />}
            <div>
              <FileInput
                onChange={async (files) => {
                  saveLogo({ url: await uploadFile(files[0]) });
                }}
              />
            </div>
          </main>
        </section>
        <section className={css.socialLinks}>
          <header>
            <h3>Social Media Links</h3>
          </header>
          <main>
            {socialLinks.map((link) => (
              <SocialLinkForm
                theme={theme}
                key={link.id}
                link={link}
                useFirebaseAuth={useFirebaseAuth}
                useSettings={useSettings}
              />
            ))}

            {newLink ? (
              <SocialLinkForm
                theme={theme}
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
        </section>
      </div>
    )
  );
}
