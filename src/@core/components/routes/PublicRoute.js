// ** React Imports
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'
import useUserData from '../../../utility/hooks/useUserData'

const PublicRoute = ({ children, route }) => {
  const user = useUserData()
  if (route) {
    const restrictedRoute = route.meta && route.meta.restricted
    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user)} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
