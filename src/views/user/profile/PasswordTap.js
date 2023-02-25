import React, { Fragment } from 'react'

import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Row } from 'reactstrap'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useAxiosApi from '../../../axios/apis/useAxiosApi'
import i18n from '../../../configs/i18n'
const FormSchema = yup.object().shape({
    current_password: yup.string().required(),
    password: yup.string().min(8).required(),
    password_confirmation: yup
      .string()
      .min(8)
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  })
const defaultValues = {
    current_password: '',
    password: '',
    password_confirmation: ''
} 

export default function PasswordTab() {
    // ** Hook
    const axiosInstance = useAxiosApi()
    const MySwal = withReactContent(Swal)
    const {
        control,
        setError,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(FormSchema) })

    const onSubmit = async (data) => {
        try {
            await axiosInstance.put('/user/password', data)
            reset(defaultValues)
            MySwal.fire({
                icon: 'success',
                title: 'Success !',
                text: 'Password has been changed successfully.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
            })
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
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'> {i18n.t('Changer le mot de passe')} </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit, onError)}>
                        {/* <Alert color='warning' className='mb-2'>
                            <h4 className='alert-heading'>Ensure that these requirements are met</h4>
                            <div className='alert-body'>Minimum 8 characters long, uppercase & symbol</div>
                        </Alert> */}
                        <Row>
                            <Col className='mb-2' md={12}>
                                <Controller
                                    id='current_password'
                                    name='current_password'
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            label={i18n.t('Le mot de passe actuel')}
                                            htmlFor='current_password'
                                            className='input-group-merge'
                                            invalid={errors.current_password && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.current_password && <FormFeedback className='d-block'>{errors.current_password.message}</FormFeedback>}
                            </Col>
                            <Col className='mb-2' md={12}>
                                <Controller
                                    id='password'
                                    name='password'
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            label={i18n.t('Le nouveau mot de passe')}
                                            htmlFor='password'
                                            className='input-group-merge'
                                            invalid={errors.password && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.password && <FormFeedback className='d-block'>{errors.password.message}</FormFeedback>}
                            </Col>
                            <Col className='mb-2' md={12}>
                                <Controller
                                control={control}
                                id='password_confirmation'
                                name='password_confirmation'
                                render={({ field }) => (
                                    <InputPasswordToggle
                                    label={i18n.t('conformation du nouveau mot de passe')}
                                    htmlFor='password_confirmation'
                                    className='input-group-merge'
                                    invalid={errors.password_confirmation && true}
                                    {...field}
                                    />
                                )}
                                />
                                {errors.password_confirmation && (
                                <FormFeedback className='d-block'>{errors.password_confirmation.message}</FormFeedback>
                                )}
                            </Col>
                            <Col xs={12}>
                                <Button type='submit' color='primary'>
                                {i18n.t('Changer le mot de passe')}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
