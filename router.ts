import * as express from "express";
import * as path from "path";

/**
 * Express.js webapp router
 */
class PassportRouter {
    private passport: any;
    private memoryStore: any;
    private router: any;

    /**
     * Express.js webapp router
     * @param {any} params Grouped parameters
     */
    public constructor(params: any) {
        this.passport = params.passport;
        this.memoryStore = params.memoryStore;
        this.router = express.Router();
    }

    /**
     * Express.js webapp router
     * @returns {any} Express.js webapp router
     */
    public getRouter = (): any => {
        return this.router;
    }

    /**
     * Express.js webapp configure router
     * @returns {void}
     */
    public configure = (): void => {
        this.getRoot();
        this.getSignup();
        this.postLocalSignup();
    }

    /**
     * Express.js webapp HTTP GET root page
     * @returns {void}
     */
    private getRoot = (): void => {
        this.router.get("/", (req: any, res: any): void => {
            const filename: string = "home.html";
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });
    }

    /**
     * Express.js webapp HTTP GET signup page
     * @returns {void}
     */
    private getSignup = (): void => {
        this.router.get("/signup", (req: any, res: any): void => {
            const filename: string = "signup.html"
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });
    }

    /**
     * Express.js webapp HTTP POST local signup
     * @returns {void}
     */
    private postLocalSignup = (): void => {
        this.router.post("/local-signup", this.passport.authenticate("local-signup", {
            successRedirect: "/",
            failureRedirect: "/signup"
        }));
    }
}

export default PassportRouter;
