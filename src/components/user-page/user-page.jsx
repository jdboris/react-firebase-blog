import { useParams } from "react-router-dom";
import { UserForm } from "../user-form";

export function UserPage({ theme, useFirebaseAuth, useUsers }) {
  const { id } = useParams();
  const { currentUser } = useFirebaseAuth();

  return (
    <UserForm
      theme={theme}
      id={id}
      useUsers={useUsers}
      isEditable={currentUser && currentUser.id === id}
    />
  );
}
