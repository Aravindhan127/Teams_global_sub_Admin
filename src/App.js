import React, { Suspense } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import FallbackSpinner from './@core/components/spinner'

import AuthGuard from 'src/@core/components/auth/AuthGuard'
import UserLayout from './layouts/UserLayout'
import BlankLayout from './@core/layouts/BlankLayout'
// import BlankLayoutWithAppBar from './@core/layouts/BlankLayoutWithAppBar'
import AclGuard from './@core/components/auth/AclGuard'
import GuestGuard from './@core/components/auth/GuestGuard'
import { defaultACLObj } from './configs/acl'
import AuthLayout from './layouts/AuthLayout'
import LoungeDetail from './pages/lounge/loungeDetail'
import Category from './pages/category'
import EventDetail from './pages/event/eventDetail'
import ViewGuest from './pages/view-guest'
import GuestForm from './pages/view-guest/guestForm'
import EmailCampaign from './pages/email-campaign'
import FundRaise from './pages/fund-raise'
import MentorProfilePage from './pages/mentorship/mentorProfilePage'
import EmailCompose from './pages/email-campaign/EmailCompose'
import EmailComposedUsers from './pages/email-campaign/EmailComposedUsers'

//website 
const CareerCategoriesPage = React.lazy(() => import('./pages/website-content/career-section/career-categories'))
const CareerPage = React.lazy(() => import('./pages/website-content/career-section'))
const FaqsPage = React.lazy(() => import('./pages/website-content/faqs'))
const TestimonialsPage = React.lazy(() => import('./pages/website-content/testimonials'))
const ContactUsPage = React.lazy(() => import('./pages/website-content/contact-us'))
const BlogPage = React.lazy(() => import('./pages/website-content/blog'))
const SocialMediaPage = React.lazy(() => import('./pages/website-content/social-media'))

//admin
const HomePage = React.lazy(() => import('./pages/home'))
const DashboardPage = React.lazy(() => import('./pages/dashboard'))
const LoginPage = React.lazy(() => import('./pages/login'))
const ForgotPassword = React.lazy(() => import('./pages/login/forgotpassword'))

const CollegeUser = React.lazy(() => import('./pages/college'))
const OrganizationUser = React.lazy(() => import('./pages/organization'))
const CollegeUserDetail = React.lazy(() => import('./pages/college/collegeUser-detail'))
const Degree = React.lazy(() => import('./pages/degree'))
const Admin = React.lazy(() => import('./pages/admin'))
const Department = React.lazy(() => import('./pages/department'))
const Chapter = React.lazy(() => import('./pages/chapter'))
const Profile = React.lazy(() => import('./pages/profile'))
const EditClgProfile = React.lazy(() => import('./pages/editClgProfile'))
const UserRolesPage = React.lazy(() => import('./pages/roles'))
const UserPermissionPage = React.lazy(() => import('./pages/permissions'))
const AddUserRolePage = React.lazy(() => import('./pages/roles/add-roles'))
const EditUserRolePage = React.lazy(() => import('./pages/roles/edit-roles'))
const BulkUpload = React.lazy(() => import('./pages/bulkUpload'))
const NewsLetter = React.lazy(() => import('./pages/newsletter'))
const EditOrgProfile = React.lazy(() => import('./pages/editOrgProfile'))
const CreatePassword = React.lazy(() => import('./pages/reset-pwd'))
const OrgUserDetail = React.lazy(() => import('./pages/organization/orgUser-detail'))
const AddNewsLetterPage = React.lazy(() => import('./pages/newsletter/addNewsLetter'))
const Lounge = React.lazy(() => import('./pages/lounge'))
const Mentorship = React.lazy(() => import('./pages/mentorship'))
const MentorshipRequest = React.lazy(() => import('./pages/mentorship/mentorshipRequest'))
const Carrers = React.lazy(() => import('./pages/carrers'))
const WhatsAppIntegration = React.lazy(() => import('./pages/whatsapp'))
const Galllery = React.lazy(() => import('./pages/gallery'))
const Archives = React.lazy(() => import('./pages/gallery/archives'))
const ServiceRequest = React.lazy(() => import('./pages/service-request'))
const StudentsList = React.lazy(() => import('./pages/college/studentList'))
const AlumniList = React.lazy(() => import('./pages/college/alumniList'))
const FacultyList = React.lazy(() => import('./pages/college/facultyList'))
const NewsLetterDetail = React.lazy(() => import('./pages/newsletter/newsLetterDetail'))
const PrivacyPolicyPage = React.lazy(() => import('./pages/privacy-policy'))
const TermsandConditionPage = React.lazy(() => import('./pages/terms-condition'))
const PollListing = React.lazy(() => import('./pages/lounge/pollListing'))
const EventsList = React.lazy(() => import('./pages/event'))
const CreateEvent = React.lazy(() => import('./pages/event/createEvent'))

const NotificationPage = React.lazy(() => import('./pages/notification'))
const PaymentPage = React.lazy(() => import('./pages/payment'))
const FeedBackPage = React.lazy(() => import('./pages/feedback'))
const FeedBackCategory = React.lazy(() => import('./pages/feedback/feedback-category'));
const HelpPage = React.lazy(() => import('./pages/help'))

const Page401 = React.lazy(() => import('./pages/401'))
const Page404 = React.lazy(() => import('./pages/404'))



const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

function App() {
  const aclAbilities = defaultACLObj

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <AclGuard aclAbilities={aclAbilities}>
        <Routes>
          <Route element={<BlankLayout><Outlet /></BlankLayout>}>
            <Route path='/401' element={<Page401 />} />
            <Route path='/404' element={<Page404 />} />

            <Route element={<AuthLayout><Outlet /></AuthLayout>}>
              <Route element={<Guard guestGuard><Outlet /></Guard>}>
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/create-password' element={<CreatePassword />} />
              </Route>
            </Route>
          </Route>

          <Route element={<UserLayout><Outlet /></UserLayout>}>
            <Route element={<Guard authGuard><Outlet /></Guard>}>
              <Route path='' element={<HomePage />} />
              <Route path='/dashboard' element={<DashboardPage />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/edit-clg-profile' element={<EditClgProfile />} />
              <Route path='/edit-org-profile' element={<EditOrgProfile />} />

              <Route path='/college-user' element={<CollegeUser />} />
              <Route path='/student-list' element={<StudentsList />} />
              <Route path='/alumni' element={<AlumniList />} />
              <Route path='/faculty' element={<FacultyList />} />
              <Route path='/college-user/:userSeqId' element={<CollegeUserDetail />} />
              <Route path='/degree/:deptId' element={<Degree />} />
              <Route path='/department' element={<Department />} />
              <Route path='/event-category' element={<Category />} />
              <Route path='/event' element={<EventsList />} />
              <Route path='/create-event' element={<CreateEvent />} />
              <Route path='/event-detail/:eventId' element={<EventDetail />} />
              <Route path='/view-guest/:id' element={<ViewGuest />} />
              <Route path='/guest-form/:id' element={<GuestForm />} />
              {/* common */}
              <Route path='/admin' element={<Admin />} />
              <Route path='/lounge' element={<Lounge />} />
              <Route path='/lounge/:loungeId' element={<LoungeDetail />} />

              <Route path='/poll' element={<PollListing />} />
              <Route path='/mentorship-management' element={<Mentorship />} />
              <Route path='/mentorship-request' element={<MentorshipRequest />} />
              <Route path='/mentor-profile-detail' element={<MentorProfilePage />} />
              <Route path='/email-campaign' element={<EmailCampaign />} />
              <Route path='/email-compose' element={<EmailCompose />} />
              <Route path='/email-composed-user/:id' element={<EmailComposedUsers />} />
              <Route path='/fund-raise' element={<FundRaise />} />

              <Route path='/carrers' element={<Carrers />} />
              <Route path='/whatsapp-integration' element={<WhatsAppIntegration />} />
              <Route path='/gallery' element={<Galllery />} />
              <Route path='/archives' element={<Archives />} />
              <Route path='/service-request' element={<ServiceRequest />} />
              {/* common */}
              <Route path='/organization-user' element={<OrganizationUser />} />
              <Route path='/organization-user/:userSeqId' element={<OrgUserDetail />} />

              <Route path='/chapter' element={<Chapter />} />

              <Route path='/roles' element={<UserRolesPage />} />
              <Route path='/add-roles' element={<AddUserRolePage />} />
              <Route path='/edit-roles/:roleId' element={<EditUserRolePage />} />

              <Route path='/permission' element={<UserPermissionPage />} />

              <Route path='/bulk-upload' element={<BulkUpload />} />

              <Route path='/newsletter' element={<NewsLetter />} />
              <Route path='/add-newsletter' element={<AddNewsLetterPage />} />
              <Route path='/newsletter-detail/:newsletterId' element={<NewsLetterDetail />} />

              <Route path='/notifications' element={<NotificationPage />} />
              <Route path='/payment' element={<PaymentPage />} />
              <Route path='/feedback' element={<FeedBackPage />} />
              <Route path='/feedback-category' element={<FeedBackCategory />} />
              <Route path='/help' element={<HelpPage />} />
              {/* website */}
              <Route path='/career-section' element={<CareerPage />} />
              <Route path='/career-categories' element={<CareerCategoriesPage />} />
              <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
              <Route path='/terms-conditions' element={<TermsandConditionPage />} />
              <Route path='/testimonials' element={<TestimonialsPage />} />
              <Route path='/contact-us' element={<ContactUsPage />} />
              <Route path='/faqs' element={<FaqsPage />} />
              <Route path='/blog' element={<BlogPage />} />
              <Route path='/social-media' element={<SocialMediaPage />} />
            </Route>
          </Route>

          {/* If no route found redirect it to --> /404 */}
          <Route path='*' element={<Navigate to='/404' replace />} />

        </Routes>
      </AclGuard>
    </Suspense>
  );
}

export default App;
