import css from "./article-editor.module.scss";
import isHotkey from "is-hotkey";
import React, { useCallback, useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Text,
  Transforms,
  Node as SlateNode,
} from "slate";
import { withHistory } from "slate-history";
import { jsx } from "slate-hyperscript";
import {
  Editable,
  Slate,
  useSlate,
  withReact,
  useSlateStatic,
  ReactEditor,
  useSelected,
  useFocused,
} from "slate-react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaHeading,
  FaQuoteRight,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import isUrl from "is-url";
import imageExtensions from "image-extensions";
import { useEffect } from "react";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

export function ArticleEditor({
  theme,
  name,
  value = "<p><span></span></p>",
  onChange,
  placeholder,
  autoFocus,
  hideToolbar,
  renderToolbar = true,
  disabled,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  const onKeyDown = useCallback((event) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
        return;
      }
    }

    if (event.key === "Enter") {
      const selectedElement = SlateNode.descendant(
        editor,
        editor.selection.anchor.path.slice(0, -1)
      );

      const selectedLeaf = SlateNode.descendant(
        editor,
        editor.selection.anchor.path
      );

      if (
        selectedElement.type === "heading-two" ||
        selectedElement.type === "heading-three" ||
        selectedElement.type === "block-quote" ||
        selectedLeaf.code
      ) {
        event.preventDefault();

        if (selectedLeaf.text.length === editor.selection.anchor.offset) {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "", marks: [] }],
          });
        } else {
          Transforms.splitNodes(editor);
          Transforms.setNodes(editor, { type: "paragraph" });
        }
      }
    }
  }, []);

  return (
    <Slate
      editor={editor}
      onChange={(value) => {
        if (onChange && value) {
          onChange(serialize({ children: value }, editor));
        }
      }}
      value={deserialize(
        new DOMParser().parseFromString(value, "text/html").body
      )}
    >
      <div
        className={css.articleEditor}
        onFocus={() => {
          // setIsFocused(true);
        }}
        onBlur={() => {
          // setIsFocused(false);
        }}
      >
        {renderToolbar && (
          <header
            style={{
              ...(hideToolbar
                ? { visibility: "hidden" }
                : isFocused
                ? { visibility: "visible" }
                : {}),
            }}
          >
            <span className={css.formatControls}>
              {useMemo(
                () => (
                  <span className={css.buttonGroup}>
                    <MarkButton theme={theme} format="bold">
                      <FaBold />
                    </MarkButton>
                    <MarkButton theme={theme} format="italic">
                      <FaItalic />
                    </MarkButton>
                    <MarkButton theme={theme} format="underline">
                      <FaUnderline />
                    </MarkButton>
                    <MarkButton theme={theme} format="code">
                      <FaCode />
                    </MarkButton>
                  </span>
                ),
                [theme, css]
              )}

              <span className={css.buttonGroup}>
                <BlockButton theme={theme} format="heading-two">
                  <FaHeading />
                </BlockButton>
                <BlockButton theme={theme} format="heading-three">
                  <FaHeading style={{ padding: "0.1em" }} />
                </BlockButton>
                <BlockButton theme={theme} format="block-quote">
                  <FaQuoteRight />
                </BlockButton>
                <BlockButton theme={theme} format="numbered-list">
                  <FaListOl />
                </BlockButton>
                <BlockButton theme={theme} format="bulleted-list">
                  <FaListUl />
                </BlockButton>
              </span>

              <span className={css.buttonGroup}>
                <BlockButton theme={theme} format="left">
                  <FaAlignLeft />
                </BlockButton>
                <BlockButton theme={theme} format="center">
                  <FaAlignCenter />
                </BlockButton>
                <BlockButton theme={theme} format="right">
                  <FaAlignRight />
                </BlockButton>
                <BlockButton theme={theme} format="justify">
                  <FaAlignJustify />
                </BlockButton>
              </span>

              <span className={css.buttonGroup}>
                <InsertImageButton theme={theme} />
              </span>
            </span>
          </header>
        )}

        <div className={css.content}>
          {useMemo(
            () => (
              <Editable
                name={name}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                autoFocus={autoFocus}
                readOnly={disabled}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
              />
            ),
            [name, placeholder, autoFocus, disabled]
          )}
        </div>
      </div>
    </Slate>
  );
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const Element = ({ attributes, children, element, editor }) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "image":
      return (
        <Image
          editor={editor}
          // "Delete" the ref attribute, since this is a function component
          {...{ ...attributes, ref: undefined }}
          innerRef={attributes && attributes.ref}
          element={element}
          children={children}
        />
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Image = ({ editor, attributes, innerRef, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      {...attributes}
      // NOTE: Must do ref after attributes, since attributes contains ref: undefined
      ref={innerRef}
      className={
        css.imageWrapper + " " + (selected && focused ? css.selected : "")
      }
      onMouseDown={(e) => {
        editor;
      }}
    >
      {children}
      <div contentEditable={false}>
        <img src={element.url} draggable={true} alt="article embed" />
        <button
          className={css.small}
          onClick={() =>
            Transforms.removeNodes(editor, {
              at: ReactEditor.findPath(editor, element),
            })
          }
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const InsertImageButton = ({ theme }) => {
  const editor = useSlateStatic();

  return (
    <button
      className={theme.buttonAlt + " " + css.small}
      onClick={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        insertImage(editor, url);
      }}
    >
      <FaImage />
    </button>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ theme, format, children }) => {
  const editor = useSlate();
  return (
    <button
      className={
        theme.buttonAlt +
        " " +
        css.small +
        " " +
        (isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? css.active
          : "")
      }
      onClick={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const MarkButton = ({ theme, format, children }) => {
  const editor = useSlate();
  return (
    <button
      className={
        theme.buttonAlt +
        " " +
        css.small +
        " " +
        (isMarkActive(editor, format) ? css.active : "")
      }
      onClick={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

function serialize(node, editor) {
  return ReactDOMServer.renderToStaticMarkup(toElements(node, editor));
}

function toElements(node, editor) {
  if (Text.isText(node)) {
    return (
      <Leaf
        key={Date.now()}
        // children={escapeHtml(node.text)}
        children={node.text}
        leaf={node}
        attributes={node.attributes}
      />
    );
  }

  const children = node.children.map((n) => toElements(n));

  if (node.type) {
    return (
      <Element
        key={Date.now()}
        children={children}
        element={node}
        attributes={node.attributes}
        editor={editor}
      />
    );
  } else {
    return children;
  }
}

const deserialize = (el, markAttributes = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx("text", markAttributes, el.textContent);
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes = { ...markAttributes };

  // define attributes for text nodes
  switch (el.nodeName) {
    case "STRONG":
      nodeAttributes.bold = true;
      break;
    case "EM":
      nodeAttributes.italic = true;
      break;
    case "U":
      nodeAttributes.underline = true;
      break;
    case "CODE":
      nodeAttributes.code = true;
      break;
  }

  const children = Array.from(el.childNodes)
    .map((node) => deserialize(node, nodeAttributes))
    .flat();

  if (children.length === 0) {
    children.push(jsx("text", nodeAttributes, ""));
  }

  switch (el.nodeName) {
    case "BODY":
      return jsx("fragment", {}, children);
    case "BR":
      return "\n";
    case "BLOCKQUOTE":
      return jsx(
        "element",
        { type: "block-quote", align: el.style.textAlign },
        children
      );
    case "P":
      return jsx(
        "element",
        { type: "paragraph", align: el.style.textAlign },
        children
      );
    case "H2":
      return jsx(
        "element",
        { type: "heading-two", align: el.style.textAlign },
        children
      );
    case "H3":
      return jsx(
        "element",
        { type: "heading-three", align: el.style.textAlign },
        children
      );
    case "A":
      return jsx(
        "element",
        {
          type: "link",
          url: el.getAttribute("href"),
          align: el.style.textAlign,
        },
        children
      );
    case "UL":
      return jsx(
        "element",
        { type: "bulleted-list", align: el.style.textAlign },
        children
      );
    case "OL":
      return jsx(
        "element",
        { type: "numbered-list", align: el.style.textAlign },
        children
      );
    case "LI":
      return jsx(
        "element",
        { type: "list-item", align: el.style.textAlign },
        children
      );
    case "IMG":
      return jsx(
        "element",
        { type: "image", url: el.getAttribute("src") },
        children
      );

    default:
      return children;
  }
};
