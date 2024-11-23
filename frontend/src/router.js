import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/auth/login.js";
import {Signup} from "./components/auth/signup.js";
import {Logout} from "./components/auth/logout.js";
import {FreelancersList} from "./components/freelancers/freelancers-list.js";
import {FileUtils} from "./utils/file-utils.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title-page');
        this.contentPageElement = document.getElementById('content');
        this.adminStyleElement = document.getElementById('adminlte_style');
        // this.adminScriptElement = document.getElementById('adminlte_script');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Dashboard',
                filePAthTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Page Not Found',
                filePAthTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Authorisation',
                filePAthTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/signup',
                title: 'Registration',
                filePAthTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new Signup(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/logout',
                load: () => {
                new Logout(this.openNewRoute.bind(this));
        }
            },
            {
                route: '/freelancers',
                title: 'Freelancers',
                filePAthTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js'],
            },
        ];
    };

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        // window.addEventListener('hashchange', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {

        let element = null;
        if(e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if(currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if(currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }
            if (oldRoute.unload && typeof oldRoute.unload === 'function') {
                oldRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if(newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle(`/css/${style}`, this.adminStyleElement);
                });
            }
            if(newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript(`/js/${script}`);
                }
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = `${newRoute.title} | FL Studio`;
            }
            if (newRoute.filePAthTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout)
                        .then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePAthTemplate)
                    .then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            alert('No route found.');
            history.pushState(null, '', '/404');
            await this.activateRoute();
        }
    };
}