// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Home = lazy(() => import('../../views/pages/Home'))
const Welcome = lazy(() => import('../../views/welcome'))
const Registration = lazy(() => import('../../views/registeration'))

const Posts = lazy(() => import('../../views/ecommerce/shop'))
const UserProfile = lazy(() => import('../../views/user/profile'))
const PostDetails = lazy(() => import('../../views/ecommerce/shop/detail'))

const AppRoutes = [
  {
    path: 'welcome',
    element: <Welcome/>,
    meta: {
      menuHidden: true,
      publicRoute: true
    }
  },
  {
    path: 'home',
    element: <Home />
  },
  {
    path: 'register',
    element: <Registration />,
    meta: {
      publicRoute: true,
      menuHidden: true
    }
  },
  {
    element: <Posts />,
    path: '/gallery/posts',
    meta: {
      className: 'ecommerce-application'
    }
  },
  {
    path: '/gallery/posts/details/:id',
    element: <PostDetails />,
    meta: {
      className: 'ecommerce-application'
    }
  },
  {
    element: <UserProfile />,
    path: '/profile/:id',
    meta: {
      menuHidden: true
    }
  }
]
export default AppRoutes
