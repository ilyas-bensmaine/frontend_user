// ** Reactstrap Imports
import { Input } from 'reactstrap'
import i18n from '../../configs/i18n'

const PricingHeader = ({ duration, setDuration }) => {
  const onChange = e => {
    if (e.target.checked) {
      setDuration('Year')
    } else {
      setDuration('Month')
    }
  }

  return (
    <div className='text-center'>
      <h1 className='mt-5'>{i18n.t('Nos Plans')}</h1>
      <p className='mb-2 pb-75'>
       {i18n.t('Choissisez le plan qui vous arronge')}
      </p>
      <div className='d-flex align-items-center justify-content-center mb-5 pb-50'>
        <h6 className='me-50 mb-0'>{i18n.t('Month')}</h6>
        <div className='form-switch'>
          <Input id='plan-switch' type='switch' checked={duration === 'Year'} onChange={onChange} />
        </div>
        <h6 className='ms-50 mb-0'>{i18n.t('Year')}</h6>
      </div>
    </div>
  )
}

export default PricingHeader
