import css from "./article-editor.module.scss";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { default as React, useEffect } from "react";
import {
  FaBold,
  FaHeading,
  FaImage,
  FaItalic,
  FaList,
  FaListOl,
  FaQuoteLeft,
  FaStrikethrough,
} from "react-icons/fa";
import { GrRedo, GrReturn, GrUndo } from "react-icons/gr";
import { RiCodeSFill, RiCodeSSlashFill } from "react-icons/ri";
import { VscHorizontalRule } from "react-icons/vsc";
import { uploadFile } from "../../utils/files";
import FileInput from "../file-input/file-input";

const MenuBar = ({ editor, ...props }) => {
  if (!editor) {
    return null;
  }

  return (
    <header {...props}>
      <span className={css.buttonGroup}>
        <button
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().toggleBold().run()
          }
          className={editor.isActive("bold") ? css.active : ""}
        >
          <FaBold />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().toggleItalic().run()
          }
          className={editor.isActive("italic") ? css.active : ""}
        >
          <FaItalic />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().toggleStrike().run()
          }
          className={editor.isActive("strike") ? css.active : ""}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().toggleCode().run()
          }
          className={editor.isActive("code") ? css.active : ""}
        >
          <RiCodeSFill />
        </button>
      </span>

      <span className={css.buttonGroup}>
        <button
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? css.active : ""}
        >
          <FaHeading />
        </button>

        <button
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? css.active : css.small
          }
        >
          <FaHeading />
        </button>
      </span>
      <span className={css.buttonGroup}>
        <button
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().toggleBulletList().run()
          }
          className={editor.isActive("bulletList") ? css.active : ""}
        >
          <FaList />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().toggleOrderedList().run()
          }
          className={editor.isActive("orderedList") ? css.active : ""}
        >
          <FaListOl />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().toggleCodeBlock().run()
          }
          className={editor.isActive("codeBlock") ? css.active : ""}
        >
          <RiCodeSSlashFill />
        </button>
        <button
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().toggleBlockquote().run()
          }
          className={editor.isActive("blockquote") ? css.active : ""}
        >
          <FaQuoteLeft />
        </button>

        <FileInput
          buttonMode={true}
          onChange={async (files) => {
            (await Promise.all(files.map((file) => uploadFile(file)))).forEach(
              (url) => editor.chain().focus().setImage({ src: url }).run()
            );
          }}
        >
          <FaImage />
        </FileInput>
      </span>
      <span className={css.buttonGroup}>
        <button
          className={css.altButton}
          onClick={(e) =>
            e.preventDefault() ||
            editor.chain().focus().setHorizontalRule().run()
          }
        >
          <VscHorizontalRule />
        </button>
        <button
          className={css.altButton}
          onClick={(e) =>
            e.preventDefault() || editor.chain().focus().setHardBreak().run()
          }
        >
          <GrReturn />
        </button>
      </span>
      <button
        style={{ marginLeft: "auto" }}
        onClick={(e) =>
          e.preventDefault() || editor.chain().focus().undo().run()
        }
      >
        <GrUndo />
      </button>
      <button
        onClick={(e) =>
          e.preventDefault() || editor.chain().focus().redo().run()
        }
      >
        <GrRedo />
      </button>
    </header>
  );
};

export const ArticleEditor = ({
  theme,
  value,
  hideToolbar = false,
  renderToolbar = true,
  disabled = false,
  onChange,
  className,
  ...props
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    ...props,
  });

  useEffect(() => {
    editor && editor.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className={css.articleEditor + " " + className}>
      {renderToolbar && (
        <MenuBar editor={editor} className={hideToolbar ? css.invisible : ""} />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
