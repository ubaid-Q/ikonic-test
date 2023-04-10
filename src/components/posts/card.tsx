import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ConfirmDialog } from "../Dialog/confirmDialog";
import { useNavigate } from "react-router-dom";
import { POST } from "../../app/interfaces";

export default function PostCard({
  post,
  deleteHandler,
  index,
}: {
  post: POST;
  deleteHandler?: any;
  index: any;
}) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  return (
    <>
      <Card
        sx={{ width: 345, p: 1, cursor: "pointer" }}
        onClick={() =>
          navigate(`/post/${post.id}`, {
            state: { page: window.location.pathname, postIndex: index },
          })
        }
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {post?.user?.firstName?.[0].toUpperCase()}
            </Avatar>
          }
          action={
            post.user.email === user.email &&
            window.location.pathname === "/dashboard" ? (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDialog(true);
                }}
                aria-label="settings"
              >
                <Delete />
              </IconButton>
            ) : (
              ""
            )
          }
          title={<strong>{post?.title}</strong>}
          subheader={`${new Date(post.createdAt).toDateString()}`}
        />

        <CardMedia
          component="img"
          height="194"
          image={post.image}
          alt="Paella dish"
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordWrap: "break-word", textAlign: "justify" }}
          >
            {post.content.length > 100
              ? String(post.content).substring(0, 99) + "...more"
              : post?.content}
          </Typography>
        </CardContent>
        <small>
          Author: {post?.user?.firstName + " " + post?.user?.lastName}{" "}
          {post.user.id === user.id ? "(You)" : ""}
        </small>
      </Card>
      <ConfirmDialog
        open={confirmDialog}
        setOpen={setConfirmDialog}
        handler={() => deleteHandler(post.id)}
      />
    </>
  );
}
