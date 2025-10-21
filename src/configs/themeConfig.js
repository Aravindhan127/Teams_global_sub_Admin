/**
 * Config
 * -------------------------------------------------------------------------------------
 * ! IMPORTANT: Make sure you clear the browser local storage in order to see the config changes in the template.
 * ! To clear local storage, you may refer https://www.leadshook.com/help/how-to-clear-local-storage-in-google-chrome-browser/.
 */
// ** Icon Import
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const themeConfig = {
  // ** Layout Configs
  templateName: "Lynksorg - Admin Panel" /* App Name */,
  layout: "vertical" /* vertical | horizontal */,
  mode: "light" /* light | dark */,
  direction: "ltr" /* ltr | rtl */,
  skin: "default" /* default | bordered | semi-dark /*! Note: semi-dark value will only work for Vertical Layout */,
  contentWidth: "full" /* full | boxed */,
  footer: "static" /* fixed | static | hidden */,
  // ** Routing Configs
  routingLoader: true /* true | false */,
  // ** Navigation (Menu) Configs
  navHidden: false /* true | false */,
  menuTextTruncate: true /* true | false */,
  navSubItemIcon: RadioButtonUncheckedIcon /* Icon Element */,
  verticalNavToggleType: "accordion" /* accordion | collapse /*! Note: This is for Vertical navigation menu only */,
  navCollapsed: false /* true | false /*! Note: This is for Vertical navigation menu only */,
  navigationSize: 260 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,
  collapsedNavigationSize: 68 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,
  afterVerticalNavMenuContentPosition: "fixed" /* fixed | static */,
  beforeVerticalNavMenuContentPosition: "fixed" /* fixed | static */,
  horizontalMenuToggle: "hover" /* click | hover /*! Note: This is for Horizontal navigation menu only */,
  horizontalMenuAnimation: true /* true | false */,
  // ** AppBar Configs
  appBar: "fixed" /* fixed | static | hidden /*! Note: hidden value will only work for Vertical Layout */,
  appBarBlur: true /* true | false */,
  // ** Other Configs
  responsiveFontSizes: true /* true | false */,
  disableRipple: false /* true | false */,
  disableCustomizer: true /* true | false */,
  toastPosition: "top-right" /* top-left | top-center | top-right | bottom-left | bottom-center | bottom-right */,
  storageSettingsKeyName: 'Lynksorg-admin-panel-web-settings',
};

export default themeConfig;
