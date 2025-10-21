const UserIcon = props => {
  // ** Props
  const { icon, iconProps, componentType } = props
  const IconTag = icon
  let styles
  if (componentType === 'search') {
    // Conditional Props based on component type, like have different font size or icon color
    styles = {
      fontSize: '2rem'
    }
  } else if (componentType === 'vertical-menu') {
    // Conditional Props based on component type, like have different font size or icon color
    styles = {
      fontSize: '1.5rem'
    }
  } else if (componentType === 'horizontal-menu') {
    // Conditional Props based on component type, like have different font size or icon color
    styles = {
      fontSize: '1rem'
    }
  } else {
    return null
  }

  // @ts-ignore
  return <IconTag {...iconProps} style={{ ...styles }} />
}

export default UserIcon
