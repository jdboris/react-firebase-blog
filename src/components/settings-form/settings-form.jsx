import { useState } from "react";
import { uploadFile } from "../../utils/files";
import { BusinessForm } from "../business-form/business-form";
import FileInput from "../file-input/file-input";
import { SocialLinkForm } from "../social-link-form/social-link-form";
import css from "./settings-form.module.scss";
import { FaInfoCircle } from "react-icons/fa";
import JSZip from "jszip";

export function SettingsForm({
  theme,
  useFirebaseAuth,
  useSettings,
  // ...props
}) {
  const { currentUser } = useFirebaseAuth();
  const { socialLinks, logo, saveLogo, favicon, saveFavicon } = useSettings();
  // const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [newLink, setNewLink] = useState(null);

  return (
    currentUser &&
    currentUser.isAdmin && (
      <div className={css.settingsForm + " " + theme.container}>
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
          <div>
            <header>
              <h3>Logo</h3>
            </header>
            <main>
              {logo && <img src={logo.url} />}
              <div>
                <FileInput
                  accept="image/*"
                  onChange={async (files) => {
                    saveLogo({ url: await uploadFile(files[0]) });
                  }}
                />
              </div>
            </main>
          </div>
          <div>
            <header>
              <h3>
                Favicon Package (.zip){" "}
                <a href="https://realfavicongenerator.net/" target="_blank">
                  <FaInfoCircle />
                </a>
              </h3>
            </header>
            <main>
              {favicon && <img src={favicon.url} />}
              <div>
                <FileInput
                  accept="application/zip"
                  onChange={async (files) => {
                    // NOTE: Assumes files are named following the conventions of realfavicongenerator.net
                    if (files[0].type === "application/zip") {
                      const zip = await JSZip.loadAsync(files[0]);

                      zip.forEach(async (relativePath, zipEntry) => {
                        await uploadFile(
                          new File(
                            [await zipEntry.async("blob")],
                            zipEntry.name
                          ),
                          true
                        );
                      });
                    }
                  }}
                />
              </div>
            </main>
          </div>
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
