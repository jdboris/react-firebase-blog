import css from "./app.module.scss";
import "../../firebase";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { Header } from "../header";

export function App({ theme }) {
  return (
    <div className={theme.theme}>
      <FirebaseAuthProvider>
        <Header useFirebaseAuth={useFirebaseAuth} />
        <main></main>
        <footer></footer>
      </FirebaseAuthProvider>
    </div>
  );
}
