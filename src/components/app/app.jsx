import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ArticleProvider, useArticles } from "../../contexts/articles";
import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "../../contexts/firebase-auth";
import { SettingsProvider, useSettings } from "../../contexts/settings";
import "../../firebase";
import { ArticleForm } from "../article-form";
import { Header } from "../header";
import { Homepage } from "../homepage";
import { Main } from "../main";
import { SettingsForm } from "../settings-form";

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
