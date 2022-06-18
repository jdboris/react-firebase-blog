import { FaUpload } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import css from "./file-input.module.scss";
import { useDropzone } from "react-dropzone";

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

export function FileInput({ theme, onChange }) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: { "image/*": [] } });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <span
      className={css.fileInput}
      {...getRootProps({ style })}
      // NOTE: To stop propagation up to ancestor label which triggers a second "click" on the input
      onClick={(e) => e.stopPropagation()}
    >
      <FaUpload /> Drag and drop or <strong>choose a file.</strong>
      <input {...getInputProps()} />
    </span>
  );
}
