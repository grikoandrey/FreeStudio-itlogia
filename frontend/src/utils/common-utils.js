import config from "../config/config.js";

export class CommonUtils {
    static getLevelHtml(level) {
        let levelHtml;
        switch (level) {
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
        return levelHtml;
    };

    static getStatusInfo(status) {
        let statusHtml;
        switch (status) {
            case config.orderStatuses.new:
                statusHtml = '<span class="badge badge-secondary">New</span>';
                break;
            case config.orderStatuses.confirmed:
                statusHtml = '<span class="badge badge-warning">Confirmed</span>';
                break;
            case config.orderStatuses.success:
                statusHtml = '<span class="badge badge-success">Completed</span>';
                break;
            case config.orderStatuses.canceled:
                statusHtml = '<span class="badge badge-danger">Canceled</span>';
                break;
            default:
                statusHtml = '<span class="badge badge-secondary">Unknown</span>';
        }
        return statusHtml;
}
}