// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText, Badge, ListGroup, ListGroupItem, Button } from 'reactstrap'
// ** ReactTimeAgo
import ReactTimeAgo from 'react-time-ago'
import i18n, { getUserLanguage } from '../../configs/i18n'
const PricingCards = ({ plans, duration, currentPlan, bordered, fullWidth, cols }) => {
  const colsProps = cols ? cols : { md: 4, xs: 12 }

  const data = plans.filter((plan) => {
    return plan.periodicity_type === duration
})
  const renderPricingCards = () => {
    return data.map((item, index) => {
      // const  imgClasses = item.name === 'bronze' ? 'mb-2 mt-5' : item.name === 'silver' ? 'mb-1' : 'mb-2'
      return (
        <Col key={index} {...colsProps}>
          <Card
            className={classnames('text-center', {
              border: bordered,
              'shadow-none': bordered,
              // popular: item.popular === true,
              'border-primary': bordered && item.popular === true,
              [`${item.name.toLowerCase()}-pricing`]: item.name
            })}
          >
            <CardBody>
              {item.popular === true ? (
                <div className='pricing-badge text-end'>
                  <Badge color='light-primary' pill>
                    Popular
                  </Badge>
                </div>
              ) : null}
              {/* <img className={imgClasses} src={item.img} alt='pricing svg' /> */}
              <h3>{item.name}</h3>
              <CardText>{item.description}</CardText>
              <div className='annual-plan'>
                <div className='plan-price mt-2'>
                  {item.periodicity_type === 'Year' ? <div>
                  <sup className='font-medium-1 fw-bold text-primary me-25'>$</sup>
                  <span className={`pricing-${item.name.toLowerCase()}-value fw-bolder text-primary`}>
                        { Math.round((item.price / 12) / 100) * 100}
                      </span>
                  <span className='pricing-duration text-body font-medium-1 fw-bold ms-25'>/{i18n.t('Month')}</span>
                  </div>  : <div>
                  <sup className='font-medium-1 fw-bold text-primary me-25'>$</sup>
                  <span className={`pricing-${item.name.toLowerCase()}-value fw-bolder text-primary`}>
                        { item.price}
                      </span>
                  <span className='pricing-duration text-body font-medium-1 fw-bold ms-25'>/{i18n.t('Month')}</span></div>}
                </div>
                {item.periodicity_type === 'Year' ? (
                  <small className='annual-pricing text-muted'>{item.price} {i18n.t('DZD')}/{i18n.t('Year')}</small>
                ) : null}
              </div>
              <ListGroup tag='ul' className='list-group-circle text-start mb-2'>
                {item.features.map((benefit, i) => (
                  <ListGroupItem key={i} tag='li'>
                    {getUserLanguage() === 'fr' ? benefit.description : benefit.arabic_description} {benefit.consumable ?   ` : ${Math.floor(benefit.pivot.charges)} / ${i18n.t(benefit.periodicity_type)}`  : null}
                    {/* {benefit.description} {benefit.consumable ?   ` : ${Math.floor(benefit.pivot.charges)} / ${benefit.periodicity_type}`  : null} */}
                  </ListGroupItem>
                ))}
              </ListGroup>
              {item.id === currentPlan.plan_id &&
              <Button block outline={item.name !== 'Standard'} color={item.id === currentPlan.plan_id ? 'success' : 'primary'}>
                {item.id === currentPlan.plan_id && i18n.t('Votre abonnement actuel') } 
                <br></br>
                { item.id === currentPlan.plan_id && <small className='notification-text'>
               { i18n.t("s'expire")} <ReactTimeAgo date={currentPlan.expired_at} locale={ getUserLanguage() ? "fr" : 'ar'}/>
                </small> }
              </Button>
              }
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  const defaultCols = {
    sm: { offset: 2, size: 10 },
    lg: { offset: 2, size: 10 }
  }

  return (
    <Row className='pricing-card'>
      <Col {...(!fullWidth ? defaultCols : {})} className={classnames({ 'mx-auto': !fullWidth })}>
        <Row>{renderPricingCards()}</Row>
      </Col>
    </Row>
  )
}

export default PricingCards
