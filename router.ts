import * as express from "express";
import * as path from "path";

class Router {
    private passport: any;
    private router: any;

    public constructor(passport: any) {
        this.passport = passport;
        this.router = express.Router();
        this.setRouter();
    }

    public getRouter: any = (): any => {
        return this.router;
    }

    private setRouter: any = (): void => {
        this.router.get("/", (req: any, res: any): void => {
            const filename: string = "home.html";
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });

        this.router.get("/signup", (req: any, res: any): void => {
            const filename: string = "signup.html";
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });

        this.router.get("/login", (req: any, res: any): void => {
            const filename: string = "login.html";
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });

        this.router.get("/user/:username", this.loggedIn, (req: any, res: any): void => {
            const filename: string = "user.html";
            const options: any = {
                root: path.join(__dirname, "/public")
            };
            res.sendFile(filename, options);
        });

        this.router.post("/logout", this.loggedIn, (req: any, res: any): void => {
            req.logout();
            res.redirect("/");
        });

        this.router.post("/local-signup", this.passport.authenticate("local-signup", {
            failureRedirect: "/signup"
        }), (req: any, res: any): void => {
            res.redirect(`/user/${req.user.username}`);
        });

        this.router.post("/local-login", this.passport.authenticate("local-login", {
            failureRedirect: "/login"
        }), (req: any, res: any): void => {
            res.redirect(`/user/${req.user.username}`);
        });
    }

    private loggedIn: any = (req: any, res: any, next: any): void => {
        req.user ? next() : res.redirect("/login");
    }
}

export default Router;
