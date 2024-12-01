import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FileUtils} from "../../utils/file-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancerEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton')
            .addEventListener('click', this.updateFreelancer.bind(this));

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

        this.getFreelancer(id).then();
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

    async getFreelancer(id) {
        const response = await FreelancersService.getFreelancer(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.freelancerOriginalData = response.freelancer;
        this.showFreelancer(response.freelancer);
    };

    showFreelancer(freelancer) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-freelancer');
        breadcrumbsElement.href = `/freelancers/view?id=${freelancer.id}`;
        breadcrumbsElement.innerText = `${freelancer.name} ${freelancer.lastName}`;

        if (freelancer.avatar) {
            document.getElementById('avatar').src = `${config.host}${freelancer.avatar}`;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameInputElement.value = freelancer.name;
        this.lastNameInputElement.value = freelancer.lastName;
        this.emailInputElement.value = freelancer.email;
        this.educationInputElement.value = freelancer.education;
        this.locationInputElement.value = freelancer.location;
        this.skillsInputElement.value = freelancer.skills;
        this.infoInputElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
            }
        }
    };

    async updateFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};
            if (this.nameInputElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameInputElement.value;
            }
            if (this.lastNameInputElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.lastNameInputElement.value;
            }
            if (this.emailInputElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailInputElement.value;
            }
            if (this.educationInputElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationInputElement.value;
            }
            if (this.locationInputElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationInputElement.value;
            }
            if (this.skillsInputElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillsInputElement.value;
            }
            if (this.infoInputElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoInputElement.value;
            }
            if (this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelSelectElement.value;
            }
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            if (Object.keys(changedData).length > 0) {
                const response = await FreelancersService.updateFreelancer(this.freelancerOriginalData.id, changedData);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                return this.openNewRoute(`/freelancers/view?id=${this.freelancerOriginalData.id}`);
            }
        }
    };
}