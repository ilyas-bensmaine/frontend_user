// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Bell, X, Check, AlertTriangle, Award } from 'react-feather'
import InfiniteScroll from 'react-infinite-scroll-component'
// ** Reactstrap Imports
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Col } from 'reactstrap'
// ** Notifications 
import Echo from 'laravel-echo'
import Pusher from "pusher-js"
// ** ReactTimeAgo
import ReactTimeAgo from 'react-time-ago'
import useAxiosApi from '../../../../axios/apis/useAxiosApi'
import { getUserLanguage } from '../../../../configs/i18n'
import useUserData from '../../../../utility/hooks/useUserData'
import AudioSource from '../../../../assets/audio/notification-bells.mp3'

/*eslint-disable*/
const NotificationDropdown = () => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  const perPage = 10
  const user = useUserData()
  //** States
  const [notifications, setNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0)
  
  useEffect(() => {
    const loadFirstNotifications = async () => {
      const response = await axiosInstance.get(`/api/users/notifications?page=${currentPage}&perPage=${perPage}`)
      if (response.data.notifications.length == 0 || response.data.notifications.length < perPage) {
        setHasMore(false)
      } else {
        setCurrentPage((prevState) => prevState + 1)
      }
      setNotifications(response.data.notifications)
      setTotalUnreadNotifications(response.data.totalUreadNotifications)
    }

    loadFirstNotifications()
    const echo = new Echo({
      broadcaster: "pusher",
      key: "myappKey",
      wsHost: "localhost",
      wsPort: 6001,
      forceTLS: false,
      cluster: "mt1",
      disableStats: true,
      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
            axiosInstance.post('api/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name
            }).then((response) => {
                callback(false, response.data)
              })
              .catch((error) => {
                callback(true, error)
              })
          }
        }
      }
    })
    echo.private(`App.Models.User.${user.id}`).notification((notification) => {
      setNotifications((prevState) => { return [notification, ...prevState] })
      setTotalUnreadNotifications((prevState) => prevState + 1)
      const audio = new Audio(AudioSource)
      audio.play()
    })
  }, [])

  const fetchData = async () => {
    const response = await axiosInstance.get(`/api/users/notifications?page=${currentPage}&perPage=${perPage}`)
    setNotifications((prevState) => { return [...prevState, ...response.data.notifications] })
    if (response.data.notifications.length === 0 || response.data.notifications.length < perPage) {
      setHasMore(false)
    } else {
      setCurrentPage((prevState) => prevState + 1)
    }
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {totalUnreadNotifications > 0 ? 
        <Badge pill color='danger' className='badge-up'>
          {totalUnreadNotifications}
        </Badge> : null
        }
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Notifications</h4>
            <Badge tag='div' color='light-primary' pill>
            {totalUnreadNotifications > 0 ? totalUnreadNotifications : null}
            </Badge>
          </DropdownItem>
        </li>
        <InfiniteScroll
          dataLength={notifications.length} //This is important field to render the next data
          component='li'
          className='media-list scrollable-container'
          next={fetchData}
          // height='300px'
          hasMore={hasMore}
          endMessage={
            <li className='dropdown-menu-footer'>
              <p style={{ textAlign: 'center' }} className='mb-0'>
                <b>No more notifications.. !</b>
              </p>
            </li>
          }
        >
        {notifications.map((item) => {
          return <li key={item.id} className='media-list scrollable-container'>
                    <a className='d-flex'>
                        <div className='list-item d-flex align-items-start'>
                            <Fragment>
                              <div className='me-1'>
                                <Avatar icon={<Award size={14} />} color='light-danger' />
                              </div>
                              <div className='list-item-body flex-grow-1'>
                                <p className='media-heading'>
                                  <span className='fw-bolder'>item.title</span>
                                </p>
                                <div className='d-flex justify-content-between align-items-start'>
                                    <small className='notification-text'>item.subtitle</small>
                                    <small className='notification-text'>
                                      <ReactTimeAgo date={item.created_at} locale={ getUserLanguage() }/>
                                    </small>
                                </div>
                              </div>
                            </Fragment>
                        </div>
                      </a>
                  </li>
        })}
        </InfiniteScroll>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
