import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {OrdersService} from "../../services/orders-service.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class OrderEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton')
            .addEventListener('click', this.updateOrder.bind(this));

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        this.findElements();

        this.validations = [
            {element: this.descriptionInputElement},
            {element: this.amountInputElement},
        ];

        this.init(id).then();
    };

    findElements() {
        this.freelancerSelectElement = document.getElementById('selectFreelancer');
        this.statusSelectElement = document.getElementById('selectStatus');
        this.descriptionInputElement = document.getElementById('inputDescription');
        this.amountInputElement = document.getElementById('inputAmount');
    };

    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        // console.log(result.response);
        this.orderOriginalData = response.order;
        return response.order
    };

    async getFreelancers(currentFreelancersId) {
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
            if (currentFreelancersId === freelancers[i].id) {
                option.selected = true;

            }
            this.freelancerSelectElement.appendChild(option);
        }
        //Initialize Select2 Elements
        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    };

    showOrder(order) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-order');
        breadcrumbsElement.href = `/orders/view?id=${order.id}`;
        breadcrumbsElement.innerText = order.number;

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }

        const calendarOptions = {
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

        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date
        });
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date
        });

        calendarComplete.datetimepicker(Object.assign({}, calendarOptions, {
            date: order.completeDate,
            buttons: {showClear: true,}
        }));
        calendarComplete.on("change.datetimepicker", (e) => {

            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });
    };

    async updateOrder(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }

            if (this.completeDate || (!this.completeDate && this.completeDate === false)) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }
            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }
            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }
            console.log(changedData);

            if (Object.keys(changedData).length > 0) {
                const response = await OrdersService.updateOrder(this.orderOriginalData.id, changedData);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                return this.openNewRoute(`/orders/view?id=${this.orderOriginalData.id}`);
            }
        }
    };
}