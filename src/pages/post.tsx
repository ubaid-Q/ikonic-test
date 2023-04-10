import React, { useEffect, useState } from "react";
import { Send as SendIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addPostComment, deleteComment, RootState } from "../store";
import { COMMENT, POST, SnackBarState } from "../app/interfaces";
import Layout from "../components/layout";
import { useLocation, useParams } from "react-router-dom";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { api } from "../config/axoisConfig";
import { SnackBar } from "../components/snackBar";

export const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { page, postIndex } = useLocation().state;
  const user = useSelector((state: RootState) => state.user.user);
  const allpost = useSelector((state: RootState) => state.posts.allPosts);
  const userPosts = useSelector((state: RootState) => state.posts.userPosts);
  const [comments, setComments] = React.useState<COMMENT[]>();
  const [loading, setLoading] = React.useState(false);
  const [post, setPost] = useState<POST>({
    id: 0,
    comments: [],
    content: "",
    createdAt: new Date(),
    image: "",
    title: "",
    updatedAt: new Date(),
    user: {},
  });
  const [snackBar, setSnackBar] = React.useState<SnackBarState>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const res = await api.post(
        "/api/comment",
        { postId: post.id, content: formData.get("content") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      if (res.status === 201) {
        setSnackBar({
          message: res.data.message,
          open: true,
          severity: "success",
        });
        setLoading(false);
        id && dispatch(addPostComment({ postIndex, comment: res.data.data }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCommentDelete = async (commentId: any, index: any) => {
    try {
      const res = await api.delete(`/api/comment/${commentId}`);
      if (res.status === 200) {
        setSnackBar({
          message: res.data.message,
          open: true,
          severity: "success",
        });
        setLoading(false);
        dispatch(deleteComment({ postIndex, commentIndex: index }));
      }
    } catch (error: any) {
      setSnackBar({
        message: error.response.data.message,
        open: true,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (user.id && page === "/dashboard") {
      const post = userPosts[postIndex];
      if (post) {
        setPost(post);
        setComments(post?.comments);
      }
    } else {
      const post = allpost[postIndex];
      if (post) {
        setPost(post);
        setComments(post?.comments);
      }
    }
  }, [user, id, userPosts, allpost, post.comments, page, postIndex]);

  return (
    <Layout>
      <SnackBar
        open={snackBar.open}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
        message={snackBar.message}
        severity={snackBar.severity}
      />
      <Grid margin={1} width="80%" marginLeft={"auto"} marginRight={"auto"}>
        <img src={post?.image} alt={post?.title} style={{ width: "100%" }} />
        <Typography variant="h4" sx={{ textDecoration: "underline" }}>
          {post.title}
        </Typography>
        <Typography variant="subtitle1">
          <strong>
            {" "}
            {`By ${post.user.firstName} on ${new Date(
              post.createdAt
            ).toDateString()}`}
          </strong>
        </Typography>
        <br />
        <br />
        <Typography variant="body1">{post.content}</Typography>
        <br />
        <Typography variant="h5">Comments ({comments?.length})</Typography>
        <Divider />
        <br />
        <br />
        <Grid container spacing={2}>
          {comments?.map(
            (comment, i) =>
              comment && (
                <Grid key={comment.id} item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                  >{`Comment by ${comment.user.firstName} on ${new Date(
                    "1234"
                  ).toDateString()}`}</Typography>
                  <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                    {comment.content}
                  </Typography>
                  {comment.user.id === user.id && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleCommentDelete(comment.id, i)}
                    >
                      Delete
                    </Button>
                  )}
                </Grid>
              )
          )}
        </Grid>
        <br />
        {Object.keys(user).length > 0 ? (
          <form onSubmit={handleCommentSubmit}>
            <TextField
              label="Add a comment"
              name="content"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SendIcon />}
              disabled={loading}
            >
              {loading ? "Sending..." : "Post Comment"}
            </Button>
          </form>
        ) : (
          <h4>Sign In to comment on this post</h4>
        )}
      </Grid>
      <br />
      <br />
      <br />
      <br />
    </Layout>
  );
};
