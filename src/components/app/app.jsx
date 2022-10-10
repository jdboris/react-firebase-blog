import { ArticleProvider, useArticles } from "../../contexts/articles";
import { CommentProvider, useComments } from "../../contexts/comments";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { SettingsProvider, useSettings } from "../../contexts/settings";
import { UserProvider, useUsers } from "../../contexts/users";
import "../../firebase";
import { Footer } from "../footer/footer";
import { Header } from "../header";
import { Main } from "../main";

export function App({ theme }) {
  return (
    <div className={theme.root}>
      <FirebaseAuthProvider>
        <UserProvider>
          <SettingsProvider useFirebaseAuth={useFirebaseAuth}>
            <CommentProvider useFirebaseAuth={useFirebaseAuth}>
              <ArticleProvider
                useFirebaseAuth={useFirebaseAuth}
                useComments={useComments}
              >
                <Header
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useSettings={useSettings}
                />
                <Main
                  theme={theme}
                  useFirebaseAuth={useFirebaseAuth}
                  useUsers={useUsers}
                  useSettings={useSettings}
                  useArticles={useArticles}
                  useComments={useComments}
                />
                <Footer theme={theme} useSettings={useSettings} />
              </ArticleProvider>
            </CommentProvider>
          </SettingsProvider>
        </UserProvider>
      </FirebaseAuthProvider>
    </div>
  );
}
