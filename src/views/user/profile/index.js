// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// ** Store & Actions
import { getUser } from '../store'
import { useDispatch } from 'react-redux'
// ** Reactstrap Imports
import { Row, Col, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { Bell, Briefcase, Lock, MapPin, Smartphone, User } from 'react-feather'
// ** User View Components
import PlanCard from './PlanCard'
import UserInfoCard from './UserInfoCard'
import Account from './Account'
import Notifications from './Notifications'
import PasswordTap from './PasswordTap'
import BusinessTap from './BusinessTap'
import MobileTap from './MobileTap'
// ** Styles
import '@styles/react/apps/app-users.scss'
import useUserData from '../../../utility/hooks/useUserData'
import i18n from '../../../configs/i18n'

const UserProfile = () => {
  // ** Store Vars
  const userData = useUserData()
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getUser(parseInt(id)))
  }, [dispatch])

  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return userData !== null && userData !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedUser={userData} />
          <PlanCard selectedUser={userData} />
        </Col>
        <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <Nav pills className='mb-2'>
            <NavItem>
              <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
                <User className='font-medium-3 me-50' />
                <span className='fw-bold'> {i18n.t('Compte')} </span>
              </NavLink>
            </NavItem>        
            <NavItem>
              <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                <Lock className='font-medium-3 me-50' />
                <span className='fw-bold'> {i18n.t('Mot de passe')} </span>
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                <Smartphone className='font-medium-3 me-50' />
                <span className='fw-bold'>Mobile</span>
              </NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink active={active === '13'} onClick={() => toggleTab('13')}>
                <Briefcase className='font-medium-3 me-50' />
                <span className='fw-bold'> {i18n.t('Spécialité')} </span>
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                <MapPin className='font-medium-3 me-50' />
                <span className='fw-bold'>Location</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
                <Bell className='font-medium-3 me-50' />
                <span className='fw-bold'>Notifications</span>
              </NavLink>
            </NavItem> */}
          </Nav>
          <TabContent activeTab={active}>
            <TabPane tabId='1' key={1}>
              <Account dispatch={dispatch} selectedUser={userData}/>
            </TabPane>
            <TabPane tabId='2' key={2}>
              <PasswordTap />
            </TabPane>
            <TabPane tabId='3' key={3}>
              <MobileTap dispatch={dispatch} selectedUser={userData}/>
            </TabPane>
            <TabPane tabId='13' key={13}>
              <BusinessTap dispatch={dispatch} selectedUser={userData}/>
            </TabPane>
            <TabPane tabId='4' key={4}>

            </TabPane>        
            <TabPane tabId='5' key={5}>
              <Notifications />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>{i18n.t('Utilisateur non reconnu')}</h4>
      <div className='alert-body'>
      {i18n.t("Reconnectez-vous s'il vous plait")} <Link to='/login'>{i18n.t('Se connecter')}</Link>
      </div>
    </Alert>
  )
}
export default UserProfile
