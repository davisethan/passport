import * as express from "express";
import * as path from "path";

class Router {
    private passport: any;
    private router: any;

    /**
     * Webapp router
     * @param passport Authentication module
     */
    public constructor(passport: any) {
        this.passport = passport;
        this.router = express.Router();
        this.setRouter();
    }

    /**
     * Get webapp router
     * @returns Webapp router
     */
    public getRouter: any = (): any => {
        return this.router;
    }

    /**
     * Set webapp router
     */
    private setRouter: any = (): void => {
        // Home page
        this.router.get("/", (req: any, res: any): void => {
            res.sendFile(path.join(__dirname, "/public/home.html"));
        });

        // Signup page
        this.router.get("/signup", (req: any, res: any): void => {
            res.sendFile(path.join(__dirname, "/public/signup.html"));
        });

        // Login page
        this.router.get("/login", (req: any, res: any): void => {
            res.sendFile(path.join(__dirname, "/public/login.html"));
        });

        // User page
        this.router.get("/user/:username", this.loggedIn, (req: any, res: any): void => {
            res.sendFile(path.join(__dirname, "/public/user.html"));
        });

        // Logout post
        this.router.post("/logout", this.loggedIn, (req: any, res: any): void => {
            req.logout();
            res.redirect("/");
        });

        // Signup post
        this.router.post("/local-signup", this.passport.authenticate("local-signup", {
            failureRedirect: "/signup"
        }), (req: any, res: any): void => {
            res.redirect(`/user/${req.user.username}`);
        });

        // Login post
        this.router.post("/local-login", this.passport.authenticate("local-login", {
            failureRedirect: "/login"
        }), (req: any, res: any): void => {
            res.redirect(`/user/${req.user.username}`);
        });

        // 404 Page Not Found
        this.router.use((req: any, res: any, next: any): void => {
            res.status(404);
            res.sendFile(path.join(__dirname, "/public/404.html"));
        });

        // 500 Server Error
        this.router.use((err: any, req: any, res: any, next: any): void => {
            res.status(500);
            res.sendFile(path.join(__dirname, "/public/500.html"));
        });
    }

    /**
     * User is logged in middleware
     * @param req User request
     * @param res User response
     * @param next Next middleware
     */
    private loggedIn: any = (req: any, res: any, next: any): void => {
        req.user ? next() : res.redirect("/login");
    }
}

export default Router;
