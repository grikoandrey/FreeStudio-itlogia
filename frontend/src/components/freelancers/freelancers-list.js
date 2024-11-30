import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class FreelancersList {
    constructor(openNewRoute) {

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
        // console.log(freelancers);
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = freelancers[i].avatar ? `<img class="freelancers-avatar" src=${config.host}${freelancers[i].avatar} alt="User image">` : '';
            trElement.insertCell().innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            trElement.insertCell().innerText = freelancers[i].email;
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[i].level);
            trElement.insertCell().innerText = freelancers[i].education;
            trElement.insertCell().innerText = freelancers[i].location;
            trElement.insertCell().innerText = freelancers[i].skills;
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColum('freelancers', freelancers[i].id);

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