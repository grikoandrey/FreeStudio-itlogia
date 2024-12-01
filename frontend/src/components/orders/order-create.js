import {ValidationUtils} from "../../utils/validation-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";
import {OrdersService} from "../../services/orders-service.js";

export class OrderCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton')
            .addEventListener('click', this.saveOrder.bind(this));

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        const calendarOptions = {
            // format: 'L',
            inline: true,
            // locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        };

        const calendarScheduled = $('#calendar-scheduled');
        const calendarDeadline = $('#calendar-deadline');
        const calendarComplete = $('#calendar-complete');

        // The Calendar
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date
        });

        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date
        });

        calendarOptions.buttons = {
            showClear: true,
        }
        calendarComplete.datetimepicker(calendarOptions);
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date
        });

        this.findElements();

        this.validations = [
            {element: this.descriptionInputElement},
            {element: this.amountInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}},
        ];

        this.getFreelancers().then();
    };

    findElements() {
        this.freelancerSelectElement = document.getElementById('selectFreelancer');
        this.statusSelectElement = document.getElementById('selectStatus');
        this.descriptionInputElement = document.getElementById('inputDescription');
        this.amountInputElement = document.getElementById('inputAmount');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    };

    async getFreelancers() {
        const response = await FreelancersService.getAllFreelancers();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        const freelancers = response.freelancers;

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

    async saveOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
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

            const response = await OrdersService.createOrder(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/orders/view?id=${response.id}`);
        }

    };
}