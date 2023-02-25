// ** Third Party Components
import { useTranslation } from 'react-i18next'
import ReactCountryFlag from 'react-country-flag'
/*eslint-disable*/
// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

// ** Costum Hooks
import { useRTL } from '../../../../utility/hooks/useRTL'
import { useNavigate } from 'react-router-dom'
import useAxiosApi from '../../../../axios/apis/useAxiosApi'
import useUserData from '../../../../utility/hooks/useUserData'
import { useDispatch } from 'react-redux'
import { handleFormOptionsPurge } from '../../../../redux/formOptions'

const IntlDropdown = () => {
  // ** Hooks
  const user = useUserData()
  const axiosInstance = useAxiosApi()
  const { i18n } = useTranslation()
  const [isRtl, setIsRtl] = useRTL()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // ** Vars
  const langObj = {
    en: i18n.t('English'),
    dz: i18n.t('Arabic'),
    fr: i18n.t('French')
  }
  // ** Function to switch Language
  const handleLangUpdate = async (e, lang) => {
    e.preventDefault()
    if (lang === 'dz' && !isRtl) {
      setIsRtl(true)
    } 
    if (lang !== 'dz' && isRtl) {
      setIsRtl(false)
    }
    // Load Language in frontend
    i18n.changeLanguage(lang)
    dispatch(handleFormOptionsPurge({}))
    // Load Language to the backend
    if (user) {
      try {
        // await axiosInstance.post('api/users/change_language', {lang})
      } catch (error) {
        console.log(error)
      }
    }
    navigate(0)
  }

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}>
        <ReactCountryFlag
          className='country-flag flag-icon'
          countryCode={i18n.language === 'fr' ? 'fr' : i18n.language}
        />
        <span className='selected-language'>{langObj[i18n.language]}</span>
      </DropdownToggle>
      <DropdownMenu className='mt-0' end>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'dz')}>
          <ReactCountryFlag className='country-flag' countryCode='dz'/>
          <span className='ms-1'>{i18n.t('Arabic')}</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'fr')}>
          <ReactCountryFlag className='country-flag' countryCode='fr'/>
          <span className='ms-1'>{i18n.t('French')}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
