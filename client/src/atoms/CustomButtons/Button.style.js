const buttonStyle = (theme) => ({
  button: {
    minHeight: 'auto',
    minWidth: 'auto',
    border: 'none',
    position: 'relative',
    padding: `${theme.spacing(1.5)}px ${theme.spacing(3.5)}px`,
    margin: '.3125rem 1px',
    fontSize: '12px',
    willChange: 'box-shadow, transform',
    transition:
      'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.42857143',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
  }
});

export default buttonStyle;
