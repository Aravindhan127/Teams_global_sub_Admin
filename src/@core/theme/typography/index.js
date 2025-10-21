const Typography = theme => {
  return {
    h1: {
      fontWeight: 500,
      letterSpacing: '-1.5px',
      color: theme.palette.text.primary
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.5px',
      color: theme.palette.text.primary
    },
    h3: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.25px',
      color: theme.palette.text.primary
    },
    h5: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary
    },
    h6: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary
    },
    subtitle1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary
    },
    subtitle2: {
      letterSpacing: '0.1px',
      color: theme.palette.text.secondary
    },
    body1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary
    },
    body2: {
      lineHeight: 1.5,
      letterSpacing: '0.15px',
      color: theme.palette.text.secondary
    },
    button: {
      letterSpacing: '0.3px',
      color: theme.palette.text.primary
    },
    caption: {
      letterSpacing: '0.4px',
      color: theme.palette.text.secondary
    },
    overline: {
      letterSpacing: '1px',
      color: theme.palette.text.secondary
    },
    // Custom typography
    'fm-h1': {
      fontSize: '64px',
      fontStyle: 'normal',
      lineHeight: '76.8px'
    },
    'fm-h2': {
      fontSize: '50px',
      fontStyle: 'normal',
      lineHeight: '60px'
    },
    'fm-h3': {
      fontSize: '40px',
      fontStyle: 'normal',
      lineHeight: '48px'
    },
    'fm-h4': {
      fontSize: '32px',
      fontStyle: 'normal',
      lineHeight: '38.4px'
    },
    'fm-h5': {
      fontSize: '25px',
      fontStyle: 'normal',
      lineHeight: '30px'
    },
    'fm-h6': {
      fontSize: '20px',
      fontStyle: 'normal',
      lineHeight: '24px'
    },
    'fm-h7': {
      fontSize: '24px',
      fontStyle: 'normal',
      lineHeight: '32px'
    },
    'fm-p1': {
      fontSize: '18px',
      fontStyle: 'normal',
      lineHeight: '27px'
    },
    'fm-p2': {
      fontSize: '16px',
      fontStyle: 'normal',
      lineHeight: '24px'
    },

    'fm-p3': {
      fontSize: '15px',
      fontStyle: 'normal',
      lineHeight: '15px'
    },
    'fm-p4': {
      fontSize: '13px',
      fontStyle: 'normal',
      lineHeight: '10px'
    },
    'fm-p5': {
      fontSize: '12px',
      fontStyle: 'normal',
      lineHeight: '10px'
    },
    'fm-p6': {
      fontSize: '10px',
      fontStyle: 'normal',
      lineHeight: '12px'
    },
    'fm-p7': {
      fontSize: '14px',
      fontStyle: 'normal',
      lineHeight: '23px'
    }
  }
}

export default Typography
