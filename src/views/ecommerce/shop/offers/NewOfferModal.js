// ** React Imports
/* eslint-disable */
import { Fragment, useEffect, useRef, useState } from 'react'  
// ** Reactstrap Imports
import {Row, Col, Modal, ModalBody, ModalHeader, Label, Input, InputGroup, InputGroupText, Form, FormText, Button, FormFeedback} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { Link } from 'react-router-dom'
import useAxiosApi from '../../../../axios/apis/useAxiosApi'
import { Controller, useForm } from 'react-hook-form'
import i18n from '../../../../configs/i18n'
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { loadFormOptions } from '../../../../redux/formOptions'
import FileUploader from '../../../components/fileupload/FileUploader'
import toast from 'react-hot-toast'
import { handleResponseAdded } from '../../store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useUserData from '../../../../utility/hooks/useUserData'

const NewOfferModal = ({open, toggleModal, selectedPost}) => {
  // ** Hook 
  const axiosInstance = useAxiosApi()
  const userData = useUserData()
  // ++ Form
  const formSchema = yup.object().shape({
    price: yup.number().typeError(i18n.t('Doit être un nombre')),
    wilaya: yup.object().shape({
      value: yup.string().required(i18n.t('Wilaya est obligatoire')),
      label: yup.string().required(),
    })
  })
  const defaultValues = {
    price: '',
    wilaya: {value: userData.wilaya.id, label: userData.wilaya.name, ...userData.wilaya},
    content: '',
    urls: []
  }
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(formSchema)
  })
  // ** Store
  const dispatch = useDispatch()
  const formOptions = useSelector(state => state.formOptions)
  // ** Hooks
  useEffect(() => {
    const loadData = async () => {
      if (formOptions.isLoading) {
        dispatch(loadFormOptions())
      }    
    }

    loadData()
  }, [])

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await axiosInstance.post('api/post_responses', {...data, post_id: selectedPost.id})
      toast.success('Offer has been added successfully')
      dispatch(handleResponseAdded({post_id: selectedPost.id}))
      toggleModal(selectedPost)
    } catch (error) {
      console.log(error)
    }
  }
  const onError = (errors) => {
    console.log(errors)
  }
  
  const onDiscard = () => {
    reset()
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
    <Fragment>
      {
        selectedPost && <Modal
        isOpen={open}
        onClosed={onDiscard}
        toggle={toggleModal}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <h1 className='text-center mb-1'>New Offer</h1>
          <h4 className='text-center mb-1'>Post a new offer for the post {selectedPost.title}</h4>
            <Form onSubmit={handleSubmit(onSubmit, onError)}>
              <Row>
                <Col md='6' className='mb-1'>
                  <Label className='form-label' for='price'>
                    {i18n.t('Prix')}
                  </Label>
                  <InputGroup className={classnames('input-group-merge', { 'is-invalid': errors?.price })}>
                      <Controller
                        id='price'
                        name='price'
                        control={control}
                        render={({ field }) => <Input invalid={errors.price && true} {...field} />}
                      />
                      <InputGroupText>DZA</InputGroupText>
                  </InputGroup>
                  {errors.price && <FormFeedback>{errors.price.message}</FormFeedback>}
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
                <Col md='12' className='mb-1'>
                  <Label className='form-label' for='name'>
                    {i18n.t('Description')}
                  </Label>
                  <Controller
                    id='content'
                    name='content'
                    control={control}
                    render={({ field }) => <Input type="textarea" invalid={errors.content && true} {...field} />}
                  />
                  {errors.content && <FormFeedback>{errors.content.message}</FormFeedback>}
                </Col>
                <Col md='12' className='mb-1'>
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
                </Col>
                <Col className='text-center' xs={12}>
                  <Button type='submit' className='me-1 mt-2' color='primary'>
                    Submit
                  </Button>
                  <Button type='reset' className='mt-2' color='secondary' outline onClick={toggleModal}>
                    Discard
                  </Button>
                </Col>
              </Row>
            </Form>
        </ModalBody>
      </Modal>
      }
    </Fragment>
  )
}

export default NewOfferModal
