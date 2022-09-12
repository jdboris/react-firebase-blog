import { useParams } from "react-router-dom";
import { UserForm } from "../user-form";

export function UserPage({ theme, useFirebaseAuth, useUsers }) {
  const { uid } = useParams();
  const { currentUser } = useFirebaseAuth();

  return (
    <UserForm
      theme={theme}
      id={uid}
      useUsers={useUsers}
      isEditable={currentUser && currentUser.uid === uid}
    />
  );
}
