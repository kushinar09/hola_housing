const LogoSite = ({ props }) => (
    <img src="./src/assets/logo/logo_nobackground.png" alt="Logo" {...props} />
);

const globalState = {
    websiteName: 'Hola Housing'
};

const API_BASE_URL = 'https://localhost:7274/api';
const BASE_URL = 'https://localhost:7274';

const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/signin`,
    SIGNUP: `${API_BASE_URL}/signup`,
    GET_USER_INFO: `${API_BASE_URL}/user/info`,
    UPDATE_USER_PROFILE: `${API_BASE_URL}/user/update`,
    LOGOUT: `${API_BASE_URL}/logout`,

    GET_AMENITIES: `${API_BASE_URL}/Amentities`,
    GET_PROPERTIES: `${API_BASE_URL}/properties/SearchAndFilter`,
    GET_PROPERTIES_BY_OWNER: `${API_BASE_URL}/Properties/GetPropertiesByPoster/`,
    GET_PROPERTIES_BY_LOCATION: `${API_BASE_URL}/Properties/SearchByLatAndLng`,
    GET_PROPERTY_DETAIL: `${API_BASE_URL}/Properties/`,

    NOTIFICATION_HUB: `${BASE_URL}/notificationHub`,
    GET_NOTIFICATIONS: `${API_BASE_URL}/Notifications`,
    MARK_NOTIFICATION_READ: `${API_BASE_URL}/Notifications/mark`,

    POST_PROPERTY: `${API_BASE_URL}/properties/create`,
    POST_PROPERTY_IMAGES: `${API_BASE_URL}/properties/Upload/Image`,

    //admin
    GET_PROPERTIES_MANAGER: `${API_BASE_URL}/properties/manage`,
    UPDATE_STATUS_PROPERTY: `${API_BASE_URL}/properties/UpdateStatus`,
    GET_REASON_DECLINE: `${API_BASE_URL}/DeclineReasons`,
    POST_REASON_DECLINE: `${API_BASE_URL}/DeclineReasons`,
};

const CONSTANTS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USERNAME: "username"
}



export {
    LogoSite,
    globalState,
    ENDPOINTS,
    CONSTANTS
}
