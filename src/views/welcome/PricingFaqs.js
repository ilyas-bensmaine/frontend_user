// ** Reactstrap Imports
import { Row, Col, AccordionBody, AccordionItem, AccordionHeader, UncontrolledAccordion } from 'reactstrap'
import i18n from '../../configs/i18n'

const PricingFaqs = ({ data }) => {
  return (
   
     data.length > 0 ? <div className='pricing-faq'>
      <h3 className='text-center'>{i18n.t("FAQ's")}</h3>
      <p className='text-center mb-0'>{('')}</p>
      <Row className='mt-75 mb-2'>
        <Col className='mx-auto' sm='12' lg={{ size: 10, offset: 2 }}>
          <UncontrolledAccordion className='accordion-margin mt-2'>
            {data.map((r, index) => {
              return (
                <AccordionItem key={index + 1}>
                  <AccordionHeader tag='h2' targetId={String(index + 1)}>
                    { r.question}
                  </AccordionHeader>
                  <AccordionBody accordionId={String(index + 1)}>{r.response}</AccordionBody>
                </AccordionItem>
              )
            })}
          </UncontrolledAccordion>
        </Col>
      </Row>
    </div> :  <div></div>
  )
}

export default PricingFaqs
