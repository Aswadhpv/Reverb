import axios from 'axios';
const API = axios.create({ baseURL:'http://localhost:5000/api' });
API.interceptors.request.use(cfg => {
    const t = localStorage.getItem('token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});
export default API;
export const listPlugins   = () => API.get('/collaboration/plugins');
export const processAudio  = (audio,plugin) =>
    API.post('/collaboration/process',{ audio, plugin },{ responseType:'arraybuffer' });
