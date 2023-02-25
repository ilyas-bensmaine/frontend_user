import { useSelector } from "react-redux"

const useUserData = () => {
    const userData = useSelector(state => state.authentication?.userData)
    // console.log(userData)
    return userData
}

export default useUserData
