// ** React Imports
/* eslint-disable */
import { Fragment, useEffect, useRef } from 'react'
// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronLeft, ChevronRight } from 'react-feather'
import Select from 'react-select'
// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
import Cleave from 'cleave.js/react'
import i18n from '../../../configs/i18n'
import { useRTL } from '../../../utility/hooks/useRTL'
import { useDispatch, useSelector } from 'react-redux'
import { loadFormOptions } from '../../../redux/formOptions'
import useAxiosApi from '../../../axios/apis/useAxiosApi'

const defaultValues = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  phone: '',
  wilaya: {value: '', label: ''}
}

const AccountDetails = ({ stepper, stepData }) => {
  // ** Hook
  const axiosInstance = useAxiosApi()
  const cleaveInput = useRef()
  //** Store
  const formOptions = useSelector(state => state.formOptions)
  const dispatch = useDispatch()
  const SignupSchema = yup.object().shape({
    phone: yup.string()
              .required(i18n.t('Le numéro de téléphone est obligatoire'))
              .matches(/^((5|6|7) [0-9][0-9] [0-9][0-9] [0-9][0-9] [0-9][0-9])$/, 'invalid phone number format'),
    wilaya: yup.object().shape({
      value: yup.string().required(i18n.t('Wilaya est obligatoire')),
      label: yup.string().required(),
    })
  })
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(SignupSchema)
  })
  // ** Hooks
  useEffect(() => {
    const loadData = async () => {
      if (formOptions.isLoading) {
        dispatch(loadFormOptions())
      }    
    }

    loadData()
  }, [])

  const onSubmit = async (formData) => {
    const data = {
      email: formData.email,
      name: formData.name,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: String('+213'+ formData.phone?.replace(/\s/g, '')),
      wilaya: formData.wilaya?.value
    }
    try {
      await axiosInstance.post('/api/users/register_validation/1', data)
      stepData(data)
      stepper.next(formData)
    } catch (error) {
      if (error.response?.status === 422) {
        const validitionErrors = error.response.data.errors
        for (const key in validitionErrors) {
            setError(key, {
              type: 'server',
              message: validitionErrors[key]
            })
        }
      } else {
        console.log(error)
      }
    }
  }
  const onError = errors => {
    console.log(errors)
    console.log();
  }

  return (
    <Fragment>
      <div className='content-header mb-2'>
      <h2 className='fw-bolder mb-75'>{i18n.t('Informations sur le compte')}</h2>
        <span>{i18n.t('Entrez vos coordonnées')}</span>
      </div>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='name'>
            {i18n.t('Nom et Prénom')}
            </Label>
            <Controller
              id='name'
              name='name'
              control={control}
              render={({ field }) => <Input placeholder='johndoe' invalid={errors.name && true} {...field} />}
            />
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`email`}>
            {i18n.t('Email')}
            </Label>
            <Controller
              control={control}
              id='email'
              name='email'
              render={({ field }) => (
                <Input type='email' placeholder='john.doe@email.com' invalid={errors.email && true} {...field} />
              )}
            />
            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <div className='form-password-toggle col-md-6 mb-1'>
            <Controller
              id='password'
              name='password'
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                label={i18n.t('Mot de passe')}
                  htmlFor='password'
                  className='input-group-merge'
                  invalid={errors.password && true}
                  {...field}
                />
              )}
            />
            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
          </div>
          <div className='form-password-toggle col-md-6 mb-1'>
            <Controller
              control={control}
              id='confirmPassword'
              name='confirmPassword'
              render={({ field }) => (
                <InputPasswordToggle
                label={i18n.t('Confirmer le mot de passe')}
                htmlFor='password'
                  className='input-group-merge'
                  invalid={errors.confirmPassword && true}
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
          </div>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='phone'>
            {i18n.t('Numéro de téléphone')}
            </Label>
            <InputGroup className={classnames('input-group-merge', { 'is-invalid': errors?.phone })}>
              <InputGroupText>DZ (+213)</InputGroupText>
              <Controller
                control={control}
                id='phone'
                name='phone'
                ref={cleaveInput}
                render={({ field, formState }) => (
                    <Cleave className={classnames('form-control', { 'is-invalid': errors?.phone })} 
                        placeholder='7 93 ** ** **' 
                        dir='ltr'
                        options={{
                          delimiter: ' ',
                          blocks: [1, 2, 2, 2, 2]
                        }}
                        {...field}
                        />
                      )}
                />
            {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
            </InputGroup>
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='wilaya'>{i18n.t('Wilaya')}</Label>
            <Controller
              control={control}
              id='wilaya'
              name='wilaya'
              render={({ field, formState }) => (
                <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.wilaya })}
                  classNamePrefix='select'
                  options={formOptions.wilayas}
                  isClearable={false}
                  value={field.value}
                  isLoading={formOptions.isLoading}
                  {...field}
                />
              )}
            />
            {errors.wilaya?.value && <FormFeedback>{errors.wilaya?.value.message}</FormFeedback>}
          </Col>
        </Row>
        <div className='d-flex justify-content-between mt-2'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
            <span className='align-middle d-sm-inline-block d-none'>{i18n.t('Précédent')}</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>{i18n.t('Suivant')}</span>
            <ChevronRight size={14} className='align-middle ms-sm-25 ms-0'></ChevronRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default AccountDetails
