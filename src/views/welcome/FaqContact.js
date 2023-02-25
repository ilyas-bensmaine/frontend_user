// ** Icons Imports
import { PhoneCall } from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody } from 'reactstrap'
import i18n from '../../configs/i18n'

const FaqContact = () => {
  return (
    <div className='faq-contact'>
      <Row className='mt-5 pt-75'>
        <Col className='text-center' sm='12'>
          <h2> {i18n.t("Vous avez d'autres questions?")} </h2>
          <p className='mb-3'>
            {i18n.t("N'hésitez pas à nous contacter par téléphone")}
          </p>
        </Col>
        <Col sm='6'>
          <Card className='text-center faq-contact-card shadow-none py-1'>
            <CardBody dir='ltr'>
            <a href="tel:0771030026">
              <div className='avatar avatar-tag bg-light-primary mb-2 mx-auto'>
                <PhoneCall size={18} />
              </div> 
              07 71 03 00 26
            </a>
            </CardBody>
          </Card>
        </Col>
        <Col sm='6'>
          <Card className='text-center faq-contact-card shadow-none py-1'>
            <CardBody dir='ltr'>
            <a href="tel:065943798">
              <div className='avatar avatar-tag bg-light-primary mb-2 mx-auto'>
                <PhoneCall size={18} />
              </div> 
              06 59 40 37 98
            </a>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default FaqContact
