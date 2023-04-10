import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { COMMENT, POST, USER } from "./app/interfaces";

const user: USER = {};
const userSlice = createSlice({
  name: "user",
  initialState: { user },
  reducers: {
    addUser: (state, action: PayloadAction<USER>) => {
      state.user = action.payload;
    },
    removeUser: (state, action: PayloadAction) => {
      state.user = {};
    },
  },
});
export const { addUser , removeUser} = userSlice.actions;

const postInitialState: POST[] = [];
const postsSlice = createSlice({
  name: "posts",
  initialState: { allPosts: postInitialState, userPosts: postInitialState },
  reducers: {
    addPosts: (state, action: PayloadAction<POST[]>) => {
      state.allPosts = action.payload;
    },
    userPosts: (state, action: PayloadAction<POST[] | POST>) => {
      Array.isArray(action.payload)
        ? (state.userPosts = action.payload)
        : state.userPosts.push(action.payload);
    },
    deleteUserPost: (state, action: PayloadAction<string>) => {
      const index = state.userPosts.findIndex(
        (post) => post?.id === +action.payload
      );
      delete state.userPosts[index];
    },
    addPostComment: (
      state,
      action: PayloadAction<{ postIndex: number; comment: any }>
    ) => {
      state.allPosts[action.payload.postIndex]?.["comments"].push(
        action.payload.comment
      );
      state.userPosts[action.payload.postIndex]?.["comments"].push(
        action.payload.comment
      );
    },
    deleteComment: (
      state,
      action: PayloadAction<{ postIndex: number; commentIndex: number }>
    ) => {
      console.log(action.payload);

      delete state.allPosts[action.payload.postIndex]["comments"][
        action.payload.commentIndex
      ];
      delete state.userPosts[action.payload.postIndex]?.["comments"][
        action.payload.commentIndex
      ];
    },
  },
});
export const {
  addPosts,
  userPosts,
  deleteUserPost,
  addPostComment,
  deleteComment,
} = postsSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    posts: postsSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
