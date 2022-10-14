import { useState } from "react";
import css from "./business-form.module.scss";

export function BusinessForm({
  theme,
  useFirebaseAuth,
  useSettings,
  ...props
}) {
  const { currentUser } = useFirebaseAuth();
  const { saveBusiness, isLoading, ...settings } = useSettings();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [business, setBusiness] = useState(settings.business || { name: "" });

  return (
    currentUser &&
    currentUser.isAdmin && (
      <form
        className={css.businessForm}
        onSubmit={async (e) => {
          e.preventDefault();
          if (isLoading) return;
          if (mode === "edit") {
            if (await saveBusiness(business)) {
              setMode("read");
            }
          }
        }}
      >
        <fieldset disabled={isLoading}>
          <label>
            Name{" "}
            <input
              name="name"
              value={business.name}
              onChange={(e) =>
                setBusiness((old) => ({ ...old, name: e.target.value }))
              }
              disabled={mode == "read"}
            />
          </label>

          <label>
            Slogan{" "}
            <input
              name="slogan"
              value={business.slogan}
              onChange={(e) =>
                setBusiness((old) => ({ ...old, slogan: e.target.value }))
              }
              disabled={mode == "read"}
            />
          </label>
          {mode != "edit" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setMode("edit");
              }}
            >
              Edit
            </button>
          )}

          {mode == "edit" && <button>Save</button>}
        </fieldset>
      </form>
    )
  );
}
