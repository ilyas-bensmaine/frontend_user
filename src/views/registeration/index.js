// ** React Imports
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Third Party Components
import { Home, User, CreditCard, Smartphone } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Steps
import AccountDetails from './steps/AccountDetails'
import PhoneVerification from './steps/PhoneVerification'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { handleRegistration } from '../../redux/authentication'
import i18n, { getUserLanguage } from '../../configs/i18n'
import useAxiosApi from '../../axios/apis/useAxiosApi'


const RegisterMultiSteps = () => {
  // ** Ref
  const ref = useRef(null)
  // ** hooks
  const axiosInstance = useAxiosApi()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // ** Third Party Components
  const MySwal = withReactContent(Swal)
  // ** State
  const [stepper, setStepper] = useState(null)
  const [accountDetailsData, setAccountDetailsData] = useState({})

  const handleAccountDetailsData = (data) => {
    setAccountDetailsData(data)
  }

  const handlePhoneVerificationData = () => {
    const formData = {...accountDetailsData}
    axiosInstance.get('/sanctum/csrf-cookie').then(() => {
      axiosInstance.post('/register', {...formData, language: getUserLanguage() }).then((response) => {
        const userData = response.data
        dispatch(handleRegistration(userData))
        // initialLanguageDirection(userData.language)
        navigate('/welcome')
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  const steps = [
    {
      id: 'account-details',
      title: i18n.t('Compte'),
      // subtitle: 'Enter username',
      icon: <User size={18} />,
      content: <AccountDetails stepper={stepper} stepData={handleAccountDetailsData}/>
    },
    {
      id: 'PhoneVerification',
      title: i18n.t('Vérification du numéro'),
      // subtitle: 'Select Information',
      icon: <Smartphone size={18} />,
      content: <PhoneVerification stepper={stepper} phoneNumber={accountDetailsData.phone} stepData={handlePhoneVerificationData} />
    }
  ]

  const source = require('@src/assets/images/pages/create-account.svg').default

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <svg viewBox='0 0 139 95' version='1.1' height='28'>
            <defs>
              <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                <stop stopColor='#000000' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
              <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
            </defs>
            <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                <g id='Group' transform='translate(400.000000, 178.000000)'>
                  <path
                    d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                    id='Path'
                    className='text-primary'
                    style={{ fill: 'currentColor' }}
                  ></path>
                  <path
                    d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                    id='Path'
                    fill='url(#linearGradient-1)'
                    opacity='0.2'
                  ></path>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.049999997'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                  ></polygon>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.099999994'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                  ></polygon>
                  <polygon
                    id='Path-3'
                    fill='url(#linearGradient-2)'
                    opacity='0.099999994'
                    points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className='brand-text text-primary ms-1'>Vuexy</h2>
        </Link>
        <Col lg='3' className='d-none d-lg-flex align-items-center p-0'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center'>
            <img className='img-fluid w-100' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col lg='9' className='d-flex align-items-center auth-bg px-2 px-sm-3 px-lg-5 pt-3'>
          <div className='width-700 mx-auto'>
            <Wizard
              ref={ref}
              steps={steps}
              instance={el => setStepper(el)}
              headerClassName='px-0'
              contentWrapperClassName='px-0 mt-4'
              className='register-multi-steps-wizard shadow-none'
            />
            <p className='text-center'>
                <span className='me-25'>{i18n.t('Vous avez déjà un compte ?')}</span>
                <Link to='/login'>
                  <span> {i18n.t('Se connecter')} </span>
                </Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterMultiSteps
