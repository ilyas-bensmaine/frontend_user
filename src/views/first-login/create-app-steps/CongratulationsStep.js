
// ** Reactstrap Imports
import { Button, Card, CardBody, CardText } from 'reactstrap'

// ** Icons Imports
import { ArrowLeft, Check, Star } from 'react-feather'

// ** Images
import decorationLeft from '@src/assets/images/elements/decore-left.png'
import decorationRight from '@src/assets/images/elements/decore-right.png'
// ** Custom Components
import Avatar from '@components/avatar'
import i18n from '../../../configs/i18n'
import useUserData from '../../../utility/hooks/useUserData'


const CongratulationsStep = ({ stepper, submitStepData, toggleModal}) => {
  const userData = useUserData()

  const onSubmit = (e) => {
    e.preventDefault()
    submitStepData()
    toggleModal()
  }
  return (
    <div className='text-center'>
      <Card className='card-congratulations'>
        <CardBody className='text-center'>
          <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
          <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
          <Avatar icon={<Star size={28} />} className='shadow' color='primary' size='xl' />
          <div className='text-center'>
          <h1 className='mb-1 text-white'>{i18n.t('Félicitations')} {userData.name},</h1>
            <CardText className='m-auto w-75'>
            {i18n.t('Bienvenue sur SafyAuto!')}
            </CardText>
          </div>
        </CardBody>
      </Card>
      <div className='d-flex justify-content-between mt-3'>
        <Button color='primary' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='rotate-rtl align-middle me-sm-50 me-0' />
          <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Précédent')}</div>
        </Button>
        <Button
          color='success'
          onClick={onSubmit}
        >
          <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Sauvgarder')}</div>
          <Check size={14} className='align-middle ms-sm-50 ms-0' />
        </Button>
      </div>
    </div>
  )
}

export default CongratulationsStep
