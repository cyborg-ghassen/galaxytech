import { api } from '../../../utils/api';
import axios from 'axios';
let cancelTokenSource = null;

export const getGroups = async query => {
    if (cancelTokenSource) {
        cancelTokenSource.cancel('New request triggered');
    }

    // Create a new cancel token source
    cancelTokenSource = axios.CancelToken.source();
    return (
        await api.get(`/account/group/?${query.toString()}`, {
            cancelToken: cancelTokenSource.token
        })
    ).data;
};

export const getPermissions = async query => {
    cancelTokenSource = axios.CancelToken.source();
    return (await api.get(`/account/permission/?${query.toString()}`)).data;
};
