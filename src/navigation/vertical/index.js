// ** Icon imports
import HomeIcon from 'mdi-material-ui/Home'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DomainIcon from '@mui/icons-material/Domain';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import ArticleIcon from '@mui/icons-material/Article';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import VerifiedIcon from '@mui/icons-material/Verified';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CampaignIcon from '@mui/icons-material/Campaign';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import PhotoAlbumOutlinedIcon from '@mui/icons-material/PhotoAlbumOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TuneIcon from '@mui/icons-material/Tune';
import LockIcon from '@mui/icons-material/Lock'
import TaskIcon from '@mui/icons-material/Task'
import PollIcon from '@mui/icons-material/Poll';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: DashboardIcon,
      hasChild: false,
      permission: 'dashboard',
      path: '/dashboard'
    },
    {
      title: 'Members',
      icon: GroupIcon,
      hasChild: false,
      permission: 'orgUser.list',
      path: '/organization-user',
    },
    {
      title: 'User Management',
      icon: AccountCircleIcon,
      children: [
        // {
        //   title: 'College Users',
        //   icon: SchoolIcon,
        //   path: '/college-user',
        //   permission: 'collegeUser.list',
        //   type: 'college'
        // },
        {
          title: 'Student',
          icon: SchoolIcon,
          path: '/student-list',
          permission: 'collegeUser.list',
          type: 'college'
        },
        {
          title: 'Alumni',
          icon: CastForEducationIcon,
          path: '/alumni',
          permission: 'collegeUser.list',
          type: 'college'
        },
        {
          title: 'Faculty',
          icon: PeopleIcon,
          path: '/faculty',
          permission: 'collegeUser.list',
          type: 'college'
        },
        // {
        //   title: 'Organization Users',
        //   icon: SchoolIcon,
        //   path: '/organization-user',
        //   permission: 'orgUser.list',
        //   // permission: 'org.list',
        //   type: 'organisation'
        // },
      ]
    },
    {
      title: 'Lounge',
      icon: DynamicFeedIcon,
      hasChild: false,
      permission: 'lounge.list',
      path: '/lounge'
      // children: [

      //   {
      //     title: 'Poll',
      //     icon: PollIcon,
      //     path: '/poll',
      //     // permission: 'lounge.list',
      //   },
      // ]
    },
    {
      title: 'Email Campaign',
      icon: CampaignIcon,
      hasChild: false,
      path: '/email-campaign',
      permission: 'campaign.list',
      // children: [

      //   {
      //     title: 'Poll',
      //     icon: PollIcon,
      //     path: '/poll',
      //     // permission: 'lounge.list',
      //   },
      // ]
    },
    {
      title: 'Events',
      icon: EventIcon,
      children: [
        {
          title: 'Events',
          icon: EventAvailableIcon,
          path: '/event',
          permission: 'event.list',
        },
        {
          title: 'Event Category',
          icon: CategoryIcon,
          path: '/event-category',
          permission: 'eventCat.list',
        },

      ]
      // permission: 'lounge.list',
    },
    {
      title: "Newsletter",
      icon: ArticleIcon,
      hasChild: false,
      path: '/newsletter',
      permission: 'newsLetters.list'
    },
    {
      title: 'Mentorship',
      icon: RecordVoiceOverIcon,
      children: [
        {
          title: 'Mentorship Management',
          icon: ManageAccountsIcon,
          path: '/mentorship-management',
          // permission: 'lounge.list',
        },
        {
          title: 'Mentorship Request',
          icon: VerifiedIcon,
          path: '/mentorship-request',
          // permission: 'lounge.list',
        },
      ]
    },
    // {
    //   title: 'Fund Raise',
    //   icon: MonetizationOnIcon,
    //   children: [
    //     {
    //       title: 'New Campaign',
    //       icon: CampaignIcon,
    //       path: '/fund-raise',
    //       // permission: 'lounge.list',
    //     },
    //     {
    //       title: 'Campaign management',
    //       icon: ManageAccountsIcon,
    //       path: '/fund-raise',
    //       // permission: 'lounge.list',
    //     },
    //   ]
    // },
    {
      title: 'Jobopedia',
      icon: WorkOutlineIcon,
      path: '/carrers',
      hasChild: false,
      // permission: 'lounge.list',
    },
    {
      title: 'WhatsApp',
      icon: WhatsAppIcon,
      path: '/whatsapp-integration',
      hasChild: false,
      // permission: 'lounge.list',
    },
    {
      title: 'Gallery',
      icon: CollectionsOutlinedIcon,
      children: [
        {
          title: 'View',
          icon: RemoveRedEyeIcon,
          path: '/gallery',
          // permission: 'lounge.list',
        },
        {
          title: 'Archives',
          icon: PhotoAlbumOutlinedIcon,
          path: '/archives',
          // permission: 'lounge.list',
        },

      ]
    },
    {
      title: "Service Request",
      icon: MiscellaneousServicesOutlinedIcon,
      hasChild: false,
      path: '/service-request',
      // permission: 'newsLetters.list'
    },

    {
      title: 'College Management',
      type: 'college',
      icon: CastForEducationIcon,
      children: [
        {
          title: 'College Profile',
          type: 'college',
          icon: AccountCircleIcon,
          path: '/profile',
        },
        {
          title: 'Department',
          icon: DomainIcon,
          path: '/department',
          permission: 'dept.list',
          type: 'college'
        },
        {
          title: 'Chapters',
          icon: SouthAmericaIcon,
          path: '/chapter',
          // type: 'organisation',
          // permission: 'orgChapter.list'
        },

        {
          title: 'App Admin',
          icon: PersonOutlineIcon,
          permission: 'subadmin.list',
          path: '/admin',
        },
      ]
    },
    {
      title: 'Organization Management',
      type: 'organisation',
      icon: CastForEducationIcon,
      children: [
        {
          title: 'Org Profile',
          type: 'organisation',
          icon: AccountCircleIcon,
          path: '/profile',
        },
        {
          title: 'Chapters',
          icon: SouthAmericaIcon,
          path: '/chapter',
          // type: 'organisation',
          permission: 'orgChapter.list'
        },
        {
          title: 'App Admin',
          icon: PersonOutlineIcon,
          permission: 'subadmin.list',
          path: '/admin',
        },
      ]
    },

    {
      title: 'Roles & Permission',
      icon: LockPersonIcon,
      children: [
        {
          title: 'Roles',
          icon: SupervisorAccountIcon,
          path: '/roles',
          permission: 'rolespermission.list'
        },
        {
          title: 'Permission',
          icon: LockOpenIcon,
          path: '/permission',
          permission: 'rolespermission.list'
        },
      ]
    },
    {
      title: "User Invitation",
      icon: PersonAddIcon,
      hasChild: false,
      path: '/bulk-upload',
      permission: 'bulkUser.list'
    },
    {
      title: 'Settings',
      icon: TuneIcon,
      children: [
        {
          title: 'Notifications',
          icon: NotificationsActiveIcon,
          path: '/notifications',
          // permission: 'collegeUser.list',
          // type: 'college'
        },
        {
          title: 'Privacy Policy',
          icon: LockIcon,
          path: '/privacy-policy',
          // permission: 'document.list',
        },
        {
          title: 'Terms and Conditions',
          icon: TaskIcon,
          path: '/terms-conditions',
          // permission: 'document.list',
        },
      ]
    },

    // {
    //   sectionTitle: "College",
    //   type: 'college',
    //   permission: 'collegeUser.list',
    // },

    // {
    //   sectionTitle: "Profile",
    //   type: 'college',
    // },

    // {
    //   sectionTitle: "Profile",
    //   type: 'organisation',
    // },

    // {
    //   sectionTitle: "App Admin",
    //   permission: 'subadmin.list'
    // },

    // {
    //   sectionTitle: "Degree",
    //   type: 'college'
    // },
    // {
    //   title: 'Degree',
    //   icon: WorkspacePremiumIcon,
    //   path: '/degree',
    //   type: 'college'
    // },
    // {
    //   sectionTitle: "Department & Degree",
    //   type: 'college',
    //   permission: 'dept.list'
    // },

    // {
    //   sectionTitle: "Organization",
    //   type: 'organisation',
    //   permission: 'orgUser.list'
    //   // permission: 'org.list'
    // },

    // {
    //   sectionTitle: "Chapters",
    //   type: 'organisation',
    //   permission: 'orgChapter.list'
    // },

    // {
    //   sectionTitle: "Roles & Permission",
    //   permission: 'rolespermission.list'
    // },


    // {
    //   sectionTitle: "User Invitation",
    //   permission: 'bulkUser.list'
    // },

    // {
    //   sectionTitle: "Newsletter",
    //   permission: 'newsLetters.list'
    // },



    // {
    //   sectionTitle: "Alumni",
    // },
    // {
    //   title: 'Alumni',
    //   icon: CastForEducationIcon,
    //   children: [
    //     {
    //       title: 'Alumni Profiles',
    //       icon: SchoolIcon,
    //       path: '#'
    //     },
    //     {
    //       title: 'Users',
    //       icon: PersonAddAltIcon,
    //       path: '#'
    //     },
    //   ]
    // },
    // {
    //   sectionTitle: "Event Management",
    // },
    // {
    //   title: 'Event',
    //   icon: CalendarMonthIcon,
    //   path: '#'

    // },
  ]
}

export default navigation
