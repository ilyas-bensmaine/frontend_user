// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import useAxiosApi from '../../../axios/apis/useAxiosApi'

// ** Hook 
const axiosInstance = useAxiosApi()
// ** QuerySerializer
const qs = require('qs')

/*eslint-disable*/
export const getPosts = createAsyncThunk('appEcommerce/getPosts', async (parameters) => {
  const {headerParams, sidebarParams} = parameters
  console.log(headerParams.page)
  try {
    const response = await axiosInstance.get(`/api/posts?page=${1}&perPage=${headerParams.perPage}&all_posts=${headerParams.all_posts}&sort=${headerParams.sort}`, {
      params: {
        ...sidebarParams,
      },
      paramsSerializer: (params) => {
        return qs.stringify( {filter: {...params}} , { encode: false})
      }
    })
    return {
      posts: response.data.data,
      totalPosts: response.data.total,
      next_page_url: response.data.next_page_url
    }
  } catch (error) {
    console.log(error)
  }
})
export const getMorePosts = createAsyncThunk('appEcommerce/getMorePosts', async (parameters) => {
  const {headerParams, sidebarParams} = parameters
  try {
    const response = await axiosInstance.get(`/api/posts?page=${headerParams.page}&perPage=${headerParams.perPage}&all_posts=${headerParams.all_posts}&sort=${headerParams.sort}`, {
      params: {
        ...sidebarParams,
      },
      paramsSerializer: (params) => {
        return qs.stringify( {filter: {...params}} , { encode: false})
      }
    })
    return {
      posts: response.data.data,
      next_page_url: response.data.next_page_url
    }
  } catch (error) {
    console.log(error)
  }
})

export const getSelectedPost = createAsyncThunk('appEcommerce/getSelectedPost', async (id) => {
  try {
    const response = await axiosInstance.get(`/api/posts/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
})

export const handleSavingPost = createAsyncThunk('appEcommerce/handleSavingPost', async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}/mark_as_saved`)
  return {
    post_id: id,
    number_of_saves: response.data.number_of_saves
  }
})
export const handleUnSavingPost = createAsyncThunk('appEcommerce/handleUnSavingPost', async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}/mark_as_unsaved`)
  return {
    post_id: id,
    number_of_saves: response.data.number_of_saves
  }
})

export const appEcommerceSlice = createSlice({
  name: 'appEcommerce',
  initialState: {
    refreshPosts: false,
    params: {},
    headerParams: {
      page: 1,
      hasMore: true,
      perPage: 10,
      all_posts: true,
      sort: '',
    },
    sidebarParams: {
      wilaya_id: [],
      car_types: [],
      part_categories: [],
      car_brands: []
    },
    posts: [],
    totalPosts: 0,
    selectedPost: null
  },
  reducers: {
    handleRefreshPosts: (state, action) => {
      state.refreshPosts = !state.refreshPosts
    }, 
    handleHeaderParamsUpdates: (state, action) => {
      state.headerParams = {...state.headerParams, ...action.payload}
    },    
    clearSidebarParams: (state, action) => {
      state.sidebarParams = {
        wilaya_id: [],
        car_types: [],
        part_categories: [],
        car_brands: []
      }
    },
    handleParamsUpdates: (state, action) => {
      state.sidebarParams = {...state.sidebarParams, ...action.payload}
    },    
    handleResponseAdded: (state, action) => {
      let tmpPost = state.posts.findIndex(item => item.id === action.payload.post_id)
      state.posts[tmpPost].post_responses_count += 1
      state.posts[tmpPost].responded = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts
        state.totalPosts = action.payload.totalPosts
        if (action.payload.next_page_url) {
          state.headerParams.page = state.headerParams.page + 1
        } else {
          state.headerParams.hasMore = false
        }
      })
      .addCase(getMorePosts.fulfilled, (state, action) => {
        state.posts = [...state.posts, ...action.payload.posts]
        if (action.payload.next_page_url) {
          state.headerParams.page = state.headerParams.page + 1
        } else {
          state.headerParams.hasMore = false
        }
      })
      .addCase(getSelectedPost.fulfilled, (state, action) => {
        console.log(action.payload)
        state.selectedPost = action.payload
      })       
      .addCase(getSelectedPost.rejected, (state, action) => {
        state.selectedPost = undefined
      })
      .addCase(handleSavingPost.fulfilled, (state, action) => {
        let tmpPost = state.posts.findIndex(item => item.id === action.payload.post_id)
        state.posts[tmpPost].savers_count = action.payload.number_of_saves
        state.posts[tmpPost].saved = true
      })      
      .addCase(handleUnSavingPost.fulfilled, (state, action) => {
        let tmpPost = state.posts.findIndex(item => item.id === action.payload.post_id)
        state.posts[tmpPost].savers_count = action.payload.number_of_saves
        state.posts[tmpPost].saved = false
      })
  }
})
export const { handleRefreshPosts, clearSidebarParams, handleHeaderParamsUpdates, handleParamsUpdates, handleResponseAdded } = appEcommerceSlice.actions

export default appEcommerceSlice.reducer
