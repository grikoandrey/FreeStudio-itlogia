import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        // console.log('Login component rendered!');
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {
                element: this.emailElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
            },
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    };

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {
            //request

            const result = await HttpUtils
                .request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked,
                })

            if (result.error || !result.response || (result.response && (!result.response.accessToken
                || !result.response.refreshToken || !result.response.id || !result.response.name))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {
                id: result.response.id,
                name: result.response.name
            });
            // window.location.href = '/';
            this.openNewRoute('/');
        }
    };
}