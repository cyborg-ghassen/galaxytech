import { api } from '../../../utils/api';
import axios from 'axios';
let cancelTokenSource = null;

export const getMarketplaces = async query => {
    if (cancelTokenSource) {
        cancelTokenSource.cancel('New request triggered');
    }

    // Create a new cancel token source
    cancelTokenSource = axios.CancelToken.source();
    return (
        await api.get(`/marketplace/?${query.toString()}`, {
            cancelToken: cancelTokenSource.token
        })
    ).data;
};
