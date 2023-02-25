import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
// import { getUserLanguage } from '../../configs/i18n'


const useAxiosApi = () => {
    axios.defaults.withCredentials = true
    // axios.defaults.params = { 
    //     language: getUserLanguage()
    // }
    // axios.defaults.baseURL = 'http://admin.127.0.0.1:8000'
    // axios.defaults.baseURL = 'http://127.0.0.1:8000'
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        axios.defaults.baseURL = 'http://127.0.0.1:8000'
      } else {
        axios.defaults.baseURL = 'https://safyauto.com'
      }
    const axiosInstance = axios.create({
        headers: {
            'Content-Type': 'application/json'
        }
    })

    axiosInstance.interceptors.response.use((response) => response, (error) => {
        switch (error.response?.status) {
            case 400:
                toast.error('Error 400: "Bad Request" The request was invalid.')
                break
            case 401:
                toast.error('Error 401: "Unauthorized" Invalid login credentials.')
                break
            case 403:
                toast.error('Error 403: "Forbidden" You do not have enough permissions to perform this action.')
                break
            case 404:
                toast.error('Error 404: "Not Found" The requested resource/page not found.')
                break
            case 405:
                toast.error('Error 405: "Method Not Allowed" This request is not supported by the resource.')
                break
            case 409:
                toast.error('Error 409: "Conflict" The request could not be completed due to a conflict.')
                break
            case 429:
                toast.error('Error 429: "Too Many Attempts.')
                break
            case 500:
                toast.error('Error 500: "Internal Server Error" The request was not completed due to an internal error on the server side.')
                break
            case 503:
                toast.error('Error 503: "Service Unavailable" The server was unavailable.')
                break
            default:
                break
        }
        throw error
    })
    
  return axiosInstance
}

export default useAxiosApi
