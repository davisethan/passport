import * as bcrypt from "bcrypt";
import * as LocalStrategy from "passport-local";

/**
 * Express.js webapp authentication
 */
class PassportLocalSignup {
    private username: string;
    private password: string;
    private hash: string;
    private session: any;
    private passport: any;
    private memoryStore: any;

    /**
     * Express.js webapp authentication
     * @param {any} params Grouped parameters
     */
    public constructor(params: any) {
        this.session = params.session;
        this.passport = params.passport;
        this.memoryStore = params.memoryStore;
    }

    /**
     * Configure Express.js webapp authentication
     * @returns {void}
     */
    public configure = (): void => {
        this.passport.use("local-signup", new LocalStrategy(this.localStrategy));
        this.serializeUser();
        this.deserializeUser();
    }

    /**
     * Express.js webapp local signup strategy
     * @param {string} username Local signup username
     * @param {string} password Local signup password
     * @param {any} done Local signup strategy end callback
     * @returns {void}
     */
    private localStrategy = (username: string, password: string, done: any): void => {
        this.username = username;
        this.password = password;
        this.localSignup()
            .then((user: any): void => done(null, user))
            .catch((): void => done(null, null));
    }

    /**
     * Express.js webapp local signup
     * @returns {any} Promised local signup user, else error
     */
    private localSignup = (): any => {
        return this.memoryStore.store.has(this.username) ?
            new Promise((resolve: any, reject: any): void => reject()) :
            this.localSignupCreateUser();
    }

    /**
     * Express.js webapp local signup create user
     * @returns {any} Promised local signup user, else error
     */
    private localSignupCreateUser = (): any => {
        return this.localSignupHashUser()
            .then(this.localSignupSaveUser);
    }

    /**
     * Express.js webapp local signup hash user
     * @returns {any} Promised local signup hashed user password, else error
     */
    private localSignupHashUser = (): any => {
        const saltRounds: number = 8;
        return bcrypt.hash(this.password, saltRounds);
    }

    /**
     * Express.js webapp local signup save user in memorystore
     * @param {string} hash Local signup hashed user password
     * @returns {any} Promised local signup user
     */
    private localSignupSaveUser = (hash: string): any => {
        this.hash = hash;
        this.memoryStore.store.set(this.username, this.hash);
        return new Promise((resolve: any, reject: any): void => resolve({
            username: this.username,
            password: this.hash
        }));
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

export {
    PassportLocalSignup
};
