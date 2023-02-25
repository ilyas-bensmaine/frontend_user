// ** React Imports
import { Fragment } from 'react'

// ** Post components
import PostCards from './PostCards'
import PostsHeader from './PostsHeader'
import PostsSearchbar from './PostsSearchbar'

// ** Third Party Components

// ** Reactstrap Imports
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

const PostsPage = props => {
  // ** Props
  const {posts, activeView} = props

  return (
    <Fragment>
      {posts.length ? (
        <Fragment>
          <PostCards
            posts={posts}
            // store={store}
            // dispatch={dispatch}
            // addToCart={addToCart}
            activeView={activeView}
            // getPosts={getPosts}
            // getCartItems={getCartItems}
            // addToWishlist={addToWishlist}
            // deleteCartItem={deleteCartItem}
            // deleteWishlistItem={deleteWishlistItem}
          />
        </Fragment>
      ) : (
        <div className='d-flex justify-content-center mt-2'>
          <p>No Results</p>
        </div>
      )}
    </Fragment>
  )
}

export default PostsPage
