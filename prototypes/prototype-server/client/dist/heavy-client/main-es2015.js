(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- <app-chatbox></app-chatbox> -->\r\n<router-outlet></router-outlet>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-input/message-input.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-input/message-input.component.html ***!
  \*********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<mat-form-field class=\"chat-input\" appearance=\"outline\">\r\n  <!-- add a key enter event that calls sendMessage as well -->\r\n  <input\r\n    matInput\r\n    type=\"text\"\r\n    placeholder=\"Type something\"\r\n    [(ngModel)]=\"sentMessage\"\r\n    (keyup.enter)=\"sendMessage()\"\r\n  />\r\n  <button matSuffix mat-icon-button (click)=\"sendMessage()\">\r\n    <mat-icon>send</mat-icon>\r\n  </button>\r\n</mat-form-field>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-list/message-list.component.html":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-list/message-list.component.html ***!
  \*******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<body class=\"col\">\r\n  <div class=\"navbar\">\r\n    <a (click)=\"logout()\">Logout</a>\r\n  </div>\r\n  <div class=\"outline\">\r\n    <!-- should add a section at the top with the name of the person the user's communicating with -->\r\n\r\n    <mat-card class=\"chatbox\">\r\n      <mat-card-header>\r\n        <mat-card-title>Private Chat</mat-card-title>\r\n      </mat-card-header>\r\n      <!-- add an *ngFor to display all the messages exchanged between two users -->\r\n      <!-- depending on the user, create two different classes to distinguish between each user -->\r\n      <div #container class=\"container\">\r\n        <div #currentUserMessage class=\"chat-list\"></div>\r\n      </div>\r\n      <!-- To prevent chat bubbles from overlapping with the input form -->\r\n      <div>\r\n        <mat-form-field class=\"chat-input\" appearance=\"outline\">\r\n          <input\r\n            #chatInput\r\n            matInput\r\n            type=\"text\"\r\n            placeholder=\"Type something\"\r\n            [(ngModel)]=\"sentMessage\"\r\n            (keyup.enter)=\"sendMessage()\"\r\n            autofocus\r\n          />\r\n          <button matSuffix mat-icon-button (click)=\"sendMessage()\">\r\n            <mat-icon>send</mat-icon>\r\n          </button>\r\n        </mat-form-field>\r\n      </div>\r\n    </mat-card>\r\n  </div>\r\n</body>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/login/login.component.html":
/*!*********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/login/login.component.html ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"background center\">\r\n  <div class=\"container\">\r\n    <h1 style=\"height: 8%\">PAINseau</h1>\r\n    <div class=\"form-container center\">\r\n      <mat-card class=\"form-width\">\r\n        <mat-card-title>\r\n          <h4 class=\"m-0\">Sign in</h4>\r\n        </mat-card-title>\r\n        <mat-card-content>\r\n          <form [formGroup]=\"loginForm\">\r\n            <p>\r\n              <mat-form-field class=\"max-width\">\r\n                <mat-label> Username </mat-label>\r\n                <input\r\n                  matInput\r\n                  placeholder=\"Username\"\r\n                  type=\"username\"\r\n                  [formControl]=\"usernameControl\"\r\n                />\r\n                <mat-error *ngIf=\"usernameControl.hasError('maxlength')\">\r\n                  Username must be under 12 characters\r\n                </mat-error>\r\n                <mat-error *ngIf=\"usernameControl.hasError('required')\">\r\n                  Please enter a username</mat-error\r\n                >\r\n                <mat-error>Username in use, choose another</mat-error>\r\n              </mat-form-field>\r\n            </p>\r\n\r\n            <!-- not needed for prototype -->\r\n            <!-- <p class=\"mb-15px\">\r\n                        <mat-form-field class=\"max-width\">\r\n                            <mat-label> Password </mat-label>\r\n                            <input matInput placeholder=\"Password\" type='password'>\r\n                        </mat-form-field>\r\n                    </p>\r\n                    <div class='forgot-psw right'> <a class=\"link\" href=\"https://www.linkedin.com/in/nu-chan-nhien-ton-95b776192/\">Forgot password?</a></div> -->\r\n\r\n            <div class=\"right\">\r\n              <button\r\n                type=\"button\"\r\n                (click)=\"login()\"\r\n                class=\"login-button max-width\"\r\n                mat-button\r\n                [disabled]=\"loginForm.invalid\"\r\n              >\r\n                Login\r\n              </button>\r\n            </div>\r\n            <!-- <br>\r\n                    <br>\r\n                    <div>Don't have an account? <a href=\"/signup\">Sign up!</a></div>         -->\r\n          </form>\r\n        </mat-card-content>\r\n      </mat-card>\r\n    </div>\r\n  </div>\r\n</div>\r\n");

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");



const routes = [];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let AppComponent = class AppComponent {
    constructor() {
        this.title = 'heavy-client';
    }
};
AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-root',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")).default]
    })
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm2015/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/esm2015/button.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm2015/card.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/esm2015/checkbox.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm2015/form-field.js");
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/grid-list */ "./node_modules/@angular/material/esm2015/grid-list.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm2015/input.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm2015/icon.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm2015/select.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/esm2015/snack-bar.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_chatbox_message_input_message_input_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/chatbox/message-input/message-input.component */ "./src/app/components/chatbox/message-input/message-input.component.ts");
/* harmony import */ var _components_chatbox_message_list_message_list_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/chatbox/message-list/message-list.component */ "./src/app/components/chatbox/message-list/message-list.component.ts");





















let AppModule = class AppModule {
};
AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_17__["AppComponent"],
            _components_login_login_component__WEBPACK_IMPORTED_MODULE_18__["LoginComponent"],
            _components_chatbox_message_input_message_input_component__WEBPACK_IMPORTED_MODULE_19__["MessageInputComponent"],
            _components_chatbox_message_list_message_list_component__WEBPACK_IMPORTED_MODULE_20__["MessageListComponent"],
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_16__["AppRoutingModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_15__["HttpClientModule"],
            _angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"],
            _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_5__["MatCheckboxModule"],
            _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
            _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_7__["MatGridListModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__["MatIconModule"],
            _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_13__["ReactiveFormsModule"],
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__["MatSnackBarModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_14__["RouterModule"].forRoot([
                { path: "", component: _components_login_login_component__WEBPACK_IMPORTED_MODULE_18__["LoginComponent"] },
                { path: "chat", component: _components_chatbox_message_list_message_list_component__WEBPACK_IMPORTED_MODULE_20__["MessageListComponent"] },
            ]),
        ],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_14__["RouterModule"]],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_17__["AppComponent"]],
    })
], AppModule);



/***/ }),

/***/ "./src/app/components/chatbox/message-input/message-input.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/app/components/chatbox/message-input/message-input.component.scss ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".chat-input {\n  width: 95%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9jaGF0Ym94L21lc3NhZ2UtaW5wdXQvQzpcXFVzZXJzXFx5dWhhblxcRG9jdW1lbnRzXFxVbmkzXFxMT0czOTAwLVByb2pldCBldm9sdXRpb24gbG9naWNpZWxcXGxvZzM5MDAtMTA3XFxwcm90b3R5cGVzXFxwcm90b3R5cGUtc2VydmVyXFxjbGllbnQvc3JjXFxhcHBcXGNvbXBvbmVudHNcXGNoYXRib3hcXG1lc3NhZ2UtaW5wdXRcXG1lc3NhZ2UtaW5wdXQuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2NvbXBvbmVudHMvY2hhdGJveC9tZXNzYWdlLWlucHV0L21lc3NhZ2UtaW5wdXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxVQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL2NoYXRib3gvbWVzc2FnZS1pbnB1dC9tZXNzYWdlLWlucHV0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNoYXQtaW5wdXQge1xyXG4gICAgd2lkdGg6IDk1JTtcclxufVxyXG4iLCIuY2hhdC1pbnB1dCB7XG4gIHdpZHRoOiA5NSU7XG59Il19 */");

/***/ }),

/***/ "./src/app/components/chatbox/message-input/message-input.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/components/chatbox/message-input/message-input.component.ts ***!
  \*****************************************************************************/
/*! exports provided: MessageInputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageInputComponent", function() { return MessageInputComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_chat_chat_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/chat/chat.service */ "./src/app/services/chat/chat.service.ts");



let MessageInputComponent = class MessageInputComponent {
    constructor(chatService) {
        this.chatService = chatService;
    }
    ngOnInit() { }
    // create a method sendMessage()
    // transmits message to the socket
    sendMessage() {
        console.log(this.sentMessage);
        this.chatService.message = this.sentMessage;
        this.sentMessage = "";
    }
};
MessageInputComponent.ctorParameters = () => [
    { type: src_app_services_chat_chat_service__WEBPACK_IMPORTED_MODULE_2__["ChatService"] }
];
MessageInputComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: "app-message-input",
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./message-input.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-input/message-input.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./message-input.component.scss */ "./src/app/components/chatbox/message-input/message-input.component.scss")).default]
    })
], MessageInputComponent);



/***/ }),

/***/ "./src/app/components/chatbox/message-list/message-list.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/app/components/chatbox/message-list/message-list.component.scss ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".chat-list {\n  display: flex;\n  flex-direction: column;\n}\n\n.col {\n  display: flex;\n  flex-direction: column;\n}\n\n.navbar {\n  background-color: #fff;\n}\n\n.navbar a {\n  float: left;\n  display: block;\n  color: rgba(0, 0, 0, 0.87);\n  text-align: center;\n  padding: 8px 16px;\n  text-decoration: none;\n  font-weight: 500;\n  font-size: 17px;\n}\n\n.navbar a:hover {\n  background: #e1bedc;\n  color: black;\n}\n\n.outline {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  overflow: hidden;\n  background-size: cover;\n  background-image: url(\"/assets/images/mountains.jpg\");\n}\n\n.chatbox {\n  margin-top: 10px;\n  height: 80vh;\n  width: 80vh;\n}\n\nmat-card-header {\n  border-bottom: 1px solid #a5a5a5;\n  margin-bottom: 10px;\n}\n\n.container {\n  width: auto;\n  overflow-y: auto;\n  height: 65vh;\n}\n\n.notify {\n  text-align: center;\n  color: #7d7d7d;\n  font-style: italic;\n  margin: 10px;\n}\n\n.image {\n  -o-object-fit: cover;\n     object-fit: cover;\n  border-radius: 50%;\n  width: 50px;\n  height: 50px;\n}\n\n.user-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.user-container .username {\n  font-size: small;\n}\n\n.current-user-message {\n  display: flex;\n  flex-direction: row-reverse;\n  margin-bottom: 10px;\n}\n\n.current-user-message .current-user-text {\n  background: #b09fcc;\n  color: #fff;\n  border-radius: 4px;\n  box-shadow: 0px 2px 5px #bdccd7;\n  padding: 10px;\n  font-size: 13px;\n  line-height: 1.5;\n  max-width: 460px;\n  width: auto;\n  min-width: 100px;\n  margin-right: 10px;\n  height: auto;\n  overflow-wrap: break-word;\n}\n\n.current-user-message .timeDiv {\n  font-size: 12px;\n  color: #7d7d7d;\n  margin: 5px 5px 0 0;\n}\n\n.divider {\n  height: 80px;\n}\n\n.other-user-message {\n  display: flex;\n  flex-direction: row;\n  margin-bottom: 10px;\n}\n\n.other-user-message .other-user-text {\n  background: #fff;\n  color: #2d313f;\n  border-radius: 4px;\n  box-shadow: 0px 2px 5px #bdccd7;\n  padding: 10px;\n  font-size: 13px;\n  line-height: 21px;\n  mix-blend-mode: normal;\n  opacity: 0.8;\n  max-width: 460px;\n  width: auto;\n  min-width: 100px;\n  margin-left: 10px;\n  height: auto;\n  overflow-wrap: break-word;\n}\n\n.other-user-message .timeDiv {\n  font-size: 12px;\n  color: #7d7d7d;\n  margin: 5px 0 0 5px;\n}\n\n.chat-input {\n  width: 95%;\n  position: absolute;\n  bottom: 0;\n}\n\n.input {\n  box-sizing: border-box;\n  display: inline-block;\n}\n\nmat-form-field {\n  margin-top: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9jaGF0Ym94L21lc3NhZ2UtbGlzdC9DOlxcVXNlcnNcXHl1aGFuXFxEb2N1bWVudHNcXFVuaTNcXExPRzM5MDAtUHJvamV0IGV2b2x1dGlvbiBsb2dpY2llbFxcbG9nMzkwMC0xMDdcXHByb3RvdHlwZXNcXHByb3RvdHlwZS1zZXJ2ZXJcXGNsaWVudC9zcmNcXGFwcFxcY29tcG9uZW50c1xcY2hhdGJveFxcbWVzc2FnZS1saXN0XFxtZXNzYWdlLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2NvbXBvbmVudHMvY2hhdGJveC9tZXNzYWdlLWxpc3QvbWVzc2FnZS1saXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0FDQ0Y7O0FEQ0E7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7QUNFRjs7QURBQTtFQUNFLHNCQUFBO0FDR0Y7O0FERkU7RUFDRSxXQUFBO0VBQ0EsY0FBQTtFQUNBLDBCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0FDSUo7O0FEREU7RUFDRSxtQkFBQTtFQUNBLFlBQUE7QUNHSjs7QURDQTtFQUNFLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxREFBQTtBQ0VGOztBRENBO0VBQ0UsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtBQ0VGOztBRENBO0VBQ0UsZ0NBQUE7RUFDQSxtQkFBQTtBQ0VGOztBRENBO0VBQ0UsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtBQ0VGOztBRENBO0VBRUUsa0JBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxvQkFBQTtLQUFBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNDRjs7QURBRTtFQUNFLGdCQUFBO0FDRUo7O0FERUE7RUFDRSxhQUFBO0VBQ0EsMkJBQUE7RUFDQSxtQkFBQTtBQ0NGOztBRENFO0VBQ0UsbUJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSwrQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLHlCQUFBO0FDQ0o7O0FEQ0U7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0FDQ0o7O0FER0E7RUFDRSxZQUFBO0FDQUY7O0FER0E7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFFQSxtQkFBQTtBQ0RGOztBREdFO0VBQ0UsZ0JBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSwrQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsWUFBQTtFQUNBLHlCQUFBO0FDREo7O0FER0U7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0FDREo7O0FES0E7RUFDRSxVQUFBO0VBRUEsa0JBQUE7RUFDQSxTQUFBO0FDSEY7O0FETUE7RUFDRSxzQkFBQTtFQUNBLHFCQUFBO0FDSEY7O0FETUE7RUFDRSxnQkFBQTtBQ0hGIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9jaGF0Ym94L21lc3NhZ2UtbGlzdC9tZXNzYWdlLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY2hhdC1saXN0IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbn1cclxuLmNvbCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG59XHJcbi5uYXZiYXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgYSB7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44Nyk7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nOiA4cHggMTZweDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBmb250LXNpemU6IDE3cHg7XHJcbiAgfVxyXG5cclxuICBhOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6ICNlMWJlZGM7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgfVxyXG59XHJcblxyXG4ub3V0bGluZSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiL2Fzc2V0cy9pbWFnZXMvbW91bnRhaW5zLmpwZ1wiKTtcclxufVxyXG5cclxuLmNoYXRib3gge1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgaGVpZ2h0OiA4MHZoO1xyXG4gIHdpZHRoOiA4MHZoO1xyXG59XHJcblxyXG5tYXQtY2FyZC1oZWFkZXIge1xyXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2IoMTY1LCAxNjUsIDE2NSk7IC8vIGZvciBleGFtcGxlIHRvIHJlbW92ZSB0aGUgbWFyZ2luXHJcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxufVxyXG5cclxuLmNvbnRhaW5lciB7XHJcbiAgd2lkdGg6IGF1dG87XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBoZWlnaHQ6IDY1dmg7XHJcbn1cclxuXHJcbi5ub3RpZnkge1xyXG4gIC8vIG1hcmdpbjogMCBhdXRvO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBjb2xvcjogIzdkN2Q3ZDtcclxuICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgbWFyZ2luOiAxMHB4O1xyXG59XHJcblxyXG4uaW1hZ2Uge1xyXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICB3aWR0aDogNTBweDtcclxuICBoZWlnaHQ6IDUwcHg7XHJcbn1cclxuXHJcbi51c2VyLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgLnVzZXJuYW1lIHtcclxuICAgIGZvbnQtc2l6ZTogc21hbGw7XHJcbiAgfVxyXG59XHJcblxyXG4uY3VycmVudC11c2VyLW1lc3NhZ2Uge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcblxyXG4gIC5jdXJyZW50LXVzZXItdGV4dCB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjYjA5ZmNjO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBib3gtc2hhZG93OiAwcHggMnB4IDVweCAjYmRjY2Q3O1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XHJcbiAgICBtYXgtd2lkdGg6IDQ2MHB4O1xyXG4gICAgd2lkdGg6IGF1dG87XHJcbiAgICBtaW4td2lkdGg6IDEwMHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcclxuICB9XHJcbiAgLnRpbWVEaXYge1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgY29sb3I6ICM3ZDdkN2Q7XHJcbiAgICBtYXJnaW46IDVweCA1cHggMCAwO1xyXG4gIH1cclxufVxyXG5cclxuLmRpdmlkZXIge1xyXG4gIGhlaWdodDogODBweDtcclxufVxyXG5cclxuLm90aGVyLXVzZXItbWVzc2FnZSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIC8vIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuXHJcbiAgLm90aGVyLXVzZXItdGV4dCB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gICAgY29sb3I6ICMyZDMxM2Y7XHJcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICBib3gtc2hhZG93OiAwcHggMnB4IDVweCAjYmRjY2Q3O1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAyMXB4O1xyXG4gICAgbWl4LWJsZW5kLW1vZGU6IG5vcm1hbDtcclxuICAgIG9wYWNpdHk6IDAuODtcclxuICAgIG1heC13aWR0aDogNDYwcHg7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICAgIG1pbi13aWR0aDogMTAwcHg7XHJcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XHJcbiAgfVxyXG4gIC50aW1lRGl2IHtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGNvbG9yOiAjN2Q3ZDdkO1xyXG4gICAgbWFyZ2luOiA1cHggMCAwIDVweDtcclxuICB9XHJcbn1cclxuXHJcbi5jaGF0LWlucHV0IHtcclxuICB3aWR0aDogOTUlO1xyXG5cclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm90dG9tOiAwO1xyXG59XHJcblxyXG4uaW5wdXQge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG59XHJcblxyXG5tYXQtZm9ybS1maWVsZCB7XHJcbiAgbWFyZ2luLXRvcDogMzVweDtcclxufVxyXG4iLCIuY2hhdC1saXN0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLmNvbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG5cbi5uYXZiYXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuLm5hdmJhciBhIHtcbiAgZmxvYXQ6IGxlZnQ7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg3KTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiA4cHggMTZweDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXNpemU6IDE3cHg7XG59XG4ubmF2YmFyIGE6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZTFiZWRjO1xuICBjb2xvcjogYmxhY2s7XG59XG5cbi5vdXRsaW5lIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiL2Fzc2V0cy9pbWFnZXMvbW91bnRhaW5zLmpwZ1wiKTtcbn1cblxuLmNoYXRib3gge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBoZWlnaHQ6IDgwdmg7XG4gIHdpZHRoOiA4MHZoO1xufVxuXG5tYXQtY2FyZC1oZWFkZXIge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2E1YTVhNTtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbn1cblxuLmNvbnRhaW5lciB7XG4gIHdpZHRoOiBhdXRvO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBoZWlnaHQ6IDY1dmg7XG59XG5cbi5ub3RpZnkge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjN2Q3ZDdkO1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIG1hcmdpbjogMTBweDtcbn1cblxuLmltYWdlIHtcbiAgb2JqZWN0LWZpdDogY292ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgd2lkdGg6IDUwcHg7XG4gIGhlaWdodDogNTBweDtcbn1cblxuLnVzZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi51c2VyLWNvbnRhaW5lciAudXNlcm5hbWUge1xuICBmb250LXNpemU6IHNtYWxsO1xufVxuXG4uY3VycmVudC11c2VyLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG59XG4uY3VycmVudC11c2VyLW1lc3NhZ2UgLmN1cnJlbnQtdXNlci10ZXh0IHtcbiAgYmFja2dyb3VuZDogI2IwOWZjYztcbiAgY29sb3I6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgYm94LXNoYWRvdzogMHB4IDJweCA1cHggI2JkY2NkNztcbiAgcGFkZGluZzogMTBweDtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBsaW5lLWhlaWdodDogMS41O1xuICBtYXgtd2lkdGg6IDQ2MHB4O1xuICB3aWR0aDogYXV0bztcbiAgbWluLXdpZHRoOiAxMDBweDtcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICBoZWlnaHQ6IGF1dG87XG4gIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XG59XG4uY3VycmVudC11c2VyLW1lc3NhZ2UgLnRpbWVEaXYge1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAjN2Q3ZDdkO1xuICBtYXJnaW46IDVweCA1cHggMCAwO1xufVxuXG4uZGl2aWRlciB7XG4gIGhlaWdodDogODBweDtcbn1cblxuLm90aGVyLXVzZXItbWVzc2FnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG59XG4ub3RoZXItdXNlci1tZXNzYWdlIC5vdGhlci11c2VyLXRleHQge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBjb2xvcjogIzJkMzEzZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3gtc2hhZG93OiAwcHggMnB4IDVweCAjYmRjY2Q3O1xuICBwYWRkaW5nOiAxMHB4O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxpbmUtaGVpZ2h0OiAyMXB4O1xuICBtaXgtYmxlbmQtbW9kZTogbm9ybWFsO1xuICBvcGFjaXR5OiAwLjg7XG4gIG1heC13aWR0aDogNDYwcHg7XG4gIHdpZHRoOiBhdXRvO1xuICBtaW4td2lkdGg6IDEwMHB4O1xuICBtYXJnaW4tbGVmdDogMTBweDtcbiAgaGVpZ2h0OiBhdXRvO1xuICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xufVxuLm90aGVyLXVzZXItbWVzc2FnZSAudGltZURpdiB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgY29sb3I6ICM3ZDdkN2Q7XG4gIG1hcmdpbjogNXB4IDAgMCA1cHg7XG59XG5cbi5jaGF0LWlucHV0IHtcbiAgd2lkdGg6IDk1JTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG59XG5cbi5pbnB1dCB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxubWF0LWZvcm0tZmllbGQge1xuICBtYXJnaW4tdG9wOiAzNXB4O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/components/chatbox/message-list/message-list.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/components/chatbox/message-list/message-list.component.ts ***!
  \***************************************************************************/
/*! exports provided: MessageListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageListComponent", function() { return MessageListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var socket_io_client_build_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io-client/build/index */ "./node_modules/socket.io-client/build/index.js");
/* harmony import */ var socket_io_client_build_index__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io_client_build_index__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var src_app_services_authentification_authentification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/authentification/authentification.service */ "./src/app/services/authentification/authentification.service.ts");
/* harmony import */ var src_app_services_chat_chat_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/chat/chat.service */ "./src/app/services/chat/chat.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");







const SOCKET_ENDPOINT = "localhost:3000";
// THIS WORKS AS WELL. Might need to load the page up first by visiting the link.
// const SOCKET_ENDPOINT = "https://test-23sdfg23.herokuapp.com/";
let MessageListComponent = class MessageListComponent {
    constructor(chatService, renderer, authService, router) {
        this.chatService = chatService;
        this.renderer = renderer;
        this.authService = authService;
        this.router = router;
        this.currentTime = "";
        this.currentDate = new Date();
        this.currentTime = Object(_angular_common__WEBPACK_IMPORTED_MODULE_3__["formatDate"])(this.currentDate, "hh:mm:ss", "en-US");
        this.myUsername = authService.username;
    }
    ngOnInit() {
        this.setUpSocketConnection();
        this.socket.emit("username", this.myUsername);
    }
    setUpSocketConnection() {
        this.socket = Object(socket_io_client_build_index__WEBPACK_IMPORTED_MODULE_2__["io"])(SOCKET_ENDPOINT, {
            transports: ["websocket", "polling", "flashsocket"],
        });
        // this.socket.on("joinRoom", (data) => {
        //   this.addConnectionDiv(data.username, "connected");
        // });
        this.socket.on("leaveRoom", (userName) => {
            this.addConnectionDiv(userName, "disconnected");
        });
        this.socket.on("username-broadcast", (userName) => {
            console.log(userName);
            this.otherUsername = userName;
            this.addConnectionDiv(userName, "connected");
        });
        this.socket.on("message-broadcast", (data) => {
            console.log(data.username);
            console.log(this.myUsername);
            if (data.username === this.myUsername) {
                this.selfBubble(data.message, data.time);
            }
            else {
                this.otherBubble(data.message, data.time, data.username);
            }
        });
    }
    otherBubble(msg, currentTime, username) {
        const userDiv = this.renderer.createElement("div");
        this.renderer.addClass(userDiv, "other-user-message");
        const userProfile = this.renderer.createElement("div");
        this.renderer.addClass(userProfile, "user-container");
        const userAvatarDiv = this.renderer.createElement("div");
        this.renderer.addClass(userAvatarDiv, "other-user-avatar");
        const userAvatarImg = this.renderer.createElement("img");
        this.renderer.addClass(userAvatarImg, "image");
        this.renderer.setAttribute(userAvatarImg, "src", "assets/images/anon_icon.jpg");
        const currentUsername = this.renderer.createElement("div");
        this.renderer.addClass(currentUsername, "username");
        currentUsername.innerHTML = username;
        const currentUserTxtDiv = this.renderer.createElement("div");
        this.renderer.addClass(currentUserTxtDiv, "other-user-text");
        currentUserTxtDiv.innerHTML = msg;
        const timeDiv = this.renderer.createElement("div");
        this.renderer.addClass(timeDiv, "timeDiv");
        timeDiv.innerHTML = currentTime;
        this.renderer.appendChild(userAvatarDiv, userAvatarImg);
        this.renderer.appendChild(userDiv, userProfile);
        this.renderer.appendChild(userProfile, userAvatarDiv);
        this.renderer.appendChild(userProfile, currentUsername);
        this.renderer.appendChild(userDiv, currentUserTxtDiv);
        this.renderer.appendChild(this.messageList.nativeElement, userDiv);
        this.renderer.appendChild(userDiv, timeDiv);
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
    selfBubble(msg, currentTime) {
        const currentUserDiv = this.renderer.createElement("div");
        this.renderer.addClass(currentUserDiv, "current-user-message");
        const currentUserProfile = this.renderer.createElement("div");
        this.renderer.addClass(currentUserProfile, "user-container");
        const currentUserAvatarDiv = this.renderer.createElement("div");
        this.renderer.addClass(currentUserAvatarDiv, "current-user-avatar");
        const currentUserAvatarImg = this.renderer.createElement("img");
        this.renderer.addClass(currentUserAvatarImg, "image");
        this.renderer.setAttribute(currentUserAvatarImg, "src", "assets/images/anon_icon.jpg");
        const currentUsername = this.renderer.createElement("div");
        this.renderer.addClass(currentUsername, "username");
        currentUsername.innerHTML = this.myUsername;
        const currentUserTxtDiv = this.renderer.createElement("div");
        this.renderer.addClass(currentUserTxtDiv, "current-user-text");
        currentUserTxtDiv.innerHTML = msg;
        const timeDiv = this.renderer.createElement("div");
        this.renderer.addClass(timeDiv, "timeDiv");
        timeDiv.innerHTML = currentTime;
        this.renderer.appendChild(currentUserAvatarDiv, currentUserAvatarImg);
        this.renderer.appendChild(currentUserDiv, currentUserProfile);
        this.renderer.appendChild(currentUserProfile, currentUserAvatarDiv);
        this.renderer.appendChild(currentUserProfile, currentUsername);
        this.renderer.appendChild(currentUserDiv, currentUserTxtDiv);
        this.renderer.appendChild(this.messageList.nativeElement, currentUserDiv);
        this.renderer.appendChild(currentUserDiv, timeDiv);
        this.sentMessage = "";
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
    addConnectionDiv(user, event) {
        const userConnectedDiv = this.renderer.createElement("div");
        this.renderer.addClass(userConnectedDiv, "notify");
        userConnectedDiv.innerHTML = user + " has " + event;
        this.renderer.appendChild(this.messageList.nativeElement, userConnectedDiv);
    }
    sendMessage() {
        if (this.sentMessage) {
            this.socket.emit("message", this.sentMessage);
        }
        console.log(this.otherUsername);
    }
    logout() {
        this.router.navigate(["/"]);
        this.socket.emit("return");
    }
};
MessageListComponent.ctorParameters = () => [
    { type: src_app_services_chat_chat_service__WEBPACK_IMPORTED_MODULE_5__["ChatService"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"] },
    { type: src_app_services_authentification_authentification_service__WEBPACK_IMPORTED_MODULE_4__["AuthentificationService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])("currentUserMessage", { static: false })
], MessageListComponent.prototype, "messageList", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])("chat-input", { static: false })
], MessageListComponent.prototype, "chatInput", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])("container", { static: false })
], MessageListComponent.prototype, "chatContainer", void 0);
MessageListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: "app-message-list",
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./message-list.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/chatbox/message-list/message-list.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./message-list.component.scss */ "./src/app/components/chatbox/message-list/message-list.component.scss")).default]
    })
], MessageListComponent);



/***/ }),

/***/ "./src/app/components/login/login.component.scss":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.scss ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".background {\n  min-height: 100%;\n  background-size: cover;\n  background-image: url(/assets/images/mountains.jpg);\n  justify-content: center;\n}\n.background .container {\n  height: 85vh;\n  color: #212e5b;\n  width: 42%;\n}\n.background .container .form-container {\n  background: rgba(255, 255, 255, 0.5);\n  border-radius: 14px;\n  height: 59%;\n}\n.background .container .form-container .form-width {\n  width: 50%;\n  background: rgba(255, 255, 255, 0);\n  box-shadow: none;\n  color: #212e5b;\n}\n.background .container .form-container .form-width .mb-15px {\n  margin-bottom: -15px;\n}\n.background .container .form-container .form-width .m-0 {\n  margin-top: 0px;\n  margin-bottom: 0px;\n}\n.background .container .form-container .form-width .max-width {\n  min-width: 100%;\n}\n.background .container .form-container .form-width .max-width .input-error {\n  font-size: x-small;\n}\n.background .container .form-container .form-width .right {\n  display: flex;\n  justify-content: flex-end;\n}\n.background .container .form-container .form-width .forgot-psw {\n  font-size: smaller;\n  margin-bottom: 20px;\n  z-index: 1;\n  position: relative;\n}\n.background .container .form-container .form-width .example-margin {\n  margin: 0 12px;\n}\n.background .container .form-container .form-width .login-button {\n  border: 1px solid;\n}\n.center {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9sb2dpbi9DOlxcVXNlcnNcXHl1aGFuXFxEb2N1bWVudHNcXFVuaTNcXExPRzM5MDAtUHJvamV0IGV2b2x1dGlvbiBsb2dpY2llbFxcbG9nMzkwMC0xMDdcXHByb3RvdHlwZXNcXHByb3RvdHlwZS1zZXJ2ZXJcXGNsaWVudC9zcmNcXGFwcFxcY29tcG9uZW50c1xcbG9naW5cXGxvZ2luLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9jb21wb25lbnRzL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLG1EQUFBO0VBQ0EsdUJBQUE7QUNDSjtBRENJO0VBQ0ksWUFBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0FDQ1I7QURDUTtFQUNJLG9DQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0FDQ1o7QURDWTtFQUNJLFVBQUE7RUFDQSxrQ0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0NoQjtBRENnQjtFQUNJLG9CQUFBO0FDQ3BCO0FEQ2dCO0VBQ0ksZUFBQTtFQUNBLGtCQUFBO0FDQ3BCO0FEQ2dCO0VBQ0ksZUFBQTtBQ0NwQjtBRENvQjtFQUNJLGtCQUFBO0FDQ3hCO0FERWdCO0VBQ0ksYUFBQTtFQUNBLHlCQUFBO0FDQXBCO0FERWdCO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtFQUNBLFVBQUE7RUFDQSxrQkFBQTtBQ0FwQjtBREVnQjtFQUNJLGNBQUE7QUNBcEI7QURHZ0I7RUFDSSxpQkFBQTtBQ0RwQjtBRFFBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtBQ0xKIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5iYWNrZ3JvdW5kIHtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC9hc3NldHMvaW1hZ2VzL21vdW50YWlucy5qcGcpO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgLmNvbnRhaW5lciB7XHJcbiAgICAgICAgaGVpZ2h0OiA4NXZoO1xyXG4gICAgICAgIGNvbG9yOiAjMjEyZTViO1xyXG4gICAgICAgIHdpZHRoOiA0MiU7XHJcblxyXG4gICAgICAgIC5mb3JtLWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYigyNTUgMjU1IDI1NSAvIDUwJSk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNTklO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLmZvcm0td2lkdGgge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDUwJTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYigyNTUgMjU1IDI1NSAvIDAlKTtcclxuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogIzIxMmU1YjtcclxuXHJcbiAgICAgICAgICAgICAgICAubWItMTVweCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogLTE1cHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAubS0wIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMHB4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLm1heC13aWR0aCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLXdpZHRoOiAxMDAlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAuaW5wdXQtZXJyb3Ige1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IHgtc21hbGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLnJpZ2h0IHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAuZm9yZ290LXBzdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOnNtYWxsZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICB6LWluZGV4OiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC5leGFtcGxlLW1hcmdpbiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwIDEycHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5sb2dpbi1idXR0b24ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi5jZW50ZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59IiwiLmJhY2tncm91bmQge1xuICBtaW4taGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoL2Fzc2V0cy9pbWFnZXMvbW91bnRhaW5zLmpwZyk7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLmJhY2tncm91bmQgLmNvbnRhaW5lciB7XG4gIGhlaWdodDogODV2aDtcbiAgY29sb3I6ICMyMTJlNWI7XG4gIHdpZHRoOiA0MiU7XG59XG4uYmFja2dyb3VuZCAuY29udGFpbmVyIC5mb3JtLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgaGVpZ2h0OiA1OSU7XG59XG4uYmFja2dyb3VuZCAuY29udGFpbmVyIC5mb3JtLWNvbnRhaW5lciAuZm9ybS13aWR0aCB7XG4gIHdpZHRoOiA1MCU7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7XG4gIGJveC1zaGFkb3c6IG5vbmU7XG4gIGNvbG9yOiAjMjEyZTViO1xufVxuLmJhY2tncm91bmQgLmNvbnRhaW5lciAuZm9ybS1jb250YWluZXIgLmZvcm0td2lkdGggLm1iLTE1cHgge1xuICBtYXJnaW4tYm90dG9tOiAtMTVweDtcbn1cbi5iYWNrZ3JvdW5kIC5jb250YWluZXIgLmZvcm0tY29udGFpbmVyIC5mb3JtLXdpZHRoIC5tLTAge1xuICBtYXJnaW4tdG9wOiAwcHg7XG4gIG1hcmdpbi1ib3R0b206IDBweDtcbn1cbi5iYWNrZ3JvdW5kIC5jb250YWluZXIgLmZvcm0tY29udGFpbmVyIC5mb3JtLXdpZHRoIC5tYXgtd2lkdGgge1xuICBtaW4td2lkdGg6IDEwMCU7XG59XG4uYmFja2dyb3VuZCAuY29udGFpbmVyIC5mb3JtLWNvbnRhaW5lciAuZm9ybS13aWR0aCAubWF4LXdpZHRoIC5pbnB1dC1lcnJvciB7XG4gIGZvbnQtc2l6ZTogeC1zbWFsbDtcbn1cbi5iYWNrZ3JvdW5kIC5jb250YWluZXIgLmZvcm0tY29udGFpbmVyIC5mb3JtLXdpZHRoIC5yaWdodCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG59XG4uYmFja2dyb3VuZCAuY29udGFpbmVyIC5mb3JtLWNvbnRhaW5lciAuZm9ybS13aWR0aCAuZm9yZ290LXBzdyB7XG4gIGZvbnQtc2l6ZTogc21hbGxlcjtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgei1pbmRleDogMTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLmJhY2tncm91bmQgLmNvbnRhaW5lciAuZm9ybS1jb250YWluZXIgLmZvcm0td2lkdGggLmV4YW1wbGUtbWFyZ2luIHtcbiAgbWFyZ2luOiAwIDEycHg7XG59XG4uYmFja2dyb3VuZCAuY29udGFpbmVyIC5mb3JtLWNvbnRhaW5lciAuZm9ybS13aWR0aCAubG9naW4tYnV0dG9uIHtcbiAgYm9yZGVyOiAxcHggc29saWQ7XG59XG5cbi5jZW50ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59Il19 */");

/***/ }),

/***/ "./src/app/components/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_authentification_authentification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/authentification/authentification.service */ "./src/app/services/authentification/authentification.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");






const httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpHeaders"]({
        "Content-Type": "application/json",
        Authorization: "my-auth-token",
    }),
};
let LoginComponent = class LoginComponent {
    constructor(formBuilder, router, authService, http) {
        this.router = router;
        this.authService = authService;
        this.http = http;
        this.loading = false;
        this.submitted = false;
        this.usernameControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]("", _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(12), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.loginForm = formBuilder.group({
            username: this.usernameControl,
        });
    }
    ngOnInit() { }
    login() {
        if (this.loginForm.valid) {
            this.authService.username = this.usernameControl.value;
            this.router.navigate(["/chat"]);
            const body = { username: this.authService.username };
            //this.http.post<any>('https://test-23sdfg23.herokuapp.com/database/insert', body, httpOptions).subscribe(() => {});
        }
    }
};
LoginComponent.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
    { type: src_app_services_authentification_authentification_service__WEBPACK_IMPORTED_MODULE_4__["AuthentificationService"] },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClient"] }
];
LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: "app-login",
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./login.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/login/login.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./login.component.scss */ "./src/app/components/login/login.component.scss")).default]
    })
], LoginComponent);



/***/ }),

/***/ "./src/app/services/authentification/authentification.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/services/authentification/authentification.service.ts ***!
  \***********************************************************************/
/*! exports provided: AuthentificationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthentificationService", function() { return AuthentificationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");



//import { Profile } from '@app/models/profile';
let AuthentificationService = class AuthentificationService {
    constructor(http) {
        this.http = http;
        this.BASE_URL = "http://localhost:3000"; //test
    }
    login(username) { }
};
AuthentificationService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
AuthentificationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: "root",
    })
], AuthentificationService);



/***/ }),

/***/ "./src/app/services/chat/chat.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/chat/chat.service.ts ***!
  \***********************************************/
/*! exports provided: ChatService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatService", function() { return ChatService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let ChatService = class ChatService {
    constructor() { }
};
ChatService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: "root",
    })
], ChatService);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\yuhan\Documents\Uni3\LOG3900-Projet evolution logiciel\log3900-107\prototypes\prototype-server\client\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map