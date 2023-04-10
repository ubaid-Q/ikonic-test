import { Router } from "express";
import multer from "multer";
import {
  AuthMiddleware,
  isAuthorized,
} from "../../middlewares/auth.middleware";
import { Posts } from "./handler";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const posts = new Posts();
const { get, remove, update, create, getByUser } = posts;

export const postRouter = Router();

postRouter.get("/", get.bind(posts));
postRouter.use(AuthMiddleware);
postRouter.get("/user", getByUser.bind(posts));
postRouter.get("/:id", get.bind(posts));
postRouter.post("/", upload.single('image'), create.bind(posts));
postRouter.patch("/:id", update.bind(posts));
postRouter.delete("/:id", remove.bind(posts));
