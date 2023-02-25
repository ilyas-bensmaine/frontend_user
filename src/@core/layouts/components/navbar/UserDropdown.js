// ** React Imports
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { useDispatch } from 'react-redux'
import { handleLogout } from '../../../../redux/authentication'
import useAxiosApi from '../../../../axios/apis/useAxiosApi'
import useUserData from '../../../../utility/hooks/useUserData'

const UserDropdown = () => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  const userData = useUserData()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logout = async () => {
    await axiosInstance.post('\logout')
    navigate(0)
    dispatch(handleLogout())
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{userData.name}</span>
          <span className='user-status'>{userData.user_profession?.name}</span>
        </div>
        <Avatar img={defaultAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to={`/profile/${userData.id}`}>
          <User size={14} className='me-75' />
          <span className='align-middle'>Profile</span>
        </DropdownItem>
        {/* <DropdownItem tag={Link} to='/pages/'>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem> */}
        <DropdownItem tag={Link} to='/welcome' onClick={logout}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
