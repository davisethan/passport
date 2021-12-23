"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
/**
 * Express.js webapp router
 */
var PassportRouter = /** @class */ (function () {
    /**
     * Express.js webapp router
     * @param {any} params Grouped parameters
     */
    function PassportRouter(params) {
        var _this = this;
        /**
         * Express.js webapp router
         * @returns {any} Express.js webapp router
         */
        this.getRouter = function () {
            return _this.router;
        };
        /**
         * Express.js webapp configure router
         * @returns {void}
         */
        this.configure = function () {
            _this.getRoot();
            _this.getSignup();
            _this.postLocalSignup();
        };
        /**
         * Express.js webapp HTTP GET root page
         * @returns {void}
         */
        this.getRoot = function () {
            _this.router.get("/", function (req, res) {
                var filename = "home.html";
                var options = {
                    root: path.join(__dirname, "/public")
                };
                res.sendFile(filename, options);
            });
        };
        /**
         * Express.js webapp HTTP GET signup page
         * @returns {void}
         */
        this.getSignup = function () {
            _this.router.get("/signup", function (req, res) {
                var filename = "signup.html";
                var options = {
                    root: path.join(__dirname, "/public")
                };
                res.sendFile(filename, options);
            });
        };
        /**
         * Express.js webapp HTTP POST local signup
         * @returns {void}
         */
        this.postLocalSignup = function () {
            _this.router.post("/local-signup", _this.passport.authenticate("local-signup", {
                successRedirect: "/",
                failureRedirect: "/signup"
            }));
        };
        this.passport = params.passport;
        this.memoryStore = params.memoryStore;
        this.router = express.Router();
    }
    return PassportRouter;
}());
exports["default"] = PassportRouter;
