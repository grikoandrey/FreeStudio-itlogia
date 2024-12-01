import {HttpUtils} from "../utils/http-utils.js";

export class OrdersService {
    static async getAllOrders() {
        const returnObject = {
            error: false,
            redirect: null,
            freelancers: null
        };

        const result = await HttpUtils.request('/orders');

        if (result.redirect || result.error || !result.response || (result.response &&
            (result.response.error || !result.response.orders))) {
            returnObject.error = 'There was an error with the request for orders. Contact support';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.orders = result.response.orders;
        return returnObject;
    };

    static async getOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
            order: null
        };

        const result = await HttpUtils.request(`/orders/${id}`);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'There was an error with the request for orders. Contact support';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.order = result.response;
        return returnObject;
    };

    static async createOrder(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request(`/orders`, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'There was an error with the adding order. Contact support';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    };

    static async updateOrder(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/orders/${id}`, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'There was an error with the edit order. Contact support';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };

    static async deleteOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/orders/${id}`, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'There was an error with the deleting order. Contact support';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };
}