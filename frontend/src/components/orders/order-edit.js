import {HttpUtils} from "../../utils/http-utils.js";

export class OrderEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton')
            .addEventListener('click', this.updateOrder.bind(this));

        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        this.freelancerSelectElement = document.getElementById('selectFreelancer');
        this.statusSelectElement = document.getElementById('selectStatus');
        this.descriptionInputElement = document.getElementById('inputDescription');
        this.amountInputElement = document.getElementById('inputAmount');
        // this.scheduledCardElement = document.getElementById('scheduled-card');
        // this.completeCardElement = document.getElementById('complete-card');
        // this.deadlineCardElement = document.getElementById('deadline-card');

        this.init(id).then();
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
        const result = await HttpUtils.request(`/orders/${id}`);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            // console.log(result.response);
            return alert('There was an error with the request for order. Contact support')
        }
        // console.log(result.response);
        this.orderOriginalData = result.response;
        return result.response
    };


    async getFreelancers(currentFreelancersId) {
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

        const calendarScheduled = $('#calendar-scheduled');
        const calendarDeadline = $('#calendar-deadline');
        const calendarComplete = $('#calendar-complete');

        calendarScheduled.datetimepicker({
            inline: true,
            // locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            date: order.scheduledDate,
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
            date: order.completeDate,
            buttons: {
                showClear: true,
            }
        });
        calendarComplete.on("change.datetimepicker", (e) => {

            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });
        $('#calendar-deadline').datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            date: order.deadlineDate,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date
        });
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
        return isValid;
    };

    async updateOrder(e) {
        e.preventDefault();

        if (this.validateForms()) {
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
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString(): null;
            }
            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }
            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }
            console.log(changedData);

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request(`/orders/${this.orderOriginalData.id}`, 'PUT', true, changedData);

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return alert('There was an error with the changing for order. Contact support')
                }
                return this.openNewRoute(`/orders/view?id=${this.orderOriginalData.id}`);
            }
        }
    };
}