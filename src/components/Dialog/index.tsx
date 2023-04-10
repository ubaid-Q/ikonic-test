import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Input, TextField } from "@mui/material";
import { api } from "../../config/axoisConfig";
import { SnackBarState } from "../../app/interfaces";
import { SnackBar } from "../snackBar";
import { useDispatch } from "react-redux";
import { userPosts } from "../../store";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "../Buttons/fileUploadButton";

export function CreatePostDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [file, setFile] = React.useState<File | null>(null);
  const [snackBar, setSnackBar] = React.useState<SnackBarState>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.append("image", file ? file : "");
      const res = await api.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        dispatch(userPosts(res.data.data));
        setOpen(false);
      }
    } catch (error: any) {
      const res = error.response;
      if (res.status === 400) {
        const errors = res.data.errors
          ?.map((err: any) => Object.values(err.constraints))
          .flat();
        const li = errors?.map((err: any) => <li>{err}</li>);
        setSnackBar({
          open: true,
          message: (
            <>
              <strong>{res.data.message}</strong> <br /> <ul>{li}</ul>
            </>
          ),
          severity: "error",
        });
      }
      if (res.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <SnackBar
        open={snackBar.open}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
        message={snackBar.message}
        severity={snackBar.severity}
      />
      <Dialog
        fullWidth
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Create a new post
        </DialogTitle>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <DialogContent>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
            />
            <br />
            <br />
            <TextField
              multiline
              rows={6}
              name="content"
              label="Content"
              variant="outlined"
              fullWidth
            />
            <br />
            <br />
            <FileUpload
              file={file}
              setFile={setFile}
              onChange={handleFileSelect}
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="outlined"
              color="error"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit" autoFocus>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
