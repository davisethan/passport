import * as bcrypt from "bcrypt";
import * as LocalStrategy from "passport-local";

/**
 * Express.js webapp authentication
 */
class PassportLocalLogin {
    private username: string;
    private password: string;
    private hash: string;
    private session: any;
    private passport: any;
    private memoryStore: any;

    /**
     * Express.js webapp authentication
     * @param {any} options Grouped parameters
     */
    public constructor(options: any) {
        this.session = options.session;
        this.passport = options.passport;
        this.memoryStore = options.memoryStore;
    }

    /**
     * Configure Express.js webapp authentication
     * @returns {void}
     */
    public configure = (): void => {
        this.passport.use("local-login", new LocalStrategy(this.localStrategy));
        this.serializeUser();
        this.deserializeUser();
    }

    /**
     * Express.js webapp local login strategy
     * @param {string} username Local login username
     * @param {string} password Local login password
     * @param {any} done Local login strategy end callback
     * @returns {void}
     */
    private localStrategy = (username: string, password: string, done: any): void => {
        this.username = username;
        this.password = password;
        this.localLogin()
            .then((user: any): void => done(null, user))
            .catch((): void => done(null, null));
    }

    /**
     * Express.js webapp local login
     * @returns {any} Promised local login user, else error
     */
    private localLogin = (): any => {
        return this.memoryStore.store.has(this.username) ?
            this.localLoginConfirmUser() :
            new Promise((resolve: any, reject: any): void => reject());
    }

    /**
     * Local login confirm user exists
     * @returns {any} Promised user existence
     */
    private localLoginConfirmUser = (): any => {
        const hash: string = this.memoryStore.store.get(this.username);
        this.hash = hash;
        return bcrypt.compare(this.password, this.hash)
            .then((passwordCorrect) => {
                return passwordCorrect ?
                    new Promise((resolve: any, reject: any) => resolve({
                        username: this.username,
                        password: this.hash
                    })) :
                    new Promise((resolve: any, reject: any) => reject());
            });
    }

    /**
     * Serialize user to start web session
     * @returns {void}
     */
     private serializeUser = (): void => {
        this.passport.serializeUser((user: any, done: any): void => done(null, user.username));
    }

    /**
     * Deserialize user to verify web session
     * @returns {void}
     */
    private deserializeUser = (): void => {
        this.passport.deserializeUser((username: string, done: any): void => {
            const user: any = {
                username: username,
                password: this.memoryStore.store.get(username)
            };
            done(null, user);
        });
    }
}

export default PassportLocalLogin;
