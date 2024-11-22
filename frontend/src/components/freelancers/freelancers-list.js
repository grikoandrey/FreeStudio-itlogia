import {HttpUtils} from "../../utils/http-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        console.log('FreelancersList');
        this.openNewRoute = openNewRoute;
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
        this.showListFreelancers(result.response.freelancers);
    };

    showListFreelancers(freelancers) {
        console.log(freelancers);
    }
}