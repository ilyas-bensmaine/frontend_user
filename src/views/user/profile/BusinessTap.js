import React, { Fragment, useEffect } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import FeatherIcon from 'feather-icons-react'
// ** Custom Components
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import Select, {components} from 'react-select'
import Avatar from '@components/avatar'
// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import { Home, Check, X, Briefcase } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserData } from '../../../redux/authentication'
import withReactContent from 'sweetalert2-react-content'
// ** Third Party Components
import Swal from 'sweetalert2'
import useAxiosApi from '../../../axios/apis/useAxiosApi'
import { loadFormOptions } from '../../../redux/formOptions'
import i18n, { getUserLanguage } from '../../../configs/i18n'
import toast from 'react-hot-toast'
// import i18n from '../../../configs/i18n'
const MySwal = withReactContent(Swal)
const FormSchema = yup.object().shape({
        selectedCarType: yup.object().shape({
            value: yup.string().required('Wilaya is required'),
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
    selectedUserProfession: '',
    selectedCarType: '',
    selectedCarBrands: '',
    selectedPartCategories: ''
}

export default function BusinessTap({selectedUser}) {
    // ** Hook
    const axiosInstance = useAxiosApi()
    const dispatch = useDispatch()
    const formOptions = useSelector(state => state.formOptions)
    //** Form
    const {
        control,
        reset,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(FormSchema) })
    //** Effect
    useEffect(() => {
        const loadData = async () => {
            if (formOptions.isLoading) {
                dispatch(loadFormOptions())
            }
        }
        loadData()
        reset({
            selectedUserProfession: selectedUser.user_profession_id,
            selectedCarType: selectedUser.car_types?.map((item) => { return {value: item.id, label: getUserLanguage() === 'dz' ? item.arabic_name : item.name} }),
            selectedCarBrands: selectedUser.car_brands?.map((item) => { return {value: item.id, label: getUserLanguage() === 'dz' ? item.arabic_name : item.name} }),
            selectedPartCategories: selectedUser.part_categories?.map((item) => { return {value: item.id, label: getUserLanguage() === 'dz' ? item.arabic_name : item.name} })
        })
    }, [])
    //** Submit
    const onSubmit = async (formData) => {
        console.log(formData.selectedCarType.value)
        const dataToUpdate = {
            selectedUserProfession: formData.selectedUserProfession,
            selectedCarType: formData.selectedCarType.value, 
            selectedCarBrands: formData.selectedCarBrands.map((item) => { return item.value }), 
            selectedPartCategories: formData.selectedPartCategories.map((item) => { return item.value })
        }
        try {
            await axiosInstance.post('/api/users/register_validation/1', dataToUpdate)
            dispatch(updateUserData({ id:selectedUser.id, dataToUpdate }))
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
    const onError = errors => {
        console.log(errors)
    }
    const updatedSelectedUserProfession = (event) => {
        setValue('selectedUserProfession', event.target.value)
    }
    const CarBrandOptionsComponent = ({ data, ...props }) => {      
        return (
          <components.Option {...props}>
                <Avatar size='sm' img={data.logo} className='me-50'/>
                {data.label}
          </components.Option>
        )
    }

    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>{i18n.t("Infos sur la spécialité")}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit, onError)}>
                            <Col xs={12} className='mb-1'>
                                <Row className='custom-options-checkable'>
                                    { formOptions.user_professions?.map((item) => {
                                        return (
                                            <Col md={4} className='mb-md-0 mb-2' key={item.name}>
                                                <Input type='radio' id={item.name} 
                                                    value={item.id} 
                                                    name='selectedUserProfession' 
                                                    onChange={updatedSelectedUserProfession}
                                                    className='custom-option-item-check'
                                                    defaultChecked={item.id === selectedUser.user_profession_id}
                                                />
                                                <label className='custom-option-item px-2 py-1' htmlFor={item.name}>
                                                    <span className='d-flex align-items-center mb-50'>
                                                        <FeatherIcon icon={item.icon} className='me-1'/>
                                                        <span className='custom-option-item-title h4 fw-bolder mb-0'>
                                                            {getUserLanguage() === 'dz' ? item.arabic_name : item.name}
                                                        </span>
                                                    </span>
                                                    <span className='d-block'>
                                                        {getUserLanguage() === 'dz' ? item.arabic_description : item.description}
                                                    </span>
                                                </label>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='selectedCarType'> {i18n.t("Type de véhicules")} </Label>
                                <Controller
                                    control={control}
                                    id='selectedCarType'
                                    name='selectedCarType'
                                    render={({ field }) => (
                                        <Select
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': errors?.selectedCarType })}
                                            classNamePrefix='select'
                                            options={formOptions.car_types}
                                            isClearable={false}
                                            value={field.value.length !== 0 ? field.value[0] : null}
                                            {...field}
                                            isLoading={formOptions.isLoading}
                                        />
                                    )}
                                />
                                {errors.selectedCarType?.value && <FormFeedback>{errors.selectedCarType?.value.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='wilaya'>{i18n.t('Marques de véhicules')}</Label>
                                <Controller
                                    control={control}
                                    id='selectedCarBrands'
                                    name='selectedCarBrands'
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': errors?.selectedCarBrands })}
                                            classNamePrefix='select'
                                            options={formOptions.car_brands}
                                            components={{
                                                Option: CarBrandOptionsComponent
                                            }}
                                            isClearable={false}
                                            value={field.value}
                                            {...field}
                                            isLoading={formOptions.isLoading}
                                        />
                                    )}
                                />
                                {errors.selectedCarBrands?.value && <FormFeedback>{errors.selectedCarBrands?.value.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='selectedPartCategories'>{i18n.t('Catégories de pièces')}</Label>
                                <Controller
                                    control={control}
                                    id='selectedPartCategories'
                                    name='selectedPartCategories'
                                    render={({ field }) => (
                                        <Select
                                            isMulti
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': errors?.selectedPartCategories })}
                                            classNamePrefix='select'
                                            options={formOptions.part_categories}
                                            isClearable={false}
                                            value={field.value}
                                            {...field}
                                            isLoading={formOptions.isLoading}
                                        />
                                    )}
                                />
                                {errors.selectedPartCategories?.value && <FormFeedback>{errors.selectedPartCategories?.value.message}</FormFeedback>}
                            </Col>
                            <Col xs={12}>
                                <Button type='submit' color='primary'>
                                   {i18n.t('Sauvgarder')}
                                </Button>
                            </Col>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
