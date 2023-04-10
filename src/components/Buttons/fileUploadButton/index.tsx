import React, { ChangeEventHandler, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    position: "relative",
    border: `1px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    // overflow: 'hidden',
    "&:hover": {
      cursor: "pointer",
      "& $imagePreview": {
        opacity: 0.7,
      },
    },
  },
  input: {
    display: "none",
  },
  centeredButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  imagePreview: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    transition: "opacity 0.2s ease-in-out",
  },
  removeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export function FileUpload({
  file,
  setFile,
  onChange,
}: {
  file: File | null;
  setFile: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const classes = useStyles();

  const handleFileRemove = () => {
    setFile(null);
  };

  return (
    <div className={classes.root}>
      {file ? (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt="Selected file preview"
            className={classes.imagePreview}
          />
          <IconButton
            className={classes.removeButton}
            onClick={handleFileRemove}
            aria-label="remove file"
          >
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <input
            accept=".jpg,.jpeg,.png"
            className={classes.input}
            id="contained-button-file"
            multiple={false}
            type="file"
            name="image"
            onChange={onChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              className={classes.centeredButton}
            >
              Upload File
            </Button>
          </label>
        </>
      )}
    </div>
  );
}
