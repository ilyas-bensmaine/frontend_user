// ** React Imports
/* eslint-disable */
import { Fragment, useRef, useState } from 'react'  
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap'
// ** Custom Components
import Wizard from '@components/wizard'
// ** Third Party Components
import { Home, User, CreditCard, Settings, Truck, MapPin } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Steps
import CarInfo from './steps/CarInfo'
import PartInfo from './steps/PartInfo'
import GeneralDetails from './steps/GeneralDetails'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { Link } from 'react-router-dom'
import useAxiosApi from '../../../../axios/apis/useAxiosApi'
import { getPosts, handleHeaderParamsUpdates, handleRefreshPosts } from '../../store'
import { useDispatch, useSelector } from 'react-redux'

const NewDemandModal = ({open, toggleModal}) => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  // ** store
  const headerParams = useSelector(state => state.ecommerce.headerParams)
  const sidebarParams = useSelector(state => state.ecommerce.sidebarParams)
  const dispatch = useDispatch()
  // ** States
  const ref = useRef(null)
  // ** Third Party Components
  const MySwal = withReactContent(Swal)
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Good job!',
      text: 'You clicked the button!',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }
  // ** State
  const [stepper, setStepper] = useState(null)
  const [formData, setFormData] = useState({})

  const handleCarInfoData = (data) => {
    setFormData(prevState => { return {...prevState, ...data}})
  }


  const handlePartInfoData = (data) => {
    setFormData(prevState => { return {...prevState, ...data}})
  }
  const handleGeneralDetailsData = async (data) => {
    console.log(formData)
    const uploadedData = {...formData, ...data}
    try {
      await axiosInstance.post('api/posts', uploadedData)
      dispatch(handleRefreshPosts())
      handleSuccess()
      toggleModal()
    } catch (error) {
      console.log(error)
    }
  }

  const steps = [
    {
      id: 'car-details',
      title: 'Car Details',
      // subtitle: 'Informations about the car brand & modele',
      icon: <Truck size={18} />,
      content: <CarInfo stepper={stepper} stepData={handleCarInfoData}/>
    },
    {
      id: 'part-details',
      title: 'Part Details',
      // subtitle: 'Informations about the part categories',
      icon: <Settings size={18} />,
      content: <PartInfo stepper={stepper} stepData={handlePartInfoData} />
    },
    {
      id: 'additional-informations',
      title: 'General details',
      // subtitle: 'Additional information about the demand',
      icon: <MapPin size={18} />,
      content: <GeneralDetails stepper={stepper} stepData={handleGeneralDetailsData} />
    }
  ]

  const onDiscard = () => {

  }

  return (
    <Fragment>
      <Modal
        isOpen={open}
        onClosed={onDiscard}
        toggle={toggleModal}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <h1 className='text-center mb-1'>Post New Part Demand</h1>
            <Row className='auth-inner m-0'>
              <Col md='12' className='d-flex align-items-center auth-bg px-2 px-sm-3 px-lg-5'>
                <div className='width-700 mx-auto'>
                  <Wizard
                    ref={ref}
                    steps={steps}
                    instance={el => setStepper(el)}
                    headerClassName='px-0'
                    contentWrapperClassName='px-0 mt-1'
                    className='register-multi-steps-wizard shadow-none'
                  />
                </div>
              </Col>
            </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default NewDemandModal
