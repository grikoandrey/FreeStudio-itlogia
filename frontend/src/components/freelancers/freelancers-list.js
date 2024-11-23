import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config.js";

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
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = freelancers[i].avatar ? `<img class="freelancers-avatar" src=${config.host}${freelancers[i].avatar} alt="User image">` : '';
            trElement.insertCell().innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            trElement.insertCell().innerText = freelancers[i].email;

            let levelHtml = null;
            switch (freelancers[i].level) {
                case config.freelancerLevels.junior:
                    levelHtml = '<span class="badge badge-info">Junior</span>';
                    break;
                case config.freelancerLevels.middle:
                    levelHtml = '<span class="badge badge-warning">Middle</span>';
                    break;
                case config.freelancerLevels.senior:
                    levelHtml = '<span class="badge badge-success">Senior</span>';
                    break;
                default:
                    levelHtml = '<span class="badge badge-secondary">Unknown</span>';
            }
            trElement.insertCell().innerHTML = levelHtml;
            trElement.insertCell().innerText = freelancers[i].education;
            trElement.insertCell().innerText = freelancers[i].location;
            trElement.insertCell().innerText = freelancers[i].skills;
            trElement.insertCell().innerHTML = `<div class="freelancers-tools">
                    <a href="/api/freelancers/view?=${freelancers[i].id}" class="fas fa-eye"></a>
                    <a href="/api/freelancers/edit?=${freelancers[i].id}" class="fas fa-edit"></a>
                    <a href="/api/freelancers/delete?=${freelancers[i].id}" class="fas fa-trash"></a>
                    </div>`;

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

        // $('#example2').DataTable({
        //     "paging": true,
        //     "lengthChange": false,
        //     "searching": false,
        //     "ordering": true,
        //     "info": true,
        //     "autoWidth": false,
        //     "responsive": true,
        // });
    };
}