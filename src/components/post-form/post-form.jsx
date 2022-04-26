import { useState } from "react";
import css from "./post-form.module.scss";

export function PostForm({ useFirebaseAuth, usePosts, ...props }) {
  const { user } = useFirebaseAuth();
  const { save, isLoading } = usePosts();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");
  const [post, setPost] = useState(
    props.post ? props.post : { uid: "", title: "", date: "", content: "" }
  );

  return (
    <form
      className={css.postForm}
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;
        if (mode == "create" || mode == "update") {
          const newPost = await save(post);
          if (newPost) {
            setPost(newPost);
            setMode("read");
          }
        }
      }}
    >
      <fieldset disabled={mode == "read" || isLoading}>
        <label>
          Title
          <input
            type="text"
            name="title"
            onChange={(e) => {
              setPost((old) => ({ ...old, [e.target.name]: e.target.value }));
            }}
          />
        </label>
        <label>
          Date
          <input
            type="datetime-local"
            name="date"
            onChange={(e) => {
              setPost((old) => ({ ...old, [e.target.name]: e.target.value }));
            }}
          />
        </label>
        <label>
          <textarea
            name="content"
            onChange={(e) => {
              setPost((old) => ({ ...old, [e.target.name]: e.target.value }));
            }}
          ></textarea>
        </label>
      </fieldset>
      {user.isWriter &&
        (mode == "read" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setMode("update");
            }}
          >
            Edit
          </button>
        ) : mode == "create" ? (
          <button>Post</button>
        ) : mode == "update" ? (
          <button>Save</button>
        ) : (
          false
        ))}
    </form>
  );
}
