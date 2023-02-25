/* eslint-disable */
// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Lock } from 'react-feather'
// ** Reactstrap Imports
import { CardText, Button, Form, Input, InputGroup, InputGroupText, Row } from 'reactstrap'
// ** Firebase phone auth
import { firebaseAuth } from '../../../firebase-config'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
// ** Utils 
import { handleSuccessAlert, handleErrorAlert } from '../../../utility/GlobalAlrets'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import i18n from '../../../configs/i18n'
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner'
export default function PhoneVerification({ stepper, phoneNumber, stepData }) {
    const [OTP, setOTP] = useState()
    const [loading, setLoading] = useState(false)
    const [isRequestedOTP, setIsRequestedOTP] = useState(false)

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        }, firebaseAuth)
    }, [])
    const {
        control,
        setValue,
      } = useForm({
        defaultValues: {OTP: ''}
      })

    const handleRequestOTP = (e) => {
        setLoading(true)
        e.preventDefault()
        signInWithPhoneNumber(firebaseAuth, phoneNumber, window.recaptchaVerifier)
        .then((ConfirmationResulat) => {
            window.confirmationResulat = ConfirmationResulat
            setIsRequestedOTP(true)
        }).catch((error) => {
            console.log(error)
        })
        console.log('OTP has been requested !!')
        setLoading(false)
    }
    const OTPUpdated = (e) => {
        let otp = e.target.value
        console.log(otp)
        if(otp.length === 6) {
            window.confirmationResulat?.confirm(otp).then((result) => {
                handleSuccessAlert(i18n.t('Jolie !'), i18n.t('le code de confirmation est correct'), () => {
                    stepData()
                })
            }).catch((error) => {
                handleErrorAlert(i18n.t('Oops !'), i18n.t('le code de confirmation est incorrect'), () => {
                    setValue('OTP', '')
                    console.log(error)
                })
            })
        }
    }

    return (
        <Fragment>
            <div className='content-header mb-2'>
                <h2 className='fw-bolder mb-75'>{i18n.t('Informations sur le compte')}</h2>
                <span> {i18n.t('Nous avons envoyé un code de vérification sur votre mobile. Entrez le code depuis votre mobile dans le champ ci-dessous.')} </span>
            </div>
            <CardText className='fw-bolder mb-2'>
                {phoneNumber ? '+213*******'+phoneNumber.substr(10) : '**********'}
            </CardText>
            <Row className='mt-2'>
                <h6>{i18n.t('Tapez votre code de sécurité de 6 chiffres')}</h6>
                <div className='auth-input-wrapper d-flex align-items-center justify-content-between'>
                <InputGroup className='mb-25'>
                    <InputGroupText>
                        <Lock size={14} />
                    </InputGroupText>
                    <Controller
                        id='OTP'
                        name='OTP'
                        control={control}
                        render={({ field: {value, onChange} }) => 
                            <Input autoFocus={isRequestedOTP} 
                                    // disabled={!isRequestedOTP} 
                                    className='numeral-mask' 
                                    maxLength='6' 
                                    onChange={OTPUpdated}
                                    value={OTP} 
                            />
                        }
                    />
                </InputGroup>
                </div>
                <p className='text-center mt-25'>
                <span>{i18n.t("Vous n'avez pas eu le code ?")}</span>{' '}
                <a href='/' onClick={e => e.preventDefault() }>
                   {i18n.t('Renvoyez le code')}
                </a>{' '}
                <span> {i18n.t('Ou')} </span>{' '}
                <a href='/' onClick={e => e.preventDefault()}>
                {i18n.t('contactez-nous')}
                </a>
                </p>
                <div className='d-flex justify-content-between mt-2'>
                    <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
                        <ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
                        <span className='align-middle d-sm-inline-block d-none'>{i18n.t('Précédent')}</span>
                    </Button>
                    { loading ? <ComponentSpinner /> : 
                    (<Button color='primary' className='btn-next' disabled={isRequestedOTP} onClick={handleRequestOTP}>
                        <span className='align-middle d-sm-inline-block d-none'>
                            {isRequestedOTP ? i18n.t('Le code est envoyé' ): i18n.t('Envoyer le code')}
                        </span>
                        <Check size={14} rtl={false} className='align-middle ms-sm-25 ms-0'></Check>
                    </Button>)
                    }
                </div>
            </Row>
            <div id='recaptcha-container'></div>
        </Fragment>
      )
}
