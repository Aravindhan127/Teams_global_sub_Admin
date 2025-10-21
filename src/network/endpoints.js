// export const API_BASE_URL = "https://api.hiqlynks.com"
export const API_BASE_URL = "https://api.hiqlynks.com"
export const MEDIA_URL = "https://d1hj3r7039erwq.cloudfront.net"
export const ApiEndPoints = {
    AUTH: {
        login: `${API_BASE_URL}/public/api/v1/org/login`,
        college_me: `${API_BASE_URL}/api/v1/org/college/get-profile`,
        organization_me: `${API_BASE_URL}/api/v1/org/organisation/get-profile`,
        forgot: `${API_BASE_URL}/public/api/v1/org/forgot-password-request`,
        verifotp: `${API_BASE_URL}/api/v1/org/verify-forgot-password-otp`,
        reset: `${API_BASE_URL}/api/v1/org/reset-password`,
        edit_college_profile: `${API_BASE_URL}/api/v1/org/college/edit-college`,
        edit_org_profile: `${API_BASE_URL}/api/v1/org/organisation/edit-profile`,
        changePassword: `${API_BASE_URL}/api/v1/org/update-password`
    },
    DASHBOARD: {
        collegeCount: `${API_BASE_URL}/api/v1/org/college/get-dashboard-data`,
        organizationCount: `${API_BASE_URL}/api/v1/org/organisation/get-dashboard-data`
    },
    COLLEGE_USER: {
        get_college_users: `${API_BASE_URL}/api/v1/org/org-user/get-users`,
        getById: (id) => `${API_BASE_URL}/api/v1/org/org-user/get-user-details?userSeqId=${id}`,
        accept: `${API_BASE_URL}/api/v1/org/org-user/approve-request`,
        reject: `${API_BASE_URL}/api/v1/org/org-user/reject-request`,
        get_notification: `${API_BASE_URL}/api/v1/college/get-notifications`,
        active_deactive: `${API_BASE_URL}/api/v1/org/org-user/active-deactive-user`,
        delete_by_id: (id) => `${API_BASE_URL}/api/v1/org/org-user/delete-user?personId=${id}`,
    },
    ADMIN: {
        get: `${API_BASE_URL}/api/v1/org/sub-admin/get-admins`,
        create: `${API_BASE_URL}/api/v1/org/sub-admin/add-admin`,
        edit: `${API_BASE_URL}/api/v1/org/sub-admin/edit-admin`,
        active_deactive: (id) => `${API_BASE_URL}/api/v1/org/sub-admin/active-deactive-admin?orgAdminId=${id}`,
    },
    COUNTRY_STATE_CITY: {
        get: `${API_BASE_URL}/public/api/v1/get-common-list-data`,
    },
    COMMON: {
        get: `${API_BASE_URL}/public/api/v1/get-common-list-data`,
    },
    DEGREE: {
        // get: (id) => `${API_BASE_URL}/api/v1/org/degree/get-degrees?deptId=${id}`,
        get: `${API_BASE_URL}/api/v1/org/degree/get-degrees`,
        create: `${API_BASE_URL}/api/v1/org/degree/create-degree`,
        edit: `${API_BASE_URL}/api/v1/org/degree/edit-degree`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/degree/delete-degree?degreeId=${id}`,
    },
    DEPARTMENT: {
        get: `${API_BASE_URL}/api/v1/org/department/get-departments`,
        create: `${API_BASE_URL}/api/v1/org/department/create-department`,
        edit: `${API_BASE_URL}/api/v1/org/department/edit-department`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/department/delete-department?deptId=${id}`,
    },

    ORGANIZATION_USER: {
        get_organization_users: `${API_BASE_URL}/api/v1/org/org-user/get-users`,
        getById: (id) => `${API_BASE_URL}/api/v1/org/org-user/get-user-details?userSeqId=${id}`,
        accept: `${API_BASE_URL}/api/v1/org/org-user/approve-request`,
        reject: `${API_BASE_URL}/api/v1/org/org-user/reject-request`,
        get_notification: `${API_BASE_URL}/api/v1/college/get-notifications`,
        active_deactive: `${API_BASE_URL}/api/v1/org/org-user/active-deactive-user`,
    },
    CHAPTER: {
        get: `${API_BASE_URL}/api/v1/org/get-chapters`,
        create: `${API_BASE_URL}/api/v1/org/create-chapter`,
        edit: `${API_BASE_URL}/api/v1/org/edit-chapter`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/delete-chapter?chapterId=${id}`,
        active_deactive: (id) => `${API_BASE_URL}/api/v1/org/active-deactive-chapter`,
    },
    ROLES: {
        getRoles: `${API_BASE_URL}/api/v1/org/role-permission/get-roles`,
        addRolesPermission: `${API_BASE_URL}/api/v1/org/role-permission/add-role-with-permissions`,
        editRolesPermission: `${API_BASE_URL}/api/v1/org/role-permission/edit-role-with-permissions`,
        roleById: (id) => `${API_BASE_URL}/api/v1/org/role-permission/get-role-with-permissions?roleId=${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/role-permission/delete-role?roleId=${id}`
    },
    PERMISSION: {
        getPermissions: `${API_BASE_URL}/api/v1/org/role-permission/get-permissions`,
    },
    BULK_UPLOAD: {
        doc_list: `${API_BASE_URL}/api/v1/org/user-invitation/get-invitations`,
        doc_list_for_org: `${API_BASE_URL}/api/v1/org/user-invitation/get-invitations-to-org-user`,
        upload_doc: `${API_BASE_URL}/api/v1/org/user-invitation/send-invitation-user`,
        upload_doc_for_org: `${API_BASE_URL}/api/v1/org/user-invitation/send-invitations-to-org-user`,
    },
    NEWSLETTER: {
        list: `${API_BASE_URL}/api/v1/org/newsletter/get-newsletters`,
        create: `${API_BASE_URL}/api/v1/org/newsletter/add-newsletter`,
        edit: `${API_BASE_URL}/api/v1/org/newsletter/edit-newsletter`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/newsletter/delete-newsletter?newsLetterId=${id}`,
        getById: (id) => `${API_BASE_URL}/api/v1/org/newsletter/get-newsletters?newsLetterId=${id}`,
    },
    LOUNGE: {
        list: `${API_BASE_URL}/api/v1/org/get-all-lounges`,
        getById: (id) => `${API_BASE_URL}/api/v1/org/get-all-lounges?loungeId=${id}`,
        create: `${API_BASE_URL}/api/v1/org/create-lounge`,
        edit: `${API_BASE_URL}/api/v1/org/update-lounge`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/delete-lounge?loungeId=${id}`,
        approve_reject: `${API_BASE_URL}/api/v1/org/approve-reject-lounge`,
        poll_create: `${API_BASE_URL}/api/v1/org/create-poll`,
        list_poll: `${API_BASE_URL}/api/v1/org/get-polls-list`,
        getPoll: (id) => `${API_BASE_URL}/api/v1/org/get-option-voter-list?loungeId=${id}`,
        getComments: (id) => `${API_BASE_URL}/api/v1/org/get-lounge-comments?loungeId=${id}`,
        close: `${API_BASE_URL}/api/v1/org/close-lounge`,
        undoClose: `${API_BASE_URL}/api/v1/org/undo-close-lounge`,
        addComment: `${API_BASE_URL}/api/v1/org/add-comment-to-lounge`,
        getFollowers: (id) => `${API_BASE_URL}/api/v1/org/get-lounge-followers?loungeId=${id}`,
        getFavourites: (id) => `${API_BASE_URL}/api/v1/org/get-lounge-favourite-user-list?loungeId=${id}`,
        toggleFollow: `${API_BASE_URL}/api/v1/org/follow-unfollow-lounge`,
        addToFav: `${API_BASE_URL}/api/v1/org/add-to-favourite-lounge`,
        removeFromFav: `${API_BASE_URL}/api/v1/org/remove-from-favourite-lounge-list`,
        multipleClose: `${API_BASE_URL}/api/v1/org/multiple-close-lounge`,
    },
    DOCUMENT: {
        document: (docsType) => `${API_BASE_URL}/api/v1/org/documents/get-document?docsType=${docsType}`,
        edit: `${API_BASE_URL}/api/v1/admin/documents/update-document`,
    },
    EVENT_CATEGORY: {
        list: `${API_BASE_URL}/api/v1/org/get-event-category`,
        create: `${API_BASE_URL}/api/v1/org/add-event-category`,
        edit: `${API_BASE_URL}/api/v1/org/edit-event-category`,
        delete: (id) => `${API_BASE_URL}/api/v1/org/delete-event-category?categoryId=${id}`,
    },
    EVENT: {
        list: `${API_BASE_URL}/api/v1/org/get-events`,
        getById: (id) => `${API_BASE_URL}/api/v1/org/get-event-details?eventId=${id}`,
        create: `${API_BASE_URL}/api/v1/org/create-event`,
        edit: `${API_BASE_URL}/api/v1/org/edit-event`,
        generatePromoCode: `${API_BASE_URL}/api/v1/org/generate-promocode`,
        getEventTickets: (id) => `${API_BASE_URL}/api/v1/org/get-event-tickets?eventId=${id}`,
    },
    GUEST: {
        list: (id) => `${API_BASE_URL}/api/v1/org/get-event-guests?eventId=${id}`,
        add: `${API_BASE_URL}/api/v1/org/add-event-guest`,
        checkExistUser: (id) => `${API_BASE_URL}/api/v1/org/guest-exist-or-not?eventId=${id}`,
        qrCode: `${API_BASE_URL}/api/v1/org/get-event-guest-by-qrcode`,
        multipleScan: `${API_BASE_URL}/api/v1/org/scan-multiple-event`
    },
    EMAIL_CAMPAIGN: {
        getSenderData: `${API_BASE_URL}/api/v1/org/get-sender-data`,
        getCampaignList: `${API_BASE_URL}/api/v1/org/get-campaign-list`,
        sendMailCampaign: `${API_BASE_URL}/api/v1/org/send-mail-campaign-to-user`,
    },
    USERS: {
        list: (type) => `${API_BASE_URL}/api/v1/admin/user/list/${type}`,
        listbydriver: id => `${API_BASE_URL}/api/v1/admin/orders/driver/history/${id}`,
        listbycustomer: id => `${API_BASE_URL}/api/v1/admin/orders/customer/history/${id}`,
        map: id => `${API_BASE_URL}/api/v1/admin/orders/${id}`,
        statusedit: (id) => `${API_BASE_URL}/api/v1/admin/user/${id}`,
        create: `${API_BASE_URL}/api/v1/admin/user`,
        listbyid: (id) => `${API_BASE_URL}/api/v1/admin/user/${id}`,
        createvehical: (id) => `${API_BASE_URL}/api/v1/admin/user/vehicles/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/user/${id}`,
        orderbyid: (id) => `${API_BASE_URL}/api/v1/admin/orders/${id}`,
        expressDelivery: (id) => `${API_BASE_URL}/api/v1/admin/user/${id}`
    },
    PRIVACY_POLICY: {
        list: `${API_BASE_URL}/api/v1/admin/legalcontent/privacy_policy`,
        edit: `${API_BASE_URL}/api/v1/admin/legalcontent/privacy_policy`
    },
    Terms_AND_CONDITIONS: {
        list: `${API_BASE_URL}/api/v1/admin/legalcontent/terms_and_conditions`,
        edit: `${API_BASE_URL}/api/v1/admin/legalcontent/terms_and_conditions`
    },
    Testimonials: {
        list: `${API_BASE_URL}/api/v1/admin/testimonials`,
        create: `${API_BASE_URL}/api/v1/admin/testimonials`,
        edit: (id) => `${API_BASE_URL}/api/v1/admin/testimonials/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/testimonials/${id}`
    },
    ContactUs: {
        list: `${API_BASE_URL}/api/v1/admin/contact-us`,
        reply: (id) => `${API_BASE_URL}/api/v1/admin/contact-us/${id}`
    },
    FAQ: {
        list: `${API_BASE_URL}/api/v1/admin/faqs`,
        create: `${API_BASE_URL}/api/v1/admin/faqs`,
        edit: (id) => `${API_BASE_URL}/api/v1/admin/faqs/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/faqs/${id}`
    },

    GET_REGION: {
        country: `https://api.countrystatecity.in/v1/countries`,
        state: `https://api.countrystatecity.in/v1/countries/`,
        city: `https://api.countrystatecity.in/v1/countries/`
    },

    COUNTRY: {
        list: `${API_BASE_URL}/api/v1/misc/countries`
    },
    NOTIFICATION: {
        list: `${API_BASE_URL}/api/v1/org/notification/get-notifications`,
        markAsRead: `${API_BASE_URL}/api/v1/org/notification/mark-as-read`,
        getUnreadCount: `${API_BASE_URL}/api/v1/org/notification/get-unread-count`,
    },
    CAREER_CATEGORY: {
        list: `${API_BASE_URL}/api/v1/admin/categories/career`,
        create: `${API_BASE_URL}/api/v1/admin/categories/career`,
        edit: (id) => `${API_BASE_URL}/api/v1/admin/categories/career/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/categories/career/${id}`
    },
    CAREER_SECTION: {
        list: `${API_BASE_URL}/api/v1/admin/careers`,
        create: `${API_BASE_URL}/api/v1/admin/careers`,
        edit: (id) => `${API_BASE_URL}/api/v1/admin/careers/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/careers/${id}`
    },
    BLOG: {
        list: `${API_BASE_URL}/api/v1/admin/blogs`,
        create: `${API_BASE_URL}/api/v1/admin/blogs`,
        edit: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}`,
        delete: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}`
    }
}