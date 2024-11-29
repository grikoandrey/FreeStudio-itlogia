import {HttpUtils} from "../utils/http-utils.js";
import config from "../config/config.js";

export class Dashboard {
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
        this.loadOrdersInfo(result.response.orders);
        this.loadCalendarInfo(result.response.orders);
    };

    loadOrdersInfo(orders) {
        document.getElementById('count-orders').innerText = orders.length;
        document.getElementById('done-orders').innerText = orders
            .filter(order => order.status === config.orderStatuses.success).length;
        document.getElementById('inProgress-orders').innerText = orders
            .filter(order => order.status === config.orderStatuses.confirmed || order.status === config.orderStatuses.new).length;
        document.getElementById('canceled-orders').innerText = orders
            .filter(order => order.status === config.orderStatuses.canceled).length;
    };

    loadCalendarInfo(orders) {
        const preparedEvents = [];

        for (let i = 0; i < orders.length; i++) {
            let color = null;
            if (orders[i].status === config.orderStatuses.success) {
                color = 'gray';
            }

            if (orders[i].scheduledDate) {
                const scheduledDate = new Date(orders[i].scheduledDate);
                preparedEvents.push({
                    title          : `${orders[i].freelancer.name} ${orders[i].freelancer.lastName} makes order ${orders[i].number}`,
                    start          : scheduledDate,
                    backgroundColor: '#00c0ef', //Info (aqua)
                    borderColor    : '#00c0ef', //Info (aqua)
                    allDay         : true
                });
            }
            if (orders[i].deadlineDate) {
                const deadlineDate = new Date(orders[i].deadlineDate);
                preparedEvents.push({
                    title          : `Order deadline ${orders[i].number}`,
                    start          : deadlineDate,
                    backgroundColor: color ? color : '#f39c12', //yellow
                    borderColor    : color ? color : '#f39c12', //yellow
                    allDay         : true
                });
            }
            if (orders[i].completeDate) {
                const completeDate = new Date(orders[i].completeDate);
                preparedEvents.push({
                    title          : `Order ${orders[i].number} was completed by freelancer ${orders[i].freelancer.name} ${orders[i].freelancer.lastName}`,
                    start          : completeDate,
                    backgroundColor: '#00a65a', //Success (green)
                    borderColor    : '#00a65a', //Success (green)
                    allDay         : true
                });
            }
            if (orders[i].status && orders[i].status === 'canceled') {
                const scheduledDate = new Date(orders[i].scheduledDate);
                preparedEvents.push({
                    title          : `Order ${orders[i].number} was canceled`,
                    start          : scheduledDate,
                    backgroundColor: color ? color : '#f56954', //red
                    borderColor    : color ? color : '#f56954', //red
                    allDay         : true
                });
            }
        }

        // const date = new Date()
        // const d    = date.getDate(),
        //     m    = date.getMonth(),
        //     y    = date.getFullYear()

        const calendarElement = document.getElementById('calendar');

        const calendar = new FullCalendar.Calendar(calendarElement, {
            headerToolbar: {
                left  : 'prev,next today',
                center: 'title',
                right : ''
            },
            themeSystem: 'bootstrap',
            firstDay: 1,
            // locale: 'ru',
            //Random default events
            events: preparedEvents,
            //     [
            //     {
            //         title          : 'All Day Event',
            //         start          : new Date(y, m, 1),
            //         backgroundColor: '#f56954', //red
            //         borderColor    : '#f56954', //red
            //         allDay         : true
            //     },
            // ],
        });
        calendar.render();
    }
}