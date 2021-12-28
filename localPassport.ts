import * as bcrypt from "bcrypt";

class LocalPassport {
    private memoryStore: any;

    /**
     * Local authentication signup and login
     * @param memoryStore Username and password pair memorystore
     */
    public constructor(memoryStore: any) {
        this.memoryStore = memoryStore;
    }

    /**
     * Local signup
     * @param username Local signup username
     * @param password Local signup password
     * @param done Local signup finished callback
     */
    public localSignupStrategy: any = (username: string, password: string, done: any): void => {
        if (this.memoryStoreHasUsername(username)) {
            done(null, null);
        } else {
            this.memoryStoreSetUsernameAndPassword(username, password);
            const user: any = {
                username: username,
                password: this.memoryStoreGetPassword(username)
            };
            done(null, user);
        }
    }

    /**
     * Local login
     * @param username Local login username
     * @param password Local login password
     * @param done Local login finished callback
     */
    public localLoginStrategy: any = (username: string, password: string, done: any): void => {
        if (!this.memoryStoreHasUsername(username)) {
            done(null, null);
        } else if (!this.memoryStorePasswordMatch(username, password)) {
            done(null, null);
        } else {
            const user: any = {
                username: username,
                password: this.memoryStoreGetPassword(username)
            };
            done(null, user);
        }
    }

    /**
     * Authentication serialize user for user session
     * @param user User for user session
     * @param done Authentication serialization finished callback
     */
    public serializeUser: any = (user: any, done: any): void => {
        done(null, user.username);
    }

    /**
     * Authentication deserialize user for user session
     * @param username Username for user
     * @param done Authentication deserialization finished callback
     */
    public deserializeUser: any = (username: string, done: any): void => {
        const user: any = {
            username: username,
            password: this.memoryStoreGetPassword(username)
        };
        done(null, user);
    }

    /**
     * Memorystore has username
     * @param username Username maybe in memorystore
     * @returns Memorystore has username
     */
    private memoryStoreHasUsername: any = (username: string): boolean => {
        return this.memoryStore.store.has(username);
    }

    /**
     * Memorystore set username and password hash pair
     * @param username Username in pair
     * @param password Password in pair
     */
    private memoryStoreSetUsernameAndPassword: any = async (username: string, password: string): Promise<any> => {
        const saltRounds: number = 8;
        const hash: string = await bcrypt.hash(password, saltRounds);
        this.memoryStore.store.set(username, hash);
    }

    /**
     * Memorystore get password hash
     * @param username Username in memorystore pair
     * @returns Password hash
     */
    private memoryStoreGetPassword: any = (username: string): string => {
        return this.memoryStore.store.get(username);
    }

    /**
     * Memorystore password hash matches password
     * @param username Username in pair
     * @param password Password maybe in pair
     * @returns Password hash matches password
     */
    private memoryStorePasswordMatch: any = async (username: string, password: string): Promise<any> => {
        const hash: string = this.memoryStoreGetPassword(username);
        const passwordMatch: boolean = await bcrypt.compare(password, hash);
        return passwordMatch;
    }
}

export default LocalPassport;
