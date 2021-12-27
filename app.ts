import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as passport from "passport";
import * as session from "express-session";
const MemoryStore: any = require("memorystore")(session);
import PassportLocalSignup from "./passportLocalSignup";
import PassportLocalLogin from "./passportLocalLogin";
import PassportRouter from "./router";

/**
 * Express.js webapp
 */
class App {
    private app: any;
    private memoryStore: any;
    private passport: any;
    private session: any;

    /**
     * Express.js webapp
     */
    public constructor() {
        this.app = express();
        this.memoryStore = new MemoryStore({
            checkPeriod: 86400000 // 24 hours
        });
        this.passport = passport;
    }

    /**
     * Configure Express.js webapp
     * @returns {void}
     */
    public configure = (): void => {
        this.configureMiddleware();
        this.configureAuthentication();
        this.configureRouter();
        this.configurePort();
    }

    /**
     * Configure Express.js webapp middleware
     * @returns {void}
     */
    private configureMiddleware = (): void => {
        this.app.use(express.static("public"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.session = session({
            cookie: {
                maxAge: 86400000 // 24 hours
            },
            store: this.memoryStore,
            resave: false,
            saveUninitialized: false,
            secret: "secretsecret"
        });
        this.app.use(this.session);
        this.app.use(this.passport.initialize());
        this.app.use(this.passport.session());
    }

    /**
     * Configure Express.js webapp authentication
     * @returns {void}
     */
    private configureAuthentication = (): void => {
        const options: any = {
            session: this.session,
            passport: this.passport,
            memoryStore: this.memoryStore
        };
        new PassportLocalSignup(options).configure();
        new PassportLocalLogin(options).configure();
    }

    /**
     * Configure Express.js webapp router
     * @returns {void}
     */
    private configureRouter = (): void => {
        const passportRouter: any = new PassportRouter({
            passport: this.passport,
            memoryStore: this.memoryStore
        });
        passportRouter.configure()
        this.app.use(passportRouter.getRouter());
    }

    /**
     * Configure Express.js webapp port
     * @returns {void}
     */
    private configurePort = (): void => {
        const PORT: number = 3000;
        this.app.listen(PORT, () => console.log(`http://localhost:${PORT} live`));
    }
}

new App().configure();
