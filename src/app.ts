import express from "express";
import session from "express-session";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";

import { errorHandler, NotFoundError } from "@yablonka-services/err-and-middle";
import { env } from "./config/config";
import "./config/passport-setup";

const app = express();

app.use(json());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "session",
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production" ? true : false,
    },
  })
);

app.all("*", async (_req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
