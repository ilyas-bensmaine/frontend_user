import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink } from 'reactstrap'
import useAxiosApi from '../../axios/apis/useAxiosApi'
import { handleFirstLogin } from '../../redux/authentication'
import useUserData from '../../utility/hooks/useUserData'
import CompleteInformationsModal from '../first-login/CompleteInformationsModal'

const Home = () => {
  // ** Hook
  const axiosInstance = useAxiosApi()
  //** States
  const [completeInformationModal, setCompleteInformationModal] = useState(false)
  const userData = useUserData()
  const dispatch = useDispatch()

  const toggleCompleteInformationsModal = () => {
    setCompleteInformationModal(!completeInformationModal)
  }

  useEffect(() => {
    const handleFirstLoginFromBackend = async () => {
      try {
        await axiosInstance.get('/api/users/first_login')
        await axiosInstance.get('/api/user')
      } catch (error) {
        console.log(error)
      }
    }
    if (userData.is_first_login) {
      console.log('first login')
      handleFirstLoginFromBackend()
      dispatch(handleFirstLogin({is_first_login: false}))
      setCompleteInformationModal(true)
    }
  }, [])

  return (
    <Fragment>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Kick start your project 🚀</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>All the best for your new project.</CardText>
            <CardText>
              Please make sure to read our{' '}
              <CardLink
                href='https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/'
                target='_blank'
              >
                Template Documentation
              </CardLink>{' '}
              to understand where to go from here and how to use our template.
            </CardText>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Want to integrate JWT? 🔒</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>
              We carefully crafted JWT flow so you can implement JWT with ease and with minimum efforts.
            </CardText>
            <CardText>
              Please read our{' '}
              <CardLink
                href='https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/docs/development/auth'
                target='_blank'
              >
                JWT Documentation
              </CardLink>{' '}
              to get more out of JWT authentication.
            </CardText>
          </CardBody>
        </Card>
      </div>
      <CompleteInformationsModal open={completeInformationModal} toggleModal={toggleCompleteInformationsModal}></CompleteInformationsModal>
    </Fragment>
  )
}

export default Home
