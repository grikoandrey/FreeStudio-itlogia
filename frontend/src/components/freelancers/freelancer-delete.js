import {HttpUtils} from "../../utils/http-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";

export class FreelancerDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    };

    async deleteFreelancer(id) {
        const result = await HttpUtils.request(`/freelancers/${id}`, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('There was an error with the deleting freelancer. Contact support')
        }
        return this.openNewRoute(`/freelancers`);
    }
}