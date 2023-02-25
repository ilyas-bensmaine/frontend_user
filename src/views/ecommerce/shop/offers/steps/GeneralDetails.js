import React from 'react'
import { Check, ChevronLeft, ChevronRight } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import { Button, Col, Form, FormFeedback, FormText, Label, Row } from 'reactstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FileUploader from '../../../../components/fileupload/FileUploader'
import { useSelector } from 'react-redux'
import i18n from '../../../../../configs/i18n'
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import useUserData from '../../../../../utility/hooks/useUserData'

// ** Yup Schema
const FormSchema = yup.object().shape({
  wilaya: yup.object().shape({
    value: yup.string().required(i18n.t('Wilaya est obligatoire')),
    label: yup.string().required()
  }),
  urls: yup.array().of(yup.string())
})
export default function GeneralDetails({stepper, stepData}) {
  // Store 
  const formOptions = useSelector(state => state.formOptions)
  const userData = useUserData()
  // ** defaultValues
  const defaultValues = {
    title: '',
    wilaya: formOptions.wilaya?.find((item) => item.value === userData.wilaya.id),
    urls: []
  }
  // ** States
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(FormSchema)
  })

  const onSubmit = (data) => {
    stepData(data)
  }
  const onError = (errors) => {
    console.log(errors)
  }

  const handleDeletedUrl = (fileUrl) => {
      const newState = [...getValues('urls').filter(item => item !== fileUrl)]
      setValue('urls', newState)
  }
  const handleAddedUrl = (fileUrl) => {
      const newState = [...getValues('urls'), fileUrl]
      setValue('urls', newState)
  }
  return (
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col md='12' className='mb-1'>
            <Label className='form-label' for='wilaya'>{i18n.t('Wilaya')}</Label>
            <Controller
              control={control}
              id='wilaya'
              name='wilaya'
              // eslint-disable-next-line
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
          <Col xs={12} md={12}>
            <Controller
              control={control}
              id='urls'
              name='urls'
              // eslint-disable-next-line
              render={({ formState }) => (
                <FileUploader fileExtension={'image/*'} fileMultiple={true} onAddUrl={handleAddedUrl} onDeleteUrl={handleDeletedUrl} ></FileUploader>
              )}
            />
            {errors.urls && <FormFeedback>errors.urls.message</FormFeedback>}
            <FormText className='text-muted'>This field is optional.</FormText>
          </Col>
        </Row>
        <div className='d-flex justify-content-between mt-4'>
          <Button onClick={() => stepper.previous()} color='secondary' className='btn-prev' outline>
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0' />
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Post</span>
            <Check size={14} className='align-middle ms-sm-25 ms-0' />
          </Button>
        </div>
      </Form>
  )
}
