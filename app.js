"use strict";
exports.__esModule = true;
var cookieParser = require("cookie-parser");
var express = require("express");
var passport = require("passport");
var session = require("express-session");
var MemoryStore = require("memorystore")(session);
var passport_1 = require("./passport");
var router_1 = require("./router");
/**
 * Express.js webapp
 */
var App = /** @class */ (function () {
    /**
     * Express.js webapp
     */
    function App() {
        var _this = this;
        /**
         * Configure Express.js webapp
         * @returns {void}
         */
        this.configure = function () {
            _this.configureMiddleware();
            _this.configureAuthentication();
            _this.configureRouter();
            _this.configurePort();
        };
        /**
         * Configure Express.js webapp middleware
         * @returns {void}
         */
        this.configureMiddleware = function () {
            _this.app.use(express.static("public"));
            _this.app.use(express.json());
            _this.app.use(express.urlencoded({ extended: true }));
            _this.app.use(cookieParser());
            _this.session = session({
                cookie: {
                    maxAge: 86400000 // 24 hours
                },
                store: _this.memoryStore,
                resave: false,
                saveUninitialized: false,
                secret: "secretsecret"
            });
            _this.app.use(_this.session);
            _this.app.use(_this.passport.initialize());
            _this.app.use(_this.passport.session());
        };
        /**
         * Configure Express.js webapp authentication
         * @returns {void}
         */
        this.configureAuthentication = function () {
            var passportLocalSignup = new passport_1.PassportLocalSignup({
                session: _this.session,
                passport: _this.passport,
                memoryStore: _this.memoryStore
            });
            passportLocalSignup.configure();
        };
        /**
         * Configure Express.js webapp router
         * @returns {void}
         */
        this.configureRouter = function () {
            var passportRouter = new router_1["default"]({
                passport: _this.passport,
                memoryStore: _this.memoryStore
            });
            passportRouter.configure();
            _this.app.use(passportRouter.getRouter());
        };
        /**
         * Configure Express.js webapp port
         * @returns {void}
         */
        this.configurePort = function () {
            var PORT = 3000;
            _this.app.listen(PORT, function () { return console.log("http://localhost:".concat(PORT, " live")); });
        };
        this.app = express();
        this.memoryStore = new MemoryStore({
            checkPeriod: 86400000 // 24 hours
        });
        this.passport = passport;
    }
    return App;
}());
new App().configure();
