// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import Proptypes from 'prop-types'

const NewPostButton = props => {
  // ** Props
  const { showOffset, children, ...rest } = props

  // ** State
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset >= showOffset) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      })
    }
  }, [])

  const handleScrollToTop = () => {
    console.log('Scroll add new post')
  }

  return (
    visible && (
      <div className='scroll-to-top' onClick={handleScrollToTop} {...rest}>
        {children}
      </div>
    )
  )
}

export default NewPostButton

// ** PropTypes
// ScrollTop.propTypes = {
//   showOffset: Proptypes.number,
//   children: Proptypes.any.isRequired,
//   scrollBehaviour: Proptypes.oneOf(['smooth', 'instant', 'auto'])
// }

// ScrollTop.defaultProps = {
//   scrollBehaviour: 'smooth'
// }
