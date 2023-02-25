import { Home, ShoppingCart } from 'react-feather'


export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: 'home'
  },
  {
    id: 'shop',
    title: 'Shop',
    icon: <ShoppingCart size={20} />,
    navLink: '/gallery/posts'
  }
]