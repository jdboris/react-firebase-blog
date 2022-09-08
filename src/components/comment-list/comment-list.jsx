import { useEffect, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FaPaperPlane } from "react-icons/fa";
import { formatDateRelative } from "../../utils/date";
import css from "./comment-list.module.scss";
import { serverTimestamp } from "firebase/firestore";

export function CommentList({
  theme,
  useFirebaseAuth,
  threadId,
  useComments,
  ...props
}) {
  const { user, isLoading: isLoadingUser } = useFirebaseAuth();
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
                username: user.displayName,
                date: draft.date || serverTimestamp(),
              })
            ) {
              saveDraft(null);
            }
          }}
        >
          <fieldset disabled={isLoading}>
            <label>
              <small>{user?.displayName}</small>
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
                <header>{comment.username}</header>
                <small>{formatDateRelative(comment.date)}</small>
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
    [draft, mode, isLoadingUser, isLoading, user, thread]
  );
}
