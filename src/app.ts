import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import memorystore from "memorystore";
import LocalPassport from "./localPassport";
import Router from "./router";

// Memorystore
const MemoryStore = memorystore(session);
const memoryStore = new MemoryStore({ checkPeriod: 86400000 }); // 24 hours

// Middleware
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: memoryStore,
    resave: false,
    saveUninitialized: false,
    secret: "secretsecret"
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication
const localPassport = new LocalPassport(memoryStore);
passport.use("local-signup", new LocalStrategy(localPassport.localSignupStrategy));
passport.use("local-login", new LocalStrategy(localPassport.localLoginStrategy));
passport.serializeUser(localPassport.serializeUser);
passport.deserializeUser(localPassport.deserializeUser);

// Router
const router = new Router(passport);
app.use(router.getRouter());

// Port
const port = 3000;
app.listen(port, () => console.log(`http://localhost:${PORT} live`));
