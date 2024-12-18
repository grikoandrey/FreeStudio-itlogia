import {FileUtils} from "../../utils/file-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancerCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton')
            .addEventListener('click', this.saveFreelancer.bind(this));

        bsCustomFileInput.init();

        this.findElements();

        this.validations = [
            {element: this.nameInputElement},
            {element: this.lastNameInputElement},
            {element: this.educationInputElement},
            {element: this.locationInputElement},
            {element: this.skillsInputElement},
            {element: this.infoInputElement},
            {
                element: this.emailInputElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
            },
        ];
    };

    findElements() {
        this.nameInputElement = document.getElementById('inputName');
        this.lastNameInputElement = document.getElementById('inputLastName');
        this.emailInputElement = document.getElementById('inputEmail');
        this.educationInputElement = document.getElementById('inputEducation');
        this.locationInputElement = document.getElementById('inputLocation');
        this.skillsInputElement = document.getElementById('inputSkills');
        this.infoInputElement = document.getElementById('inputInfo');
        this.levelSelectElement = document.getElementById('selectLevel');
        this.avatarInputElement = document.getElementById('inputAvatar');
    }

    async saveFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
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
            const response = await FreelancersService.createFreelancer(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/freelancers/view?id=${response.id}`);
        }
    };
}