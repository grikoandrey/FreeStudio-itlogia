import {HttpUtils} from "../../utils/http-utils.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class OrdersList {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;
        this.getOrders().then();
    };

    async getOrders() {
        const result = await HttpUtils.request('/orders');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response &&
            (result.response.error || !result.response.orders))) {
            return alert('There was an error with the request for orders. Contact support')
        }
        this.showRecords(result.response.orders);
    };

    showRecords(orders) {
        // console.log(freelancers);
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < orders.length; i++) {
            const statusInfo = CommonUtils.getStatusInfo(orders[i].status);

            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = orders[i].number;
            trElement.insertCell().innerText = `${orders[i].owner.name} ${orders[i].owner.lastName}`;
            trElement.insertCell().innerHTML = `<a href="/freelancers/view?id=${orders[i].freelancer.id}"> ${orders[i].freelancer.name} ${orders[i].freelancer.lastName}</a>`;
            trElement.insertCell().innerText = (new Date(orders[i].scheduledDate))
                .toLocaleString('ru-RU');
            trElement.insertCell().innerText = (new Date(orders[i].deadlineDate))
                .toLocaleString('ru-RU');
            trElement.insertCell().innerHTML = `<span class="badge badge-${statusInfo.color}">${statusInfo.name}</span>`;

            trElement.insertCell().innerText = orders[i].completeDate ? (new Date(orders[i].completeDate))
                .toLocaleString('ru-RU') : '';
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColum('orders', orders[i].id);

            recordsElement.appendChild(trElement);
        }

        new DataTable('#data-table', {
            // language: {
            //     "lengthMenu": "Показывать _MENU_ записей на странице",
            //     "search": "Фильтр:",
            //     "info":           "Страница _PAGE_ из _PAGES_",
            //     "paginate": {
            //         "next": "Вперед",
            //         "previous": "Назад"
            //     },
            // },
        });
    };
}