import config from "../config/config.js";
import {OrdersService} from "../services/orders-service.js";

export class Dashboard {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;
        this.getOrders().then();
    };

    async getOrders() {
        const response = await OrdersService.getAllOrders();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.loadOrdersInfo(response.orders);
        this.loadCalendarInfo(response.orders);
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
                preparedEvents.push({
                    title          : `${orders[i].freelancer.name} ${orders[i].freelancer.lastName} makes order ${orders[i].number}`,
                    start          : new Date(orders[i].scheduledDate),
                    backgroundColor: '#00c0ef', //Info (aqua)
                    borderColor    : '#00c0ef', //Info (aqua)
                    allDay         : true
                });
            }
            if (orders[i].deadlineDate) {

                preparedEvents.push({
                    title          : `Order deadline ${orders[i].number}`,
                    start          : new Date(orders[i].deadlineDate),
                    backgroundColor: color ? color : '#f39c12', //yellow
                    borderColor    : color ? color : '#f39c12', //yellow
                    allDay         : true
                });
            }
            if (orders[i].completeDate) {
                preparedEvents.push({
                    title          : `Order ${orders[i].number} was completed by freelancer ${orders[i].freelancer.name} ${orders[i].freelancer.lastName}`,
                    start          : new Date(orders[i].completeDate),
                    backgroundColor: '#00a65a', //Success (green)
                    borderColor    : '#00a65a', //Success (green)
                    allDay         : true
                });
            }
            if (orders[i].status && orders[i].status === 'canceled') {
                preparedEvents.push({
                    title          : `Order ${orders[i].number} was canceled`,
                    start          : new Date(orders[i].scheduledDate),
                    backgroundColor: '#f56954', //red
                    borderColor    : '#f56954', //red
                    allDay         : true
                });
            }
        }

        // const date = new Date()
        // const d    = date.getDate(),
        //     m    = date.getMonth(),
        //     y    = date.getFullYear()

        const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
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