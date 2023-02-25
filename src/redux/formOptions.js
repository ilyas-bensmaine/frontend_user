// ** Redux Imports
/*eslint-disable*/
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
//** axios
import axios from 'axios'
import useAxiosApi from '../axios/apis/useAxiosApi'
import { getUserLanguage } from '../configs/i18n'

// ** Hook 
const axiosInstance = useAxiosApi()
const endpoints = [
  '/api/user_professions',
  '/api/wilayas',
  '/api/car_types',
  '/api/part_categories',
  '/api/car_brands'
]

export const loadFormOptions = createAsyncThunk('formOptions/loadFormOptions', async (_, {dispatch}) => {
  console.log('loadFormOptions')
  dispatch(handleFormOptionsLoading(true))
  try {
    const [
      user_professions,
      wilayas,
      car_types,
      part_categories,
      car_brands
    ] = await axios.all(endpoints.map((endpoint) => axiosInstance.get(endpoint)))
    const payload = {
      user_professions: user_professions.data.map((item) => {
        item.value = item.id
        item.label = getUserLanguage() === 'fr' ? item.name : item.arabic_name
        item.description = getUserLanguage() === 'fr' ? item.name : item.arabic_description
        return item
      }),
      wilayas: wilayas.data.map((item) => {
        item.value = item.id
        item.label = getUserLanguage() === 'fr' ? item.name : item.arabic_name
        return item
      }),
      car_types: car_types.data.map((item) => {
        item.value = item.id
        item.label = getUserLanguage() === 'fr' ? item.name : item.arabic_name
        item.description = getUserLanguage() === 'fr' ? item.name : item.arabic_description
        return item
      }),
      part_categories: part_categories.data.map((item) => {
        item.value = item.id
        item.label = getUserLanguage() === 'fr' ? item.name : item.arabic_name
        item.description = getUserLanguage() === 'fr' ? item.name : item.arabic_description
        return item
      }),
      car_brands: car_brands.data.map((item) => {
        item.value = item.id
        item.label = getUserLanguage() === 'fr' ? item.name : item.arabic_name
        item.description = getUserLanguage() === 'fr' ? item.name : item.arabic_description
        return item
      })
    }
    dispatch(handleFormOptionsLoading(false))
    return payload
  } catch (error) {
    throw error
  }
})

export const formOptionsSlice = createSlice({
  name: 'formOptions',
  initialState: {
    isLoading: true,
    user_professions: [],
    wilayas: [],
    car_types: [],
    part_categories: [],
    car_brands: []
  },
  reducers: {
    handleFormOptionsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    handleFormOptionsPurge: (state, action) => {
      state.isLoading = true,
      state.user_professions = [],
      state.wilayas = [],
      state.car_types = [],
      state.part_categories = [],
      state.car_brands = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadFormOptions.fulfilled, (state, action) => {
        state.user_professions = action.payload.user_professions
        state.wilayas = action.payload.wilayas
        state.car_types = action.payload.car_types
        state.part_categories = action.payload.part_categories
        state.car_brands = action.payload.car_brands
      })
  }
})

export const { handleFormOptionsLoading, handleFormOptionsPurge } = formOptionsSlice.actions
export default formOptionsSlice.reducer
