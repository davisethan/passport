import * as bcrypt from "bcrypt";

class LocalPassport {
    private memoryStore: any;

    public constructor(memoryStore: any) {
        this.memoryStore = memoryStore;
    }

    public localSignupStrategy: any = async (username: string, password: string, done: any): Promise<any> => {
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

    public localLoginStrategy: any = async (username: string, password: string, done: any): Promise<any> => {
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

    public serializeUser: any = (user: any, done: any): void => {
        done(null, user.username);
    }

    public deserializeUser: any = (username: string, done: any): void => {
        const user: any = {
            username: username,
            password: this.memoryStoreGetPassword(username)
        };
        done(null, user);
    }

    private memoryStoreHasUsername: any = (username: string): boolean => {
        return this.memoryStore.store.has(username);
    }

    private memoryStoreSetUsernameAndPassword: any = async (username: string, password: string): Promise<any> => {
        const saltRounds: number = 8;
        const hash: string = await bcrypt.hash(password, saltRounds);
        this.memoryStore.store.set(username, hash);
    }

    private memoryStoreGetPassword: any = (username: string): string => {
        return this.memoryStore.store.get(username);
    }

    private memoryStorePasswordMatch: any = async (username: string, password: string): Promise<any> => {
        const hash: string = this.memoryStoreGetPassword(username);
        const passwordMatch: boolean = await bcrypt.compare(password, hash);
        return passwordMatch;
    }
}

export default LocalPassport;
