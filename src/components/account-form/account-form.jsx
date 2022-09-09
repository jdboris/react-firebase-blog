import { useEffect } from "react";
import { useState } from "react";
import { FaPencilAlt, FaRegSave, FaPaperPlane } from "react-icons/fa";
import { uploadFile } from "../../utils/files";
import FileInput from "../file-input/file-input";
import css from "./account-form.module.scss";

export function AccountForm({ theme, useFirebaseAuth, ...props }) {
  const { user, saveUser } = useFirebaseAuth();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [userData, setUserData] = useState(user);

  useEffect(() => setUserData(user), [user]);

  return (
    user && (
      <form className={css.accountForm} onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <div className={css.imageWrapper}>
            <FileInput
              buttonMode={true}
              className={theme.buttonAlt}
              onChange={async (files) => {
                saveUser({
                  uid: user.uid,
                  photoUrl: await uploadFile(files[0]),
                });
              }}
            >
              <img className={theme.profileImage} src={user.photoUrl} />
              <FaPencilAlt />
            </FileInput>
          </div>

          <label className={css.username}>{user.displayName}</label>
        </fieldset>
      </form>
    )
  );
}
