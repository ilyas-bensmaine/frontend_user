// ** React Imports
import { Fragment, useState } from 'react'

// ** Shop Components
import Sidebar from './sidebar'
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Styles
import '@styles/react/apps/app-ecommerce.scss'
import NewPostButton from '../../components/new-post'
import { Button } from 'reactstrap'
import { ArrowUp } from 'react-feather'
import PostsHeader from './PostsHeader'
import PostCards from './PostCards'
import { useDispatch, useSelector } from 'react-redux'
import { clearSidebarParams } from '../store'

const Shop = () => {
  // ** Store
  const dispatch = useDispatch()
  const store = useSelector(state => state.ecommerce)
  // ** States
  const [activeView, setActiveView] = useState('list')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarFilterApplied, setSidebarFilterApplied] = useState(true)
  const [sidebarFilterCleared, setSidebarFilterCleared] = useState(true)
  // ** Handlers
  const handleApplySidebarFilter = () => { setSidebarFilterApplied(!sidebarFilterApplied) }
  const handleClearSidebarFilter = () => { 
    dispatch(clearSidebarParams())
    setSidebarFilterCleared(!sidebarFilterCleared)
  }
  return (
    <Fragment>
      <div className='content-detached content-right'>
        <div className='content-body'>
          <PostsHeader
            totalResults={store.totalPosts}
            activeView={activeView}
            setActiveView={setActiveView}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
          <PostCards
            activeView={activeView}
            sidebarFilterApplied={sidebarFilterApplied}
            sidebarFilterCleared={sidebarFilterCleared}
          />
        </div>
      </div>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        applyFilter={handleApplySidebarFilter}
        clearFilter={handleClearSidebarFilter}
      />

    </Fragment>
  )
}
export default Shop
