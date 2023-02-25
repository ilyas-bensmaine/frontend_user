import axios from 'axios'

axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://admin.127.0.0.1:8000'
// axios.defaults.baseURL = 'http://127.0.0.1:8000'
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://127.0.0.1:8000'
  } else {
    axios.defaults.baseURL = 'https://safyauto.com'
  }
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})
export default axiosInstance
