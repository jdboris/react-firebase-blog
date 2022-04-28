import css from "./article-editor.module.scss";
import isHotkey from "is-hotkey";
import React, { useCallback, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Text,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { jsx } from "slate-hyperscript";
import { Editable, Slate, useSlate, withReact } from "slate-react";
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
} from "react-icons/fa";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export function ArticleEditor({ theme, name, value = "<p></p>", onChange }) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  editor.children = deserialize(
    new DOMParser().parseFromString(value, "text/html").body
  );

  return (
    <Slate
      editor={editor}
      onChange={(value) => {
        if (value) {
          onChange(serialize({ children: value }));
        }
      }}
      value={deserialize(
        new DOMParser().parseFromString(value, "text/html").body
      )}
    >
      <div className={css.articleEditor}>
        <header>
          <span className={css.formatControls}>
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
          </span>
        </header>
        <Editable
          name={name}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
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

const Element = ({ attributes, children, element }) => {
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
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
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
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      onClick={(e) => {
        e.preventDefault();
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
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </button>
  );
};

function serialize(node) {
  return ReactDOMServer.renderToStaticMarkup(toElements(node));
}

function toElements(node) {
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
        { type: "quote", align: el.style.textAlign },
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

    default:
      return children;
  }
};
