import { ArticleProvider, useArticles } from "../../contexts/articles";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { SettingsProvider, useSettings } from "../../contexts/settings";
import "../../firebase";
import { Header } from "../header";
import { Main } from "../main";

export function App({ theme }) {
  return (
    <div className={theme.root}>
      <FirebaseAuthProvider>
        <SettingsProvider useFirebaseAuth={useFirebaseAuth}>
          <ArticleProvider useFirebaseAuth={useFirebaseAuth}>
            <Header useFirebaseAuth={useFirebaseAuth} />
            <Main
              theme={theme}
              useFirebaseAuth={useFirebaseAuth}
              useSettings={useSettings}
              useArticles={useArticles}
            />
            <footer></footer>
          </ArticleProvider>
        </SettingsProvider>
      </FirebaseAuthProvider>
    </div>
  );
}
