// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Third Party Components


// ** Demo Components
import PricingFaqs from './PricingFaqs'
import PricingCards from './PricingCards'
import PricingHeader from './PricingHeader'

// ** Styles
import '@styles/base/pages/page-pricing.scss'
import MediaPlayerVideo from './VideoCard'
import Popups from '../popups'
import CompleteInformationsModal from '../first-login/CompleteInformationsModal'
import KnowledgeBase from './knowledge-base/KnowledgeBase'
import useAxiosApi from '../../axios/apis/useAxiosApi'
import i18n, { getUserLanguage } from '../../configs/i18n'
import useUserData from '../../utility/hooks/useUserData'
import PlanCard from '../user/profile/PlanCard'
import FaqContact from './FaqContact'


const WelcomePage = () => {
  // ** Hook
  const axiosInstance = useAxiosApi()

  const currentPlan = useUserData()
  const userData = useUserData()
  // ** States
  const [plans, setPlans] = useState([]),
        [faq, setFaq] = useState([]),
        [duration, setDuration] = useState('Month'),  
        [popups, setPopups] = useState([]),
        [completeInformationModal, setCompleteInformationModal] = useState(false)
              
  const toggleCompleteInformationsModal = () => {
    setCompleteInformationModal(!completeInformationModal)
  }
  useEffect(() => {
      const loadData = async () => {
        try {
          const popupsRes = await axiosInstance.get('api/popups')
          if (popupsRes.data.length !== 0) {
            const mappedPopups = popupsRes.data.map((item) => {
              return {...item, openPopup: true}
            })
            setPopups(mappedPopups)
          }

          const faqRes = await axiosInstance.get('api/faqs')
          const feqData = faqRes.data.map((item) => { 
                              return {  
                                          ...item, 
                                          question : getUserLanguage() === 'fr' ? item.question : item.arabic_question,
                                          response : getUserLanguage() === 'fr' ? item.response : item.arabic_response
                                      }
                            })
          setFaq(feqData)

          const plansRes = await axiosInstance.get('api/plans')
          const planData = plansRes.data.map((item) => {
                            return {
                                      ...item,
                                       description : getUserLanguage() === 'fr' ? item.description : item.arabic_description
                                    }
                            })
          setPlans(planData)
        } catch (error) {
          console.log(error)
        }
      }

      const handleFirstLoginFromBackend = async () => {
        try {
          await axiosInstance.get('/api/users/first_login')
        } catch (error) {
          console.log(error)
        }
      }
      loadData()
      if (userData?.is_first_login) {
        handleFirstLoginFromBackend()
        setCompleteInformationModal(true)
      }
  }, [])

  const handleSkipPopups = async (skippedPopup) => {
    setPopups(popups.filter(item => item.id !== skippedPopup.id))
    await axiosInstance.put(`/api/popups/mark_as_seen/${skippedPopup.id}`)
  }

  return (
    <div id='pricing-table'>
        <Fragment>
          <MediaPlayerVideo></MediaPlayerVideo>
          <KnowledgeBase/>
          <PricingHeader duration={duration} setDuration={setDuration} />
          <PricingCards plans={plans} duration={duration} currentPlan={currentPlan ?? 0 }/>
          <div className='text-center'>
            <h1 className='mt-5'>{i18n.t('Plan actuel')}</h1>
          </div>
          <PlanCard selectedUser={userData} />
          <PricingFaqs data={faq} />
          <FaqContact />
        </Fragment>
        <Popups popups={popups} skipPopup={handleSkipPopups}/>
        <CompleteInformationsModal open={completeInformationModal} toggleModal={toggleCompleteInformationsModal}></CompleteInformationsModal>
    </div>
  )
}

export default WelcomePage

