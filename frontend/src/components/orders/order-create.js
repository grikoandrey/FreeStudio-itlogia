import {HttpUtils} from "../../utils/http-utils.js";

export class OrderCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton')
            .addEventListener('click', this.saveOrder.bind(this));

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        const calendarScheduled = $('#calendar-scheduled');
        const calendarDeadline = $('#calendar-deadline');
        const calendarComplete = $('#calendar-complete');

        // The Calendar
        calendarScheduled.datetimepicker({
            // format: 'L',
            inline: true,
            // locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date
        });
        $('#calendar-complete').datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            buttons: {
                showClear: true,
            }
        });
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date
        });
        $('#calendar-deadline').datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date
        });

        this.freelancerSelectElement = document.getElementById('selectFreelancer');
        this.statusSelectElement = document.getElementById('selectStatus');
        this.descriptionInputElement = document.getElementById('inputDescription');
        this.amountInputElement = document.getElementById('inputAmount');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        // this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.getFreelancers().then();
    };

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response &&
            (result.response.error || !result.response.freelancers))) {
            return alert('There was an error with the request for freelancers. Contact support')
        }
        const freelancers = result.response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = freelancers[i].id;
            option.innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            this.freelancerSelectElement.appendChild(option);
        }
        //Initialize Select2 Elements
        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    };

    validateForms() {
        let isValid = true;

        let textInputArray = [
            this.descriptionInputElement,
            this.amountInputElement,
        ];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.scheduledDate) {
            this.scheduledCardElement.classList.remove('is-invalid');
        } else {
            this.scheduledCardElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.deadlineDate) {
            this.deadlineCardElement.classList.remove('is-invalid');
        } else {
            this.deadlineCardElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    };

    async saveOrder(e) {
        e.preventDefault();
            if (this.validateForms()) {
                const createData = {
                    description: this.descriptionInputElement.value,
                    deadlineDate: this.deadlineDate.toISOString(),
                    scheduledDate: this.scheduledDate.toISOString(),
                    freelancer: this.freelancerSelectElement.value,
                    status: this.statusSelectElement.value,
                    amount: parseInt(this.amountInputElement.value),
                };

                if (this.completeDate) {
                    createData.completeDate = this.completeDate.toISOString();
                }

                const result = await HttpUtils.request(`/orders`, 'POST', true, createData);

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return alert('There was an error with the request for order. Contact support')
                }
                return this.openNewRoute(`/orders/view?id=${result.response.id}`);
            }

    };
}