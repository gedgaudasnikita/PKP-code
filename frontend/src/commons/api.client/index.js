import mockedBackend from './mock.api.client';
import realClient from './real.api.client';

let apiClient;

if (localStorage.getItem('useRealBackend')) {
    apiClient = realClient;
} else {
    apiClient = mockedBackend;
}

export default apiClient;
