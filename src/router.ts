import express, { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from "express";
import path from "path";

interface RequestUser extends Request {
    user: any
}

class Router {
    private passport;
    private router;

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
    public getRouter = () => {
        return this.router;
    }

    /**
     * Set webapp router
     */
    private setRouter = (): void => {
        // Home page
        this.router.get("/", ((req: Request, res: Response): void => {
            res.sendFile(path.join(__dirname, "../public/home.html"));
        }) as RequestHandler);

        // Signup page
        this.router.get("/signup", ((req: Request, res: Response): void => {
            res.sendFile(path.join(__dirname, "../public/signup.html"));
        }) as RequestHandler);

        // Login page
        this.router.get("/login", ((req: Request, res: Response): void => {
            res.sendFile(path.join(__dirname, "../public/login.html"));
        }) as RequestHandler);

        // User page
        this.router.get("/user/:username", this.isAuthenticated, ((req: Request, res: Response): void => {
            res.sendFile(path.join(__dirname, "../public/user.html"));
        }) as RequestHandler);

        // Logout post
        this.router.post("/logout", this.isAuthenticated, ((req: Request, res: Response): void => {
            req.logout();
            res.redirect("/");
        }) as RequestHandler);

        // Signup post
        this.router.post("/local-signup", this.passport.authenticate("local-signup", {
            failureRedirect: "/signup"
        }), ((req: RequestUser, res: Response): void => {
            res.redirect(`/user/${req.user.username}`);
        }) as RequestHandler);

        // Login post
        this.router.post("/local-login", this.passport.authenticate("local-login", {
            failureRedirect: "/login"
        }), ((req: RequestUser, res: Response): void => {
            res.redirect(`/user/${req.user.username}`);
        }) as RequestHandler);

        // 404 Page Not Found
        this.router.use(((req: Request, res: Response, next: NextFunction): void => {
            res.status(404);
            res.sendFile(path.join(__dirname, "../public/404.html"));
        }) as RequestHandler);

        // 500 Server Error
        this.router.use(((err: any, req: Request, res: Response, next: NextFunction): void => {
            res.status(500);
            res.sendFile(path.join(__dirname, "../public/500.html"));
        }) as ErrorRequestHandler);
    }

    /**
     * User is logged in middleware
     * @param req User request
     * @param res User response
     * @param next Next middleware
     */
    private isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    }
}

export default Router;
