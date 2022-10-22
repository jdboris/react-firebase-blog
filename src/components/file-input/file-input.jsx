import { createRef, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import css from "./file-input.module.scss";

const baseStyle = {
  display: "inline-flex",
  flexWrap: "wrap",
  gap: "1em",
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
  accept,
  ...props
}) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    inputRef,
  } = useDropzone({
    accept: {
      [accept]: [],
    },
    multiple: false,
    disabled: !buttonMode ? disabled : false,
  });

  // const inputRef = createRef();

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
      // Reset the input value to allow triggering the onChange event by selecting the same file again
      inputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  return buttonMode ? (
    <>
      <button
        {...props}
        className={props.className + " " + css.fileInput}
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
      {...props}
      className={props.className + " " + css.fileInput}
      {...getRootProps({ style })}
      // NOTE: To stop propagation up to ancestor label which triggers a second "click" on the input
      // onClick={(e) => e.stopPropagation()}
    >
      <FaUpload />
      <span>
        {" "}
        Drag and drop or <strong>choose a file.</strong>
      </span>
      <input {...getInputProps()} />
      {children}
    </span>
  );
}
