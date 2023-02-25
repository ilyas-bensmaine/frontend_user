// ** React Imports
/* eslint-disable */
import { Fragment, useEffect, useRef, useState } from 'react'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { ChevronLeft, ChevronRight } from 'react-feather'
import Select from 'react-select'
import classnames from 'classnames'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { loadFormOptions } from '../../../../../redux/formOptions'
import useAxiosApi from '../../../../../axios/apis/useAxiosApi'

const defaultValues = {
  selectedCarType: [],
  selectedCarBrands: [],
  selectedCarModels: []
}

const CarInfo = ({ stepper, stepData }) => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  // ** Yup Schema
  const FormSchema = yup.object().shape({
    selectedCarType: yup.object().shape({
      value: yup.string().required('Car type is required'),
      label: yup.string().required(),
    }),
    selectedCarBrands: yup.object().shape({
      value: yup.string().required('Car Brand is required'),
      label: yup.string().required(),
    })
  })
  // ** Store 
  const dispatch = useDispatch()
  const formOptions = useSelector(state => state.formOptions)
  // ** States
  const [carTypes, setCarTypes] = useState([])
  const [carBrands, setCarBrands] = useState([])
  const [carModels, setCarModels] = useState([])
  // ** Effects
  useEffect(() => {
    const loadData = async () => {
      if(formOptions.isLoading) {
        dispatch(loadFormOptions())
      }
    }
  }, [])
  // ** Hooks
  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(FormSchema)
  })
  //** onChange Functions */
  const  updatedSelectedCarType = async (selectedValue) => {
    setValue('selectedCarType', selectedValue)
    try {
      const response = await axiosInstance.get('/api/car_brands')
      const options = response.data.map((item) => { return {value: item.id, label: item.name} })
      setCarBrands(options)
    } catch (error) {
      console.log(error)
    }
  }
  const updatedSelectedCarBrands= async (selectedValue) => {
    setValue('selectedCarBrands', selectedValue)
    console.log(selectedValue)
    try {
      const response = await axiosInstance.get('/api/car_brands/'+ selectedValue.value + '/car_models')
      const carModelsOptions = response.data.map((item) => { return {value: item.id, label: item.name} })
      setCarModels(carModelsOptions)
    } catch (error) {
      console.log(error)
    }
  }
  /** onSubmit */
  const onSubmit = async (formData) => {
    const data = {
      selectedCarType: formData.selectedCarType.value, 
      selectedCarBrands: formData.selectedCarBrands.value, 
      selectedCarModels: formData.selectedCarModels.length ? formData.selectedCarModels.map((item) => {
        return item.value
      }) : [] 
    }
    try {
      // const response = await axiosInstance.post('/api/demands/demand_validation/1', data)
      stepData(data)
      stepper.next(data)
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

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedCarType'>Type de véhicule</Label>
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
              {errors.selectedCarType?.value && <FormFeedback>{errors.selectedCarType?.value.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedCarBrands'>Marque de véhicule</Label>
              <Controller
                control={control}
                id='selectedCarBrands'
                name='selectedCarBrands'
                render={({ field: {onChange}, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedCarBrands })}
                  classNamePrefix='select'
                  options={carBrands}
                  isClearable={false}
                  isLoading={formOptions.isLoading}
                  isDisabled={carBrands.length === 0}
                  onChange={updatedSelectedCarBrands}
                  />
                )}
              />
              {errors.selectedCarBrands?.value && <FormFeedback>{errors.selectedCarBrands?.value.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedCarModels'>Car Models</Label>
              <Controller
                control={control}
                id='selectedCarModels'
                name='selectedCarModels'
                render={({ field, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedCarModels })}
                  classNamePrefix='select'
                  options={carModels}
                  isClearable={false}
                  isMulti
                  isLoading={formOptions.isLoading}
                  isDisabled={carModels.length === 0}
                  invalid={errors.selectedCarModels && true} {...field}
                />
                )}
              />
              {errors.selectedCarModels?.value && <FormFeedback>{errors.selectedCarModels?.value.message}</FormFeedback>}
            </Col>
        </Row>
        <div className='d-flex justify-content-between mt-4'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ChevronRight size={14} className='align-middle ms-sm-25 ms-0'></ChevronRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default CarInfo
