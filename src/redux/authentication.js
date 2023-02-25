// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import useAxiosApi from '../axios/apis/useAxiosApi'

// ** Hook 
const axiosInstance = useAxiosApi()
// ** AsyncThunk
export const updateUserData = createAsyncThunk('authentication/updateUserData', async ({ dataToUpdate }) => {
  try {
    const response = await axiosInstance.post(`/api/users`, { ...dataToUpdate, _method: 'patch' })
    return response.data
  } catch (error) {
    throw (error)
  } 
})

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: null
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      // localStorage.setItem('userData', JSON.stringify(action.payload))
    },
    handleLogout: state => {
      state.userData = null
      // localStorage.removeItem('userData')
    },
    handleFirstLogin: (state, action) => {
      state.userData = {...state.userData, ...action.payload}
      // localStorage.setItem('userData', JSON.stringify(state.userData))
    },
    handleRegistration: (state, action) => {
      state.userData = action.payload
      // localStorage.setItem('userData', JSON.stringify(action.payload))
    }
  },
  extraReducers: builder => {
    builder
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.userData = action.payload
        // localStorage.setItem('userData', JSON.stringify(state.userData))
      })
  }
})

export const { handleLogin, 
  handleLogout, 
  handleFirstLogin, 
  handleRegistration } = authSlice.actions

export default authSlice.reducer
