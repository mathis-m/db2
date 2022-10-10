export const getBaseUrl = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '/api';
        case 'development':
        default:
            return '/api';
            // return 'http://localhost:5217';
    }
}