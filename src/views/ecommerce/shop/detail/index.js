// ** React Imports
import { useEffect, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

// ** Product detail components
import Post from './PostDetails'

// ** Reactstrap Imports
import { Alert, Card, CardBody } from 'reactstrap'
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner'
// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

import '@styles/base/pages/app-ecommerce-details.scss'
import { getSelectedPost } from '../../store'
import i18n from '../../../../configs/i18n'
import ResponsesList from '../offers/list'

const PostDetails = () => {
  // ** Vars
  const {id} = useParams()

  // ** Store 
  const dispatch = useDispatch()
  const selectedPost = useSelector(state => state.ecommerce.selectedPost)

  useEffect(() => {
    dispatch(getSelectedPost(id))
  }, [])

  return (
    <Fragment>
      <div className='app-ecommerce-details'>
          <>
            <Card>
              <CardBody>
                { selectedPost === null ? <ComponentSpinner /> : (
                  selectedPost !== undefined ? (<>
                      <Post selectedPost={selectedPost}/>
                      {/* <ResponsesList /> */}
                    </>) : <Alert color='danger'>
                      <h4 className='alert-heading'>{i18n.t('Demand non trouvé')}</h4>
                      <div className='alert-body'>
                        {i18n.t('Demand non trouvé')} <Link to='/gallery/posts'>{i18n.t('retourner au marché')}</Link>
                      </div>
                  </Alert>
                )}
              </CardBody>
            </Card>
          </>
      </div>
    </Fragment>
  )
}

export default PostDetails
