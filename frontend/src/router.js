import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/auth/login.js";
import {Signup} from "./components/auth/signup.js";
import {Logout} from "./components/auth/logout.js";
import {FreelancersList} from "./components/freelancers/freelancers-list.js";
import {FileUtils} from "./utils/file-utils.js";
import {FreelancerView} from "./components/freelancers/freelancer-view.js";
import {FreelancerCreate} from "./components/freelancers/freelancer-create.js";
import {FreelancerEdit} from "./components/freelancers/freelancer-edit.js";
import {FreelancerDelete} from "./components/freelancers/freelancer-delete.js";
import {OrdersList} from "./components/orders/orders-list.js";
import {OrderView} from "./components/orders/order-view.js";
import {OrderCreate} from "./components/orders/order-create.js";
import {OrderEdit} from "./components/orders/order-edit.js";
import {OrderDelete} from "./components/orders/order-delete.js";

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
                    new Dashboard(this.openNewRoute.bind(this));
                },
                styles: ['fullcalendar.css'],
                scripts: [
                    'moment.min.js',
                    // 'moment-ru-locale.js',
                    'fullcalendar.js',
                    'fullcalendar-locale-ru.js',
                ],
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
            {
                route: '/freelancers/view',
                title: 'Freelancer',
                filePAthTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancerView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers/create',
                title: 'Create freelancer',
                filePAthTemplate: '/templates/pages/freelancers/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancerCreate(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js'],
            },
            {
                route: '/freelancers/edit',
                title: 'Edit freelancer',
                filePAthTemplate: '/templates/pages/freelancers/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancerEdit(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js'],
            },
            {
                route: '/freelancers/delete',
                load: () => {
                    new FreelancerDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders',
                title: 'Orders',
                filePAthTemplate: '/templates/pages/orders/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js'],
            },
            {
                route: '/orders/view',
                title: 'Order',
                filePAthTemplate: '/templates/pages/orders/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrderView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders/create',
                title: 'Create order',
                filePAthTemplate: '/templates/pages/orders/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrderCreate(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css',
                ],
                scripts: [
                    'moment.min.js',
                    // 'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js',
                ],
            },
            {
                route: '/orders/edit',
                title: 'Edit order',
                filePAthTemplate: '/templates/pages/orders/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrderEdit(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css',
                ],
                scripts: [
                    'moment.min.js',
                    // 'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js',
                ],
            },
            {
                route: '/orders/delete',
                load: () => {
                    new OrderDelete(this.openNewRoute.bind(this));
                },
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
        if (e.target.nodeName === 'A') {
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
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
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
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle(`/css/${style}`, this.adminStyleElement);
                });
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
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
                    this.activateMenuItem(newRoute);
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
            await this.activateRoute;
        }
    };
    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })
    }
}