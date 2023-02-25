import React, { Fragment, useEffect } from 'react'

import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserData } from '../../../redux/authentication'
import useAxiosApi from '../../../axios/apis/useAxiosApi'
import toast from 'react-hot-toast'
import i18n, { getUserLanguage } from '../../../configs/i18n'

const FormSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    wilaya: yup.object().shape({
        value: yup.string().required('Wilaya is required'),
        label: yup.string().required()
    })
  })
const defaultValues = {
    name: '',
    email: '',
    wilaya: ''
}

export default function Account({selectedUser}) {
    // ** Hook
    const axiosInstance = useAxiosApi()
    const dispatch = useDispatch()
    const formOptions = useSelector(state => state.formOptions)
    //** States
    // const [wilayas, setWilayas] = useState([])
    //** Form
    const {
        control,
        reset,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(FormSchema) })
    //** Effect
    useEffect(() => {
        reset({
            name: selectedUser.name,
            email: selectedUser.email,
            wilaya: { value: selectedUser.wilaya?.id, label: getUserLanguage() === 'dz' ? selectedUser.wilaya?.arabic_name : selectedUser.wilaya?.name  }
        })
    }, [])
    //** Submit
    const onSubmit = async (data) => {
        try {
            await axiosInstance.post(`/api/users/update_validation/${selectedUser.id}`, data)
            dispatch(updateUserData({ dataToUpdate:data }))
            toast.success(i18n.t("Vous avez mis a jour vos informations avec succes"))
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
    
    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>{i18n.t('Informations sur le compte')}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for={`name`}>
                                {i18n.t('Nom et Prénom')}
                                </Label>
                                <Controller
                                    control={control}
                                    id='name'
                                    name='name'
                                    render={({ field }) => (
                                        <Input invalid={errors.name && true} {...field} />
                                    )}
                                />
                                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for={`email`}>
                                {i18n.t('Email')}
                                </Label>
                                <Controller
                                    control={control}
                                    id='email'
                                    name='email'
                                    render={({ field }) => (
                                        <Input type='email' invalid={errors.email && true} {...field} />
                                    )}
                                />
                                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='wilaya'>{i18n.t('Wilaya')}</Label>
                                <Controller
                                    control={control}
                                    id='wilaya'
                                    name='wilaya'
                                    render={({ field }) => (
                                        <Select
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': errors?.wilaya })}
                                            classNamePrefix='select'
                                            options={formOptions.wilayas}
                                            isClearable={false}
                                            value={field.value}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.wilaya?.value && <FormFeedback>{errors.wilaya?.value.message}</FormFeedback>}
                            </Col>
                            <Col xs={12}>
                                <Button type='submit' color='primary'>
                                {i18n.t('Sauvgarder')}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
