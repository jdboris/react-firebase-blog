import { useEffect, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FaPaperPlane } from "react-icons/fa";
import { formatDateRelative } from "../../utils/date";
import css from "./comment-list.module.scss";
import { serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

export function CommentList({
  theme,
  useFirebaseAuth,
  threadId,
  useComments,
  ...props
}) {
  const { currentUser, isLoading: isLoadingUser } = useFirebaseAuth();
  const [mode, setMode] = useState(props.mode ? props.mode : "read");

  const { isLoading, useThread } = useComments();
  const { thread, draft, saveDraft, saveComment } = useThread(threadId);

  const lengthLimit = 256;

  return useMemo(
    () => (
      <div className={css.commentList}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isLoading) return;

            if (
              await saveComment({
                ...draft,
                user: {
                  id: currentUser.id,
                  displayName: currentUser.displayName,
                },
                date: draft.date || serverTimestamp(),
              })
            ) {
              saveDraft(null);
            }
          }}
        >
          <fieldset disabled={isLoading}>
            <label>
              <small>{currentUser?.displayName}</small>
              <TextareaAutosize
                type="text"
                name="content"
                value={draft?.content || ""}
                placeholder={
                  thread?.comments?.length
                    ? "Join the discussion..."
                    : "Start a discussion..."
                }
                onChange={(e) => {
                  saveDraft({
                    ...draft,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </label>
            <button className={theme.buttonAlt}>
              <FaPaperPlane />
            </button>
          </fieldset>
        </form>
        {thread?.comments?.length ? (
          <ul>
            {thread?.comments?.map((comment) => (
              <li key={comment.id}>
                <header>
                  <Link to={`/user/${comment.user.id}`}>
                    <img
                      className={theme.profileImage}
                      src={comment.userPhotoUrl}
                    />
                  </Link>

                  <div>
                    <Link to={`/user/${comment.user.id}`} rel="author">
                      {comment.user.displayName}
                    </Link>
                    <small>{formatDateRelative(comment.date)}</small>
                  </div>
                </header>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <em>...</em>
        )}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft, mode, isLoadingUser, isLoading, currentUser, thread]
  );
}
