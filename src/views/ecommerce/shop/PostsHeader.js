// ** Third Party Components
import classnames from 'classnames'
import { Fragment, useState } from 'react'
import { Menu, Grid, List, Search } from 'react-feather'
import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  InputGroup,
  Input,
  InputGroupText
} from 'reactstrap'
import { handleHeaderParamsUpdates, handleRefreshPosts } from '../store'

const PostsHeader = props => {
  // ** store
  const dispatch = useDispatch()
  // ** Props
  const { totalResults, activeView, setActiveView, setSidebarOpen, sidebarOpen } = props
  const sortOptions = [
    {text:'Highest', param:'-price'},
    {text:'lowest', param:'price'},
    {text:'Newest', param:'-created_at'},
    {text:'Oldest', param:'created_at'}
  ]
  const [selectedSortOption, setSelectedSortOption] = useState({text:'Newest', param:'created_at'})

  return (
    <Fragment>
      <div className='ecommerce-header'>
        <Row>
          <Col sm='12'>
            <div className='ecommerce-header-items'>
              <div className='result-toggler'>
                <button className='navbar-toggler shop-sidebar-toggler' onClick={() => setSidebarOpen(true)}>
                  <span className='navbar-toggler-icon d-block d-lg-none'>
                    <Menu size={14} />
                  </span>
                </button>
                <span className='search-results'>{totalResults} Results Found</span>
              </div>
              <div className='view-options d-flex'>
                <UncontrolledButtonDropdown className='dropdown-sort'>
                  <DropdownToggle className='text-capitalize me-1' color='primary' outline caret>
                    {selectedSortOption.text}
                  </DropdownToggle>
                  <DropdownMenu>
                    {sortOptions.map((item) => { 
                      return <DropdownItem key={item.text} className='w-100' onClick={() => {
                          setSelectedSortOption(item)
                          dispatch(handleRefreshPosts())
                          dispatch(handleHeaderParamsUpdates({sort: item.param}))
                        }}>
                        {item.text}
                      </DropdownItem>
                    })}
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                <ButtonGroup>
                  <Button
                    tag='label'
                    className={classnames('btn-icon view-btn grid-view-btn', {
                      active: activeView === 'grid'
                    })}
                    color='primary'
                    outline
                    onClick={() => setActiveView('grid')}
                  >
                    <Grid size={18} />
                  </Button>
                  <Button
                    tag='label'
                    className={classnames('btn-icon view-btn list-view-btn', {
                      active: activeView === 'list'
                    })}
                    color='primary'
                    outline
                    onClick={() => setActiveView('list')}
                  >
                    <List size={18} />
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
          className={classnames('body-content-overlay', {
            show: sidebarOpen
          })}
          onClick={() => setSidebarOpen(false)}
        ></div>
      {/* Search--Bar */}
      <div id='ecommerce-searchbar' className='ecommerce-searchbar'>
        <Row className='mt-1'>
          <Col sm='12'>
            <InputGroup className='input-group-merge'>
              <Input
                className='search-product'
                placeholder='Search Post'
                onChange={e => console.log(e.target.value)}
              />
              <InputGroupText>
                <Search className='text-muted' size={14} />
              </InputGroupText>
            </InputGroup>
          </Col>
        </Row>
      </div>
      <div className={classnames('body-content-overlay', { show: sidebarOpen })}
          onClick={() => setSidebarOpen(false)}
        ></div>
    </Fragment>
  )
}

export default PostsHeader
