import authRouter from "./authRouter.js";
import jobRouter from "./jobRouter.js";
import error from "../middleware/error.js";
import notFoundMiddleware from "../middleware/not-found.js";
import auth from "../middleware/auth.js";
export default function (app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/jobs", auth, jobRouter);
  app.use(notFoundMiddleware)
  app.use(error)
}
