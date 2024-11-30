import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        // console.log('Login component rendered!');
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement, options: {pattern: /^[A-Z][a-z]*$/}},
            {element: this.lastNameElement, options: {pattern: /^[A-Z][a-z]*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/}},
            {element: this.rePasswordElement, options: {compareTo: this.passwordElement.value}},
            {element: this.agreeElement, options: {checked: true}},

        ];

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    };

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rePasswordElement = document.getElementById('rePassword');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signup() {
        this.commonErrorElement.style.display = 'none';
        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.rePasswordElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }
        if (ValidationUtils.validateForm(this.validations)) {
            //request
            const result = await HttpUtils
                .request('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            })

            if (result.error || !result.response || (result.response && (!result.response.accessToken
                || !result.response.refreshToken || !result.response.id || !result.response.name))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {id: result.response.id, name: result.response.name});
            // window.location.href = '/';
            this.openNewRoute('/');
        }
    };
}