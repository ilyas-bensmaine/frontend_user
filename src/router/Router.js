// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Utils
import { getHomeRouteForLoggedInUser } from '../utility/Utils'
import useUserData from '../utility/hooks/useUserData'

// ** Components
const Login = lazy(() => import('../views/auth/Login'))
const Error = lazy(() => import('../views/pages/Error'))
const NotAuthorized = lazy(() => import('../views/pages/NotAuthorized'))


const Router = ({ allRoutes }) => {
  const user = useUserData()
  const getHomeRoute = () => {
    if (user) {
      return getHomeRouteForLoggedInUser(user)
    } else {
      return '/welcome'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      // element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
