import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart
} from 'react-icons/md'
import React from 'react'
import RTL from 'views/admin/rtl'
import { Icon } from '@chakra-ui/react'
import Profile from 'views/admin/profile'
import SignInCentered from 'views/auth/signIn'
import DataTables from 'views/admin/dataTables'
import MainDashboard from 'views/admin/default'
import NFTMarketplace from 'views/admin/marketplace'
import TemplateCreator from 'views/admin/templateCreator'

const routes = [
  {
    name: 'Schema Creator',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard
  },
  {
    name: 'Template Creator',
    layout: '/admin',
    path: '/template-creator',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: TemplateCreator
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered
  }
]

export default routes
