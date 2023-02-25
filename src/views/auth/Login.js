// ** React Imports
import { Link, useNavigate } from 'react-router-dom'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Coffee, X } from 'react-feather'
import Cleave from 'cleave.js/react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, Suspense, useState } from 'react'
import Spinner from '../../@core/components/spinner/Fallback-spinner'
// ** Actions
import { handleLogin } from '@store/authentication'
// ** Context
// import { AbilityContext } from '@src/utility/context/Can'
// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
// ** Utils
import classnames from 'classnames'
// ** Hooks
import i18n from '../../configs/i18n'
import { useRTL } from '../../utility/hooks/useRTL'
import useAxiosApi from '../../axios/apis/useAxiosApi'
import ComponentSpinner from '../../@core/components/spinner/Loading-spinner'

const ToastContent = ({ t, userData}) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{userData.name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>{i18n.t('Vous vous êtes connecté avec succès en tant que ')} {userData.user_profession?.name} {i18n.t('Vous pouvez maintenant commencer à explorer. Profitez-en !')}</span>
      </div>
    </div>
  )
}

const defaultValues = {
  phone: '',
  password: ''
}

const Login = () => {
  // ** Hooks
  const [loading, setLoading] = useState(false)
  const axiosInstance = useAxiosApi()
  const [isRtl, setIsRtl] = useRTL()
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const ability = useContext(AbilityContext)
  const SignupSchema = yup.object().shape({
    phone: yup.string()
              .required('Phone number is required')
              .matches(/^((5|6|7) [0-9][0-9] [0-9][0-9] [0-9][0-9] [0-9][0-9])$/, 'invalid phone number format')
              // |((0)(2|3|4)[1-9][0-9]{6})
  })
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })
  
  const illustration = skin === 'dark' ? 'register.jpg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const initialLanguageDirection = (language) => {
    if (language === 'dz' && !isRtl) {
      setIsRtl(true)
    } 
    if (language !== 'dz' && isRtl) {
      setIsRtl(false)
    }
    // Load Language in frontend
    i18n.changeLanguage(language)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    const credentials = {
      /*eslint-disable*/
      phone: String('+213' + data.phone?.replace(/\s/g, '')),
      password: data.password
    }
    try {
      await axiosInstance.get('/sanctum/csrf-cookie')
      const response = await axiosInstance.post('/login', credentials)
      const userData = response.data
      dispatch(handleLogin(userData))
      initialLanguageDirection(userData.language)
      navigate('/welcome')
      toast(t => (
        <ToastContent t={t} userData={userData} />
      ))
    } catch (error) {
      if (error.response?.status === 422) {
        const validitionErrors = error.response.data.errors
        for (const key in validitionErrors) {
            setError(key, {
              type: 'manual',
              message: validitionErrors[key]
            })
        }
      } else {
        console.log(error)
      }
    }
    setLoading(false)
  }

  return <Fragment>
            <div className='auth-wrapper auth-cover'>
            <Row className='auth-inner m-0'>
              <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
                <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
                  <img className='img-fluid' src={source} alt='Login Cover' />
                </div>
              </Col>
              <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
                <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                  <CardTitle tag='h2' className='fw-bold mb-1'>
                    {i18n.t('Bienvenue sur SafyAuto!')} 👋
                  </CardTitle>
                  <CardText className='mb-2'>{i18n.t("Connectez-vous à votre compte et commencez l'aventure.")}</CardText>
      
                  <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-1'>
                      <Label className='form-label' for='phone'>
                        {i18n.t("Numéro de téléphone")}
                      </Label>
                      <InputGroup  className={classnames('input-group-merge', { 'is-invalid': errors?.phone })}>
                        <InputGroupText>DZ (+213)</InputGroupText>
                        <Controller
                          control={control}
                          id='phone'
                          name='phone'
                          // eslint-disable-next-line
                          render={({ field, formState }) => (
                              <Cleave className={classnames('form-control', { 'is-invalid': errors?.phone })} 
                              placeholder='7 93 XX XX XX'
                              dir='ltr'
                              options={{
                                numeralPositiveOnly: true,
                                delimiter: ' ',
                                blocks: [1, 2, 2, 2, 2]
                              }}
                              {...field}/>
                          )}
                        />
                      </InputGroup>
                      {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                      <div className='d-flex justify-content-between'>
                        <Label className='form-label' for='password'>
                          {i18n.t('Mot de passe')}
                        </Label>
                        {/* <Link to='/forgot-password'>
                          <small>Forgot Password?</small>
                        </Link> */}
                      </div>
                      <Controller
                        id='password'
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                        )}
                      />
                      {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                    </div>
                    <div className='form-check mb-1'>
                      <Input type='checkbox' id='remember-me' />
                      <Label className='form-check-label' for='remember-me'>
                        {i18n.t('Se souvenir de moi')}
                      </Label>
                    </div>
                    { loading ? <ComponentSpinner /> : (<Button type='submit' color='primary' block>
                      {i18n.t('Se connecter')}
                    </Button>
                    )}
                  </Form>
                  <p className='text-center mt-2'>
                    <span className='me-25'>{i18n.t('Nouveau sur notre plateforme ?')}</span>
                    <Link to='/register'>
                      <span>{i18n.t('Créer un compte')}</span>
                    </Link>
                  </p>
                </Col>
              </Col>
            </Row>
          </div>
    
  </Fragment>
}

export default Login
