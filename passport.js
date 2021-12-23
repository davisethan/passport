"use strict";
exports.__esModule = true;
exports.PassportLocalSignup = void 0;
var bcrypt = require("bcrypt");
var LocalStrategy = require("passport-local");
/**
 * Express.js webapp authentication
 */
var PassportLocalSignup = /** @class */ (function () {
    /**
     * Express.js webapp authentication
     * @param {any} params Grouped parameters
     */
    function PassportLocalSignup(params) {
        var _this = this;
        /**
         * Configure Express.js webapp authentication
         * @returns {void}
         */
        this.configure = function () {
            _this.passport.use("local-signup", new LocalStrategy(_this.localStrategy));
            _this.serializeUser();
            _this.deserializeUser();
        };
        /**
         * Express.js webapp local signup strategy
         * @param {string} username Local signup username
         * @param {string} password Local signup password
         * @param {any} done Local signup strategy end callback
         * @returns {void}
         */
        this.localStrategy = function (username, password, done) {
            _this.username = username;
            _this.password = password;
            _this.localSignup()
                .then(function (user) { return done(null, user); })["catch"](function () { return done(null, null); });
        };
        /**
         * Express.js webapp local signup
         * @returns {any} Promised local signup user, else error
         */
        this.localSignup = function () {
            return _this.memoryStore.store.has(_this.username) ?
                new Promise(function (resolve, reject) { return reject(); }) :
                _this.localSignupCreateUser();
        };
        /**
         * Express.js webapp local signup create user
         * @returns {any} Promised local signup user, else error
         */
        this.localSignupCreateUser = function () {
            return _this.localSignupHashUser()
                .then(_this.localSignupSaveUser);
        };
        /**
         * Express.js webapp local signup hash user
         * @returns {any} Promised local signup hashed user password, else error
         */
        this.localSignupHashUser = function () {
            var saltRounds = 8;
            return bcrypt.hash(_this.password, saltRounds);
        };
        /**
         * Express.js webapp local signup save user in memorystore
         * @param {string} hash Local signup hashed user password
         * @returns {any} Promised local signup user
         */
        this.localSignupSaveUser = function (hash) {
            _this.hash = hash;
            _this.memoryStore.store.set(_this.username, _this.hash);
            return new Promise(function (resolve, reject) { return resolve({
                username: _this.username,
                password: _this.hash
            }); });
        };
        /**
         * Serialize user to start web session
         * @returns {void}
         */
        this.serializeUser = function () {
            _this.passport.serializeUser(function (user, done) { return done(null, user.username); });
        };
        /**
         * Deserialize user to verify web session
         * @returns {void}
         */
        this.deserializeUser = function () {
            _this.passport.deserializeUser(function (username, done) {
                var user = {
                    username: username,
                    password: _this.memoryStore.store.get(username)
                };
                done(null, user);
            });
        };
        this.session = params.session;
        this.passport = params.passport;
        this.memoryStore = params.memoryStore;
    }
    return PassportLocalSignup;
}());
exports.PassportLocalSignup = PassportLocalSignup;
