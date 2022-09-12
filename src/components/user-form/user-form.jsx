// import { useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { uploadFile } from "../../utils/files";
import FileInput from "../file-input/file-input";
import css from "./user-form.module.scss";

export function UserForm({ theme, id, useUsers, isEditable = false }) {
  const { useUser, saveUser } = useUsers();
  const { user } = useUser(id);
  // const [mode, setMode] = useState(props.mode ? props.mode : "read");
  // const [formData, setFormData] = useState(user);
  // useEffect(() => setFormData(user), [user]);

  return (
    user && (
      <form className={css.userForm} onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <div className={css.imageWrapper}>
            {isEditable ? (
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
            ) : (
              <img className={theme.profileImage} src={user.photoUrl} />
            )}
          </div>

          <label className={css.username}>{user.displayName}</label>
        </fieldset>
      </form>
    )
  );
}
