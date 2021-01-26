"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
exports.__esModule = true;
exports.SignupComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var mustMatch_1 = require("src/app/authentication/mustMatch");
var forms_2 = require("@angular/forms");
var Config = require("config.json");
var SignupComponent = /** @class */ (function () {
    function SignupComponent(http, formBuilder, router, snackBar) {
        this.http = http;
        this.formBuilder = formBuilder;
        this.router = router;
        this.snackBar = snackBar;
        this.myRecaptcha = new forms_2.FormControl(false);
        this.chide = true;
        this.hide = true;
        this.errorMsg = '';
        this.baseApi = Config.api.baseApi;
        this.referralFullName = '';
        this.form = this.formBuilder.group({
            firstName: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', forms_1.Validators.required],
            confirmPassword: ['', forms_1.Validators.required]
        }, {
            validator: mustMatch_1.MustMatch('password', 'confirmPassword')
        });
    }
    SignupComponent.prototype.onScriptLoad = function () {
        console.log('Google reCAPTCHA loaded and is ready for use!');
    };
    SignupComponent.prototype.onScriptError = function () {
        console.log('Something went long when loading the Google reCAPTCHA');
    };
    Object.defineProperty(SignupComponent.prototype, "formCtrl", {
        get: function () {
            return this.form.controls;
        },
        enumerable: false,
        configurable: true
    });
    SignupComponent.prototype.ngOnInit = function () {
        console.log(localStorage.getItem('ref:username'));
        this.getReferralName();
    };
    SignupComponent.prototype.getReferralName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var referralId, apiUrl;
            var _this = this;
            return __generator(this, function (_a) {
                referralId = localStorage.getItem('ref:username');
                if (referralId) {
                    apiUrl = this.baseApi + '/users/getbyref/' + referralId;
                    this.http.get(apiUrl).subscribe(function (response) {
                        _this.referralFullName = response.fullName;
                    }, function (error) {
                        console.log(error);
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    SignupComponent.prototype.submitForm = function () {
        var _this = this;
        console.log("recaptcha", this.myRecaptcha.status);
        // if (this.form.valid && this.myRecaptcha.status == "VALID") {
        if (this.form.valid) {
            var reqData_1 = {
                firstName: this.form.get('firstName').value,
                lastName: this.form.get('lastName').value,
                username: this.form.get('email').value,
                password: this.form.get('password').value
            };
            this.http.post(this.baseApi + '/users/register', reqData_1).subscribe(function (response) {
                console.log(response);
                if (response.message === 'Registration successful') {
                    if (localStorage.getItem('ref:username')) {
                        var refUsername = localStorage.getItem('ref:username');
                        var apiUrl = _this.baseApi + '/users/set-referrer';
                        var username = reqData_1.username;
                        _this.http.post(apiUrl, { username: username, refUsername: refUsername }).subscribe(function (response) {
                            console.log(response);
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    _this.snackBar.open('succesfully registered!', '', {
                        duration: 2000,
                        verticalPosition: 'bottom',
                        horizontalPosition: 'center',
                        panelClass: 'snackbar-success'
                    });
                    if (localStorage.getItem('ref:username')) {
                        localStorage.removeItem('ref:username');
                    }
                    _this.router.navigate(['authentication/signin']);
                }
                ;
            }, function (error) {
                console.log(error);
                _this.errorMsg = error.error['message'];
            });
        }
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.scss']
        })
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
