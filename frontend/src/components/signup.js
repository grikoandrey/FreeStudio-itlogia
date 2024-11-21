export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        // console.log('Login component rendered!');
        if (localStorage.getItem('accessToken')) {
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rePasswordElement = document.getElementById('rePassword');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    };

    validateForms() {
        let isValid = true;

        if (this.nameElement.value && this.nameElement.value.match(/^[a-z]+\s*$/i)) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.lastNameElement.value && this.nameElement.value.match(/^[a-z]+\s*$/i)) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value
            .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.rePasswordElement.value && this.rePasswordElement.value === this.passwordElement.value) {
            this.rePasswordElement.classList.remove('is-invalid');
        } else {
            this.rePasswordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.agreeElement.checked) {
            this.agreeElement.classList.remove('is-invalid');
        } else {
            this.agreeElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    };

    async signup() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForms()) {
            //request
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                }),
            });
            const result = await response.json();

            if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({id: result.id, name: result.name}));

            this.openNewRoute('/');
        }
    };
}