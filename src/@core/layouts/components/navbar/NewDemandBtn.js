import React, { Fragment, useState } from 'react'
import { Button } from 'reactstrap'
import i18n from '../../../../configs/i18n'
import NewDemandModal from '../../../../views/ecommerce/shop/demands/NewDemandModal'

export default function NewDemandBtn() {
    // ** States
    const [openNewDemandModal, setOpenNewDemandModal] = useState(false)
    const toggleNewDemandModal = () => { setOpenNewDemandModal(!openNewDemandModal) }
  return (
    <Fragment>
        <Button.Ripple color="warning" className='mx-1' onClick={() => {
            toggleNewDemandModal()
        }}>
            {i18n.t('Ajouter une demande')}
        </Button.Ripple>
        <NewDemandModal open={openNewDemandModal} toggleModal={toggleNewDemandModal}></NewDemandModal>
    </Fragment>
  )
}
