// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Button, Col, Form, FormFeedback, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'

// ** Icons Imports
import { ArrowLeft, ArrowRight } from 'react-feather'
// ** 
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import i18n from '../../../configs/i18n'
import { loadFormOptions } from '../../../redux/formOptions'
import { useDispatch, useSelector } from 'react-redux'
import useAxiosApi from '../../../axios/apis/useAxiosApi'

const businessSchema = yup.object().shape({
  selectedCarType: yup.object().typeError('required').shape({
    value: yup.string().required(),
    label: yup.string().required()
  }),
  selectedCarBrands: yup.array().typeError('This field required').of(
    yup.object().shape({
      value: yup.string().required(),
      label: yup.string().required()
    })
  ).compact((v) => !v.value).required('required-field'),
  selectedPartCategories: yup.array().typeError('This field required').of(
    yup.object().shape({
      value: yup.string().required(),
      label: yup.string().required()
    })
  ).compact((v) => !v.value).required('required-field')
})

const defaultValues = {
  selectedCarType: null,
  selectedCarBrands: '',
  selectedPartCategories: ''
}
/*eslint-disable */
const SpecialityStep = ({ stepper, submitStepData }) => {
  // ** Hook
  const axiosInstance = useAxiosApi()
  // ** Store
  const formOptions = useSelector(state => state.formOptions)
  const dispatch = useDispatch()
  // ** States
  const [carBrands, setCarBrands] = useState([])
  // ** Effects
  useEffect(() => {
    const loadData = async () => {
      if (formOptions.isLoading) {
        dispatch(loadFormOptions())
      }
    }

    loadData()
  }, [])

    // ** Hooks
    const {
      control,
      setError,
      setValue,
      handleSubmit,
      clearErrors,
      formState: { errors }
    } = useForm({
      defaultValues,
      resolver: yupResolver(businessSchema)
    })

  /** onSubmit */
  const onSubmit = async (formData) => {
    const data = {
      selectedCarType: formData.selectedCarType.value, 
      selectedCarBrands: formData.selectedCarBrands.map((item)=> {return item.value}), 
      selectedPartCategories: formData.selectedPartCategories.map((item)=> {return item.value})
    }
    try {
      const response = await axiosInstance.post('/api/users/register_validation/2', data)
      submitStepData(data)
      stepper.next()
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
  }

  const  updatedSelectedCarType = async (selectedValue) => {
    clearErrors('selectedCarType')
    setValue('selectedCarType', selectedValue)
    try {
      const response = await axiosInstance.get('/api/car_brands')
      const options = response.data.map((carBrand) => { return {value: carBrand.id, label: carBrand.name} })
      setCarBrands(options)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Fragment>
      <h5>{i18n.t('Spécialité')}</h5>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
            <Col md='12' className='mb-1'>
            <Label className='form-label' for='selectedCarType'>{i18n.t('Type de véhicules')}</Label>
              <Controller
                control={control}
                id='selectedCarType'
                name='selectedCarType'
                render={({ field: {onChange, value}, formState }) => (
                  <Select
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    className={classnames('react-select', { 'is-invalid': errors?.selectedCarType })}
                    options={formOptions.car_types}
                    isClearable={false}
                    onChange={updatedSelectedCarType}
                    value={value}
                    isLoading={formOptions.isLoading}
                  />
                )}
              />
              {errors.selectedCarType && <FormFeedback>{errors.selectedCarType.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
            <Label className='form-label' for='selectedCarBrands'>{i18n.t('Marques de véhicules')}</Label>
              <Controller
                control={control}
                id='selectedCarBrands'
                name='selectedCarBrands'
                render={({ field, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedCarBrands })}
                  classNamePrefix='select'
                  options={carBrands}
                  isClearable={false}
                  isMulti
                  isDisabled={carBrands.length === 0}
                  {...field}
                  />
                )}
              />
              {errors.selectedCarBrands && <FormFeedback>{errors.selectedCarBrands.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
            <Label className='form-label' for='selectedPartCategories'>{i18n.t('Catégories de pièces')}</Label>
              <Controller
                control={control}
                id='selectedPartCategories'
                name='selectedPartCategories'
                render={({ field, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedPartCategories })}
                  classNamePrefix='select'
                  options={formOptions.part_categories}
                  isClearable={false}
                  isMulti
                  isLoading={formOptions.isLoading}
                  {...field}
                />
                )}
              />
              {errors.selectedPartCategories && <FormFeedback>{errors.selectedPartCategories.message}</FormFeedback>}
            </Col>
        </Row>
        <div className='d-flex justify-content-between mt-2'>
          <Button color='primary' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='rotate-rtl align-middle me-sm-50 me-0' />
            <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Précédent')}</div>
          </Button>
          <Button color='primary' type='submit'>
          <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Suivant')}</div>
            <ArrowRight size={14} className='rotate-rtl align-middle ms-sm-50 ms-0' />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default SpecialityStep

