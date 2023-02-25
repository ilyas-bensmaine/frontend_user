import { Fragment, useEffect, useState } from 'react'
/* eslint-disable */
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
import useAxiosApi from '../../../../../axios/apis/useAxiosApi'

const defaultValues = {
  selectedPartCategory: [],
  selectedPartSubCategories: [],
  selectedParts: []
}

const PartInfo = ({ stepper, stepData }) => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  // ** Yup Schema
  const CarInfoSchema = yup.object().shape({
    selectedPartCategory: yup.object().shape({
      value: yup.string().required('Car type is required'),
      label: yup.string().required(),
    }),
    selectedPartSubCategories: yup.object().shape({
      value: yup.string().required('Car Brand is required'),
      label: yup.string().required(),
    })
  })
  // ** States
  const [partCategories, setPartCategories] = useState([])
  const [partSubCategories, setPartSubCategories] = useState([])
  const [parts, setParts] = useState([])
  // ** Effects
  useEffect(async () => {
    try {
      const partCategoriesResponse = await axiosInstance.get('/api/part_categories')
      const mappedPartCategories = partCategoriesResponse.data.map((item) => { return {value: item.id, label: item.name} })
      setPartCategories(mappedPartCategories)
    } catch (error) {
      console.log(error)
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
    resolver: yupResolver(CarInfoSchema)
  })
  //** onChange Functions */
  const  updatedSelectedPartCategory = async (selectedValue) => {
    setValue('selectedPartCategory', selectedValue)
    try {
      const response = await axiosInstance.get('/api/part_categories/'+ selectedValue.value + '/part_sub_categories')
      const options = response.data.map((item) => { return {value: item.id, label: item.name} })
      setPartSubCategories(options)
    } catch (error) {
      console.log(error)
    }
  }
  const updatedSelectedPartSubCategories= async (selectedValue) => {
    setValue('selectedPartSubCategories', selectedValue)
    console.log(selectedValue)
    try {
      const response = await axiosInstance.get('/api/part_sub_categories/'+ selectedValue.value + '/parts')
      const options = response.data.map((item) => { return {value: item.id, label: item.name} })
      setParts(options)
    } catch (error) {
      console.log(error)
    }
  }
  /** onSubmit */
  const onSubmit = async (formData) => {
    const data = {
      selectedPartCategory: formData.selectedPartCategory.value, 
      selectedPartSubCategories: formData.selectedPartSubCategories.value, 
      selectedParts: formData.selectedParts.length ? formData.selectedParts.map((item) => {
        return item.value
      }) : [] 
    }
    try {
      // const response = await axiosInstance.post('/api/demands/demand_validation/1', data)
      stepData(data)
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

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedPartCategory'>Part category</Label>
              <Controller
                control={control}
                id='selectedPartCategory'
                name='selectedPartCategory'
                render={({ field: {onChange, value}, formState }) => (
                  <Select
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    className={classnames('react-select', { 'is-invalid': errors?.selectedPartCategory })}
                    options={partCategories}
                    isClearable={false}
                    onChange={updatedSelectedPartCategory}
                    value={value}
                  />
                )}
              />
              {errors.selectedPartCategory?.value && <FormFeedback>{errors.selectedPartCategory?.value.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedPartSubCategories'>Part sub-category</Label>
              <Controller
                control={control}
                id='selectedPartSubCategories'
                name='selectedPartSubCategories'
                render={({ field: {onChange}, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedPartSubCategories })}
                  classNamePrefix='select'
                  options={partSubCategories}
                  isClearable={false}
                  isDisabled={partSubCategories.length === 0}
                  onChange={updatedSelectedPartSubCategories}
                  />
                )}
              />
              {errors.selectedPartSubCategories?.value && <FormFeedback>{errors.selectedPartSubCategories?.value.message}</FormFeedback>}
            </Col>
            <Col md='12' className='mb-1'>
              <Label className='form-label' for='selectedParts'>Part</Label>
              <Controller
                control={control}
                id='selectedParts'
                name='selectedParts'
                render={({ field, formState }) => (
                  <Select
                  theme={selectThemeColors}
                  className={classnames('react-select', { 'is-invalid': errors?.selectedParts })}
                  classNamePrefix='select'
                  options={parts}
                  isClearable={false}
                  isDisabled={parts.length === 0}
                  isMulti
                  invalid={errors.selectedParts && true} {...field}
                />
                )}
              />
              {errors.selectedParts?.value && <FormFeedback>{errors.selectedParts?.value.message}</FormFeedback>}
            </Col>
        </Row>
        <div className='d-flex justify-content-between mt-4'>
          <Button  onClick={() => stepper.previous()} color='secondary' className='btn-prev' outline >
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0'/>
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

export default PartInfo
