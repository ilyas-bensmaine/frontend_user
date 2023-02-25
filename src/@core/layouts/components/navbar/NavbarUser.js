// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import IntlDropdown from './IntlDropdown'
import NotificationDropdown from './NotificationDropdown'
// ** Third Party Components
import { Sun, Moon, Plus } from 'react-feather'

// ** Reactstrap Imports
import { Button, NavItem, NavLink } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import NewDemandBtn from './NewDemandBtn'
import useUserData from '../../../../utility/hooks/useUserData'
import i18n from '../../../../configs/i18n'

const NavbarUser = (props) => {
    // ** hooks
    const user = useUserData()
    // ** Props
    const { skin, setSkin } = props

    const navigate = useNavigate()
    // ** Function to toggle Theme (Light/Dark)
    const ThemeToggler = () => {
      if (skin === 'dark') {
        return <Sun className='ficon' onClick={() => setSkin('light')} />
      } else {
        return <Moon className='ficon' onClick={() => setSkin('dark')} />
      }
    }
    const location = useLocation()
    // console.log(location)
  return (
    <Fragment>
      <ul className="nav navbar-nav align-items-center ms-auto">
        <IntlDropdown />
        <NavItem className="mobile-menu me-auto">
          <NavLink className="nav-link-style">
            <ThemeToggler />
          </NavLink>
        </NavItem>
        
        {user ? (<>
          <NotificationDropdown />
          <UserDropdown />
          {location.pathname !== '/welcome' ? <NewDemandBtn /> : null}
        </>
        ) : (
          <>
            <Button.Ripple color="outline-success" className="me-25" onClick={() => {
              navigate('/register')
            }}>{i18n.t("S'inscrire")}</Button.Ripple>
            <Button.Ripple color="success" onClick={() => {
              navigate('/login')
            }}>{i18n.t('Se connecter')}</Button.Ripple>
            
          </>
        )}
      </ul>
    </Fragment>
  )
}
export default NavbarUser
