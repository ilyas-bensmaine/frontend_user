import React, { Fragment } from 'react'
import { ChevronRight } from 'react-feather'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import i18n from '../../configs/i18n'
import { Link } from 'react-router-dom'

export default function Popups({popups, skipPopup}) {

  return (
    <Fragment>
        {popups.map((item) => {
            return (<Modal isOpen={true} toggle={() => skipPopup(item)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => skipPopup(item)}></ModalHeader>
                <ModalBody className='pb-3 px-sm-5 mx-50'>
                <h1 className='text-center mb-1'> {item.title}</h1>
                    <p className='text-center mb-2 mt-3'>
                        {item.content}
                        <br/>
                        <br/>
                    {
                        item.url ? <Link to={item.title}>
                                <span>{i18n.t(item.title)}</span>
                        </Link> : null
                    }
                    </p>
                    <Button color='primary' className='float-end mt-2' onClick={() => skipPopup(item)}>
                        <span className='me-50'>Continue</span>
                        <ChevronRight className='rotate-rtl' size={14} />
                    </Button>
                </ModalBody>
            </Modal>)
        })}
    </Fragment>
  )
}
