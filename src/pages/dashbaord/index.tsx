import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SnackBarState } from "../../app/interfaces";
import { CreatePostDialog } from "../../components/Dialog";
import Layout from "../../components/layout";
import PostCard from "../../components/posts/card";
import { SnackBar } from "../../components/snackBar";
import { api } from "../../config/axoisConfig";
import { addPosts, deleteUserPost, RootState, userPosts } from "../../store";

function Dashboard(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialog, setDialog] = React.useState(false);
  const posts = useSelector((state: RootState) => state.posts.userPosts);
  const [snackBar, setSnackBar] = React.useState<SnackBarState>({
    open: false,
    message: "",
    severity: "error",
  });

  async function getPosts() {
    try {
      const res = await api.get("/api/post/user");
      if (res.status === 200) {
        dispatch(userPosts(res.data.data));
      }
      if (res.status === 401) {
        navigate("/login");
      }
    } catch (error: any) {
      navigate("/login");
    }
  }

  React.useEffect(() => {
    getPosts();
  }, []);

  const deletePost = async (id: any) => {
    try {
      const res = await api.delete(`/api/post/${id}`);
      if (res.status === 200) {
        dispatch(deleteUserPost(id));
        setSnackBar({
          message: res.data.message,
          severity: "success",
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <SnackBar
        open={snackBar.open}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
        message={snackBar.message}
        severity={snackBar.severity}
      />
      <CreatePostDialog open={dialog} setOpen={setDialog} />
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1>Dashbaord</h1>
            <h3>Your Posts</h3>
          </div>
          <Button
            sx={{ alignSelf: "center" }}
            variant="contained"
            color="success"
            onClick={() => setDialog(true)}
          >
            Create a Post
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.keys(posts).length > 0 &&
            posts.map(
              (post, i) =>
                post && (
                  <PostCard
                    key={i}
                    post={post}
                    deleteHandler={deletePost}
                    index={i}
                  />
                )
            )}
        </Box>
      </Container>
    </Layout>
  );
}

export default Dashboard;
