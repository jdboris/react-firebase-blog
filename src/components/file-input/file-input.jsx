import { FaUpload } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import css from "./file-input.module.scss";
import { useDropzone } from "react-dropzone";
import { createRef } from "react";

const baseStyle = {
  display: "inline-flex",
  gap: "0.3em",
  alignItems: "center",
  padding: "1em",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const disabledStyle = {
  cursor: "initial",
  opacity: 0.5,
};

export default function FileInput({
  onChange,
  disabled,
  buttonMode = false,
  children,
}) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone(
    buttonMode
      ? null
      : {
          accept: {
            "image/*": [],
          },
          multiple: false,
          disabled,
        }
  );

  const inputRef = createRef();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(disabled ? disabledStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject, disabled]
  );

  useEffect(() => {
    if (acceptedFiles.length) {
      onChange(acceptedFiles);
    }
  }, [acceptedFiles]);

  return buttonMode ? (
    <>
      <button
        onClick={() => {
          inputRef.current.click();
        }}
        type="button"
      >
        {children}
      </button>
      <input
        {...getInputProps()}
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
      />
    </>
  ) : (
    <span
      className={css.fileInput}
      {...getRootProps({ style })}
      // NOTE: To stop propagation up to ancestor label which triggers a second "click" on the input
      // onClick={(e) => e.stopPropagation()}
    >
      <FaUpload /> Drag and drop or <strong>choose a file.</strong>
      <input {...getInputProps()} />
      {children}
    </span>
  );
}
