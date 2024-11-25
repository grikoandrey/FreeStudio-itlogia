import {HttpUtils} from "../../utils/http-utils.js";
import {FileUtils} from "../../utils/file-utils.js";

export class FreelancerCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton')
            .addEventListener('click', this.saveFreelancer.bind(this));

        bsCustomFileInput.init();

        this.nameInputElement = document.getElementById('inputName');
        this.lastNameInputElement = document.getElementById('inputLastName');
        this.emailInputElement = document.getElementById('inputEmail');
        this.educationInputElement = document.getElementById('inputEducation');
        this.locationInputElement = document.getElementById('inputLocation');
        this.skillsInputElement = document.getElementById('inputSkills');
        this.infoInputElement = document.getElementById('inputInfo');
        this.levelSelectElement = document.getElementById('selectLevel');
        this.avatarInputElement = document.getElementById('inputAvatar');
    };

    validateForms() {
        let isValid = true;

        let textInputArray = [
            this.nameInputElement,
            this.lastNameInputElement,
            this.educationInputElement,
            this.locationInputElement,
            this.skillsInputElement,
            this.infoInputElement,
        ];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.emailInputElement.value && this.emailInputElement.value
            .match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    };

    async saveFreelancer(e) {
        e.preventDefault();

        if (this.validateForms()) {
            const createData = {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                level: this.levelSelectElement.value,
                education: this.educationInputElement.value,
                location: this.locationInputElement.value,
                skills: this.skillsInputElement.value,
                info: this.infoInputElement.value,
            };

            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                createData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            const result = await HttpUtils.request(`/freelancers`, 'POST', true, createData);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('There was an error with the request for freelancer. Contact support')
            }
            return this.openNewRoute(`/freelancers/view?id=${result.response.id}`);
        }
    };
}