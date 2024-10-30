import express from "express";
import dotenv from "dotenv";
dotenv.config();

//routes
import routes from "./routes/index";

//connect to database
import "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import path from "path";
import { IUserPayload } from "./interfaces/IUserPayload";
import rateLimit from "express-rate-limit";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserPayload;
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(limiter);
app.use("/api/v1", routes);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
