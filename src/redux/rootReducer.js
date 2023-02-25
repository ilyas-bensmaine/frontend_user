// ** Persist
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
// ** Reducers Imports
import layout from './layout'
import navbar from './navbar'
import ecommerce from '@src/views/ecommerce/store'
import users from '@src/views/user/store'
// ** To persist
import authenticationStore from './authentication'
import formOptionsStore from './formOptions'

const formOptionsConfig = {
    key: 'formOptions',
    storage
}
const formOptions = persistReducer(formOptionsConfig, formOptionsStore)
const authenticationConfig = {
    key: 'authentication',
    storage
}
const authentication = persistReducer(authenticationConfig, authenticationStore)

const rootReducer = { 
    authentication,
    navbar,
    layout,
    users,
    ecommerce,
    // Redux-Persist
    formOptions
}

export default rootReducer
