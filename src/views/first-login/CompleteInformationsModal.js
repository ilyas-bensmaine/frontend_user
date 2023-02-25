
// ** React Imports
import { Fragment, useState, useRef } from 'react'

// ** Reactstrap Imports
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Icons Imports
import { Book, Package, Command, CreditCard, Check, Award, Gift } from 'react-feather'
// ** Styles
import '@styles/react/pages/modal-create-app.scss'
// ** Steps
import CongratulationStep from './create-app-steps/CongratulationsStep'
import ProfissionsStep from './create-app-steps/ProfissionsStep'
import SpecialityStep from './create-app-steps/SpecialityStep'
import { useDispatch } from 'react-redux'
import { updateUserData } from '../../redux/authentication'
import i18n from '../../configs/i18n'


const CompleteInformationsModal = ({open, toggleModal}) => {
  // ** Ref
  const ref = useRef(null)

  // ** States
//   const [show, setShow] = useState(false)
  const [stepper, setStepper] = useState(null)
  const [wizadData, setWizadData] = useState({})

  const dispatch = useDispatch()

  const handleProfessionStep = (data) => {
    setWizadData(data)
  }
  const handleSpecialityStep = (data) => {
    setWizadData((prevState) => { return {...prevState, ...data} })
  }
  const handleCongratulationStep = async () => {
    console.log(wizadData)
    try {
      dispatch(updateUserData({ dataToUpdate: wizadData }))
    } catch (error) {
      console.log(error)      
    }
  }
  const steps = [
    {
      id: 'profissions',
      title: i18n.t('Profissions'),
    //   subtitle: 'Enter App Details.',
      icon: <Book className='font-medium-3' />,
      content: <ProfissionsStep stepper={stepper} submitStepData={handleProfessionStep} />
    },
    {
      id: 'speciality',
      title: i18n.t('Spécialité'),
    //   subtitle: 'Select Framework',
      icon: <Package className='font-medium-3' />,
      content: <SpecialityStep stepper={stepper} submitStepData={handleSpecialityStep}/>
    },
    {
      id: 'finnish',
      title: i18n.t('Félicitations'),
    //   subtitle: 'Review & Submit',
      icon: <Gift className='font-medium-3' />,
      content: <CongratulationStep stepper={stepper} submitStepData={handleCongratulationStep} toggleModal={toggleModal}/>
    }
  ]

  return (
    <Fragment>
      <Modal isOpen={open} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={toggleModal}></ModalHeader>
        <ModalBody className='pb-3 px-sm-3'>
        <h1 className='text-center mb-1'>{i18n.t('Completer votre inscription')}</h1>
          <p className='text-center mb-2'>{i18n.t("Veuillez fournir des informations permettant d'améliorer la pertinence des demandes")}</p>
         <div className='horizontal-wizard'>
            <Wizard
                ref={ref}
                type='vertical'
                steps={steps}
                headerClassName='border-1'
                options={{ linear: true }}
                instance={el => setStepper(el)}
                contentClassName='shadow-none'
            />
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}
export default CompleteInformationsModal
