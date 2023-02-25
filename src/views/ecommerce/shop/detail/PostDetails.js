// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { Star, ShoppingCart, DollarSign, Heart, Share2, Facebook, Twitter, Youtube, Instagram, MapPin, Eye, Clock, Bookmark } from 'react-feather'
import AvatarGroup from '@components/avatar-group'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  CardText,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Badge
} from 'reactstrap'
import ReactTimeAgo from 'react-time-ago'
import { getUserLanguage } from '../../../../configs/i18n'
import { useDispatch } from 'react-redux'
import { handleSavingPost, handleUnSavingPost } from '../../store'

const Post = ({selectedPost}) => {
  // ** Store
  const dispatch = useDispatch()
  // ** Condition btn tag
  const CartBtnTag = selectedPost.isInCart ? Link : 'button'

  const toggleSavingPost = (post) => {
    if (post.saved) {
      dispatch(handleUnSavingPost(post.id))
    } else {
      dispatch(handleSavingPost(post.id))
    }
  }

  return (
    <Row className='my-2'>
      <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='5' xs='12'>
        <div className='d-flex align-items-center justify-content-center'>
          <img className='img-fluid product-img' src={selectedPost.media.length ? selectedPost.media[0].original_url : null} alt={selectedPost.title} />
        </div>
      </Col>
      <Col md='7' xs='12'>
        <h4>{selectedPost.title}</h4>
        <AvatarGroup data={selectedPost.car_brands?.map(car_brand => {
                             return {
                              size:'sm',
                              title:car_brand.name,
                              img:car_brand.logo
                              } 
                            })} />

        <div className='item-wrapper'>
        <div>
                           {
                             selectedPost.car_models?.map(car_model => {
                               return <Badge key={`${selectedPost.id}-car-model-${car_model.id}`} color='light-warning me-25 mb-25'>{car_model.name}</Badge>
                              })
                            }
                            </div>
            <div className='item-rating'>
              {
                selectedPost.car_types?.map(car_type => {
                  return <Badge key={car_type.id} color='light-warning me-25 mb-25'>{car_type.name}</Badge>
                })
              }
            </div>
            <div>
              {
                selectedPost.part_categories?.map(part_category => {
                  return <Badge key={part_category.id} color='light-success me-25 mb-25'>{part_category.name}</Badge>
                })
              }
              
              {
                selectedPost.part_sub_categories?.map(part_sub_category => {
                  return <Badge key={`${selectedPost.id}-part-sub-category-${part_sub_category.id}`} color='light-success me-25 mb-25'>{part_sub_category.name}</Badge>
                })
              }
            </div>
          </div>
        <div className='ecommerce-details-price d-flex flex-wrap mt-1'>
          <h4 className='item-price me-1'>${selectedPost.price}</h4>
        </div>
        <CardText className='mt-2 '>{selectedPost.content}</CardText>
        <ul className='product-features list-unstyled'>
            <li>
              <MapPin size={19} />
              <span>{selectedPost.wilaya.name}</span>
            </li>            
            <li>
              <Eye size={19} />
              <span>{selectedPost.viewers_count}</span>
            </li>            
            <li>
              <Clock size={19} />
              <span>
                <ReactTimeAgo date={selectedPost.created_at} locale={ getUserLanguage() }/>
              </span>
            </li>
        </ul>
        <div className='d-flex flex-column flex-sm-row pt-1'>
          <Button className='btn-wishlist me-0 me-sm-1 mb-1 mb-sm-0' color='secondary' outline 
            onClick={() => toggleSavingPost(selectedPost)}>
              <Bookmark className={classnames('me-50', { 'text-danger': selectedPost.saved})} size={14}/>
              <span>{selectedPost.savers_count} </span>
          </Button>
          <Button
            tag={CartBtnTag}
            className='btn-cart me-0 me-sm-1 mb-1 mb-sm-0'
            color='primary'
            onClick={e => e.preventDefault()}
            /*eslint-disable */
            {...(selectedPost.isInCart
              ? {
                  to: '/apps/ecommerce/checkout'
                }
              : {})}
            /*eslint-enable */
          >
            <ShoppingCart className='me-50' size={14} />
            {selectedPost.isInCart ? 'View in cart' : 'Move to cart'}
          </Button>
          <UncontrolledButtonDropdown className='dropdown-icon-wrapper btn-share'>
            <DropdownToggle className='btn-icon hide-arrow' color='secondary' caret outline>
              <Share2 size={14} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                <Facebook size={14} />
              </DropdownItem>
              <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                <Twitter size={14} />
              </DropdownItem>
              <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                <Youtube size={14} />
              </DropdownItem>
              <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                <Instagram size={14} />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      </Col>
    </Row>
  )
}

export default Post
