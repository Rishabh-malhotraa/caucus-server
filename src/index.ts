import express from "express";
import cors from "cors";
import passport from "passport";
import chalk from "chalk";
import { COOKIE_KEYS, CLIENT_URL, port } from "./config.keys";
import authRoutes from "./routes/auth-routes";
import apiRoutes from "./routes/api-routes";
import cookieParser from "cookie-parser";
import http from "http";
import bodyParser from "body-parser";
import socketioService from "./service/socket-io-service";
import session from "express-session";
import "./service/passport";
import path from "path";
// import cookieSession from "cookie-session";

// import cookieSession from "cookie-session";

const app = express();
const httpServer = new http.Server(app);

app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookies from browser to pass throught
  })
);
app.use(cookieParser());

// app.use(
//   cookieSession({
//     secure: false,
//     name: "session",
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [...COOKIE_KEYS],
//   })
// );

app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: COOKIE_KEYS,
    name: "caucus-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: false,
      sameSite: true, // 2nd change.
    },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // deserialize cookie from the browser

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
socketioService(httpServer, app);

app.use(express.static(path.join(__dirname, "/../public")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

httpServer.listen(port, () => console.log(chalk.blueBright(`Express Server listening to port ${port}`)));

export type ServerType = typeof httpServer;
