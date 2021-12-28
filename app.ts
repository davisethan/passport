import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as session from "express-session";
const MemoryStore: any = require("memorystore")(session);
import LocalPassport from "./localPassport";
import Router from "./router";

// Memorystore
const memoryStore: any = new MemoryStore({ checkPeriod: 86400000 }); // 24 hours

// Middleware
const app: any = express();
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
const localPassport: any = new LocalPassport(memoryStore);
passport.use("local-signup", new LocalStrategy(localPassport.localSignupStrategy));
passport.use("local-login", new LocalStrategy(localPassport.localLoginStrategy));
passport.serializeUser((user: any, done: any): void => done(null, user.username));
passport.deserializeUser((username: string, done: any): void => {
    const user: any = {
        username: username,
        password: memoryStore.store.get(username)
    };
    done(null, user);
});

// Router
const router: any = new Router(passport);
app.use(router.getRouter());

// Port
const PORT: number = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT} live`));
