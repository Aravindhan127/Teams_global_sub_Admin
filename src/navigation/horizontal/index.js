// ** Icon imports
import HomeIcon from 'mdi-material-ui/Home'
import CogIcon from 'mdi-material-ui/Cog'
import { BiSolidCoupon } from "react-icons/bi";

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeIcon,
      path: '/'
    },
    {
      title: 'Medical Specialization',
      icon: CogIcon,
      path: '/medical-specialization'
    },
    {
      title: 'Plan Services',
      icon: CogIcon,
      path: '/plan-services'
    },
    {
      title: 'Subscription Plans',
      icon: CogIcon,
      path: '/subscription-plans'
    },
    {
      title: 'Complimentary Services',
      icon: BiSolidCoupon,
      path: '/complimentary-services'
    },
    {
      title: 'Settings',
      icon: CogIcon,
      path: '/settings'
    }
  ]
}

export default navigation
