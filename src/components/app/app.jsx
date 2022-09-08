import { ArticleProvider, useArticles } from "../../contexts/articles";
import { CommentProvider, useComments } from "../../contexts/comments";
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
          <CommentProvider useFirebaseAuth={useFirebaseAuth}>
            <ArticleProvider
              useFirebaseAuth={useFirebaseAuth}
              useComments={useComments}
            >
              <Header theme={theme} useFirebaseAuth={useFirebaseAuth} />
              <Main
                theme={theme}
                useFirebaseAuth={useFirebaseAuth}
                useSettings={useSettings}
                useArticles={useArticles}
                useComments={useComments}
              />
              <footer></footer>
            </ArticleProvider>
          </CommentProvider>
        </SettingsProvider>
      </FirebaseAuthProvider>
    </div>
  );
}
