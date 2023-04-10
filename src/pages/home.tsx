import { Container } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout";
import PostCard from "../components/posts/card";
import { api } from "../config/axoisConfig";
import { addPosts, RootState } from "../store";

function Home(props: any) {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.allPosts);

  async function getPosts() {
    try {
      const res = await api.get("/api/post");
      if (res.status === 200) {
        dispatch(addPosts(res.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    console.log("HOME Page");

    getPosts();
  }, []);

  return (
    <Layout>
      <Container maxWidth="xl">
        <h1>Posts</h1>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {posts.map((post, i) => (
            <PostCard key={i} post={post} index={i} />
          ))}
        </Box>
      </Container>
    </Layout>
  );
}

export default Home;
