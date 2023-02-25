// ** React Imports
/*eslint-disable*/
import { Link, useNavigate } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { Star, ShoppingCart, Heart, MapPin, Clock, Eye, Bookmark, Send, List } from 'react-feather'
import AvatarGroup from '@components/avatar-group'
import LinesEllipsis from 'react-lines-ellipsis'
// ** Reactstrap Imports
import { Card, CardBody, CardText, Button, Badge, CardLink, UncontrolledTooltip } from 'reactstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NewOfferModal from './offers/NewOfferModal'
import { getMorePosts, getPosts, handleHeaderParamsUpdates, handleSavingPost, handleUnSavingPost } from '../store'
import ReactTimeAgo from 'react-time-ago'
import i18n, { getUserLanguage } from '../../../configs/i18n'
import useUserData from '../../../utility/hooks/useUserData'
import EditOfferModal from './offers/EditOfferModal'

const PostCards = ({ activeView, sidebarFilterApplied, sidebarFilterCleared }) => {
  // ** Hooks
  const userData = useUserData()
  const navigate = useNavigate()
  // ** store
  const posts = useSelector(state => state.ecommerce.posts)
  const refreshPosts = useSelector(state => state.ecommerce.refreshPosts)
  const headerParams = useSelector(state => state.ecommerce.headerParams)
  const sidebarParams = useSelector(state => state.ecommerce.sidebarParams)
  const dispatch = useDispatch()
  // ** states
  const [selectedPostForNew, setSelectedPostForNew] = useState(null)
  const [selectedPostForEdit, setSelectedPostForEdit] = useState(null)
  const [openNewOfferModal, setOpenNewOfferModel] = useState(false)
  const [openEditOfferModal, setOpenEditOfferModel] = useState(false)
  // ** toggles
  const toggleNewOfferModal = (item) => {
    setSelectedPostForNew(item)
    setOpenNewOfferModel(!openNewOfferModal)
  }  
  const toggleEditOfferModal = (item) => {
    setSelectedPostForEdit(item)
    setOpenEditOfferModel(!openEditOfferModal)
  }
  const toggleSavingPost = (item) => {
    if (item.saved) {
      dispatch(handleUnSavingPost(item.id))
    } else {
      dispatch(handleSavingPost(item.id))
    }
  }
  // ** useEffect
  useEffect(() => {
    const loadData = async () => {
      console.log(sidebarParams)
      dispatch(handleHeaderParamsUpdates({ page: 1,hasMore: true }))
      dispatch(getPosts({headerParams, sidebarParams}))
    }
    loadData()
  }, [refreshPosts, sidebarFilterApplied, sidebarFilterCleared])
  // ** FetchData
  const fetchPosts = async () => {
    dispatch(getMorePosts({headerParams, sidebarParams}))
  }
  // ** Renders posts
  const renderPosts = () => { 
      return <Fragment>
        { posts.length ? ( <InfiniteScroll
          dataLength={posts.length}
          component='div'
          loader={
            <div className='d-flex justify-content-center mt-2'>
              <ComponentSpinner/>
            </div>            
          }
          next={fetchPosts}
          hasMore={headerParams.hasMore}
          endMessage={
            <div className='d-flex justify-content-center mt-2'>
              <p>No more Posts</p>
            </div>
          }
        >
          {( posts.map(item => {
                const CartBtnTag = item.isInCart ? Link : 'button'
                return (<>
                <Card className='ecommerce-card' key={item.id}>
                    <div className='item-img text-center mx-auto'>
                      <Link to={`/gallery/posts/details/${item.id}`}>
                        <img className='img-fluid card-img-top' 
                          src={item.media.length ? item.media[0].original_url : null} 
                          alt={item.title} 
                        />
                      </Link>
                    </div>
                    <CardBody>
                      <div className='item-wrapper'>
                        <div className='item-rating'>
                          {
                            item.car_types?.map(car_type => {
                              return <Badge key={`${item.id}-car-type-${car_type.id}`} color='light-warning me-25 mb-25'>{car_type.name}</Badge>
                            })
                          }
                          {
                            item.part_categories?.map(part_category => {
                              return <Badge key={`${item.id}-part-category-${part_category.id}`} color='light-success me-25 mb-25'>{part_category.name}</Badge>
                            })
                          }
                          {
                            item.part_sub_categories?.map(part_sub_category => {
                              return <Badge key={`${item.id}-part-sub-category-${part_sub_category.id}`} color='light-success me-25 mb-25'>{part_sub_category.name}</Badge>
                            })
                          }
                        </div>
                        <div className='item-cost'>
                          <h6 className='item-price'>${item.price}</h6>
                        </div>
                      </div>
                      <h6 className='item-name'>
                        <Link className='text-body' to={`/gallery/posts/details/${item.id}`}>
                          {item.title}
                        </Link>
                        <CardText tag='span' className='item-company'>
                          <AvatarGroup data={item.car_brands?.map(car_brand => {
                             return {
                              size:'sm',
                              title:car_brand.name,
                              img:car_brand.logo
                              } 
                            })} />
                           
                        </CardText>
                        <div>
                           {
                             item.car_models?.map(car_model => {
                               return <Badge key={`${item.id}-car-model-${car_model.id}`} color='light-warning me-25 mb-25'>{car_model.name}</Badge>
                              })
                            }
                            </div>
                      </h6>
                      <CardText className='item-description'>
                        <LinesEllipsis
                          text={item.content}
                          maxLine='1'
                          ellipsis={
                            <CardLink href={`/gallery/posts/details/${item.id}`} target='_blank'>
                              {i18n.t(' ...plus')}
                            </CardLink>
                          }
                          trimRight
                          basedOn='letters'
                        />
                        <hr/>
                        <div>
                          {
                            item.viewers_count ? (<>
                            <Badge color='primary' className='me-25' id={`vues-${item.id}`}>
                              <Eye size={14} className='align-middle me-25' />
                              <span className='align-middle'>{item.viewers_count}</span>
                            </Badge>
                            <UncontrolledTooltip placement='bottom' target={`vues-${item.id}`}>
                              {i18n.t(`Nombre des vues`)}
                            </UncontrolledTooltip>
                            </>) : null
                          }
                          <>
                            <Badge color='primary' className='me-25' id={`location-${item.id}`}>
                              <MapPin size={14} className='align-middle me-25' />
                              <span className='align-middle'>{item.wilaya?.name}</span>
                            </Badge>
                            <UncontrolledTooltip placement='bottom' target={`location-${item.id}`}>
                                {i18n.t(`Wilaya`)}
                            </UncontrolledTooltip>                        
                          </>
                          <Badge color='secondary'>
                            <Clock size={14} className='align-middle me-25' />
                            <span className='align-middle'>
                              <ReactTimeAgo date={item.created_at} locale={ getUserLanguage() }/>
                            </span>
                          </Badge>
                        </div>
                      </CardText>
                    </CardBody>
                    <div className='item-options text-center'>
                      <div className='item-wrapper'>
                        <div className='item-cost'>
                          <h4 className='item-price'>${item.price}</h4>
                        </div>
                      </div>
                      <Button className='btn-wishlist' color='light' onClick={() => toggleSavingPost(item)}>
                      <Bookmark className={classnames('me-50', { 'text-danger': item.saved})} size={14}/>
                        <span>{item.savers_count} </span>
                      </Button>
                      {
                        item.user_id === userData.id ? (<Link to={`/gallery/posts/details/${item.id}`} target='_blank'>
                          <Button color='warning' className='btn-cart move-cart'>
                            <List className='me-50' size={14} />
                            <span>{i18n.t('Visualiser les offres')} ({item.post_responses_count})</span>
                          </Button>
                      </Link>) : !item.responded ? (<Button color={'success'} className='btn-cart move-cart' onClick={() => toggleNewOfferModal(item)}>
                        <Send className='me-50' size={14} />
                        <span>{i18n.t('Offrir')} ({item.post_responses_count})</span>
                      </Button>) : (<Button color='primary' className='btn-cart move-cart' onClick={() => toggleEditOfferModal(item)}>
                        <Send className='me-50' size={14} />
                        <span>{i18n.t("Modifier l'offre")} ({item.post_responses_count})</span>
                      </Button>)
                      }
                    </div>
                  </Card>
                  </>
                )
              })
  
            )}
      </InfiniteScroll>) 
          : (<div className='d-flex justify-content-center mt-2'>
            <p>No Results</p>
          </div>)
        }

      </Fragment>
  }

  return (
    <Fragment>
      <div
        className={classnames({
          'grid-view': activeView === 'grid',
          'list-view': activeView === 'list'
        })}
      >
        {renderPosts()}
      </div>
      <NewOfferModal open={openNewOfferModal} toggleModal={toggleNewOfferModal} selectedPost={selectedPostForNew} />
      <EditOfferModal open={openEditOfferModal} toggleModal={toggleEditOfferModal} selectedPost={selectedPostForEdit} />
    </Fragment>
  )
}

export default PostCards
