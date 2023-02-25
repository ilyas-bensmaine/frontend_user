// ** React Imports
import { Fragment, useEffect, useRef } from 'react'

// ** Reactstrap Imports
import { Button, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'

// ** Icons Imports
import { Briefcase, ShoppingCart, Award, ArrowLeft, ArrowRight } from 'react-feather'
import FeatherIcon from 'feather-icons-react'
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner'
import i18n from '../../../configs/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { loadFormOptions } from '../../../redux/formOptions'

const ProfissionsStep = ({ stepper, submitStepData }) => {
  const inputRef = useRef()
    //** Store
  const formOptions = useSelector(state => state.formOptions)
  const dispatch = useDispatch()
  // ** Effects
  useEffect(() => {
    const loadData = async () => {
      if (formOptions.isLoading) {
        dispatch(loadFormOptions())
      }
    }
    loadData()
  }, [])
  //** onChange Functions */
  const updatedSelectedUserProfession = (event) => {
    submitStepData({selectedUserProfession: event.target.value})
    stepper.next()
  }
  return (
    <Fragment>
      <div className='content-header'>
      <h5 className='mb-0'>{i18n.t('Profissions')}</h5>
        <small>{i18n.t('Sélectionnez votre profession')}</small>
      </div>
      { formOptions.isLoading ? <ComponentSpinner /> : (
        <ListGroup flush>
              { formOptions.user_professions?.map((userProfession, index) => { 
                return (
                  <ListGroupItem className='border-0 px-0' key={index}>
                    <Input type='radio' innerRef={inputRef} id={userProfession.label} 
                            value={userProfession.id} 
                            name='selectedUserProfession' 
                            onChange={updatedSelectedUserProfession}
                            className='custom-option-item-check'
                            defaultChecked={userProfession.id === 1}
                      />
                    <Label for={userProfession.name} className='custom-option-item d-flex cursor-pointer p-25'>
                      <span className='avatar avatar-tag bg-light-info me-1'>
                        <FeatherIcon icon={userProfession.icon}/>
                      </span>
                      <span className='d-flex align-items-center justify-content-between flex-grow-1'>
                        <div className='me-1'>
                          <h5 className='d-block fw-bolder'>{userProfession.label}</h5>
                          <span>{userProfession.description}</span>
                        </div>
                        <span>
                        </span>
                      </span>
                    </Label>
                  </ListGroupItem>
                )
              }) }
        </ListGroup>
      )}
      <div className='d-flex justify-content-between mt-2'>
        <Button color='secondary' outline disabled>
          <ArrowLeft size={14} className='rotate-rtl align-middle me-sm-50 me-0' />
          <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Précédent')}</div>
        </Button>
        <Button color='primary' onClick={() => stepper.next()}>
        <div className='align-middle d-sm-inline-block d-none'>{i18n.t('Suivant')}</div>
          <ArrowRight size={14} className='rotate-rtl align-middle ms-sm-50 ms-0' />
        </Button>
      </div>
    </Fragment>
  )
}

export default ProfissionsStep
