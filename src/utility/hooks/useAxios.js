import axios from "axios"
import { useState, useEffect } from "react"

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://127.0.0.1:8000'

const useAxios = ({ url, method, body = null, headers = null }) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState('')
    const [loading, setloading] = useState(true)

    const fetchData = () => {
        axios[method](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                setResponse(res.data)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setloading(false)
            })
    }
    useEffect(() => {
        fetchData()
    }, [method, url, body, headers])
    return { response, error, loading }
}

export default useAxios
