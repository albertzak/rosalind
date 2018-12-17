import React from 'react'
import { compose, withState, nest, mapProps, withProps, withHandlers, renderComponent } from 'recompose'
import Paper from '@material-ui/core/Paper'
import { ErrorBoundary } from '../layout/ErrorBoundary'
import Button from '@material-ui/core/Button'
import { Icon } from '../components/Icon'
import { sidebarBackground, sidebarText } from '../layout/styles'

const triggerHeight = 220
const triggerContainerStyle = {
  position: 'fixed',
  right: -10,
  top: '50%',
  marginTop: triggerHeight / -2,
  height: triggerHeight,
  width: 33,
  zIndex: 1061
}

const triggerLatchStyle = {
  height: '100%',
  display: 'flex',
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  backgroundColor: '#dbdddf'
}

const triggerLatchLabelStyle = {
  color: '#687e95',
  transform: 'rotate(-90deg) translateX(-10px) translateY(20px)',
  transformOrigin: 'left bottom 0',
  width: 50
}

const closeTriggerStyle = {
  position: 'fixed',
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
  zIndex: 1060
}

const drawerStyle = {
  position: 'fixed',
  right: 0,
  top: 0,
  bottom: 0,
  width: 800,
  zIndex: 1062,
  paddingTop: 15,
  paddingLeft: 15,
  paddingRight: 15,
  paddingBottom: 0
}

// Apparently { display: 'none' } resets state of children
const hiddenStyle = {
  opacity: 0,
  pointerEvents: 'none'
}

const Drawer = ({ isOpen, handleOpen, handleClose, children = null }) =>
  <div>
    <div
      style={triggerContainerStyle}
      onMouseEnter={handleOpen}
      onMouseOver={handleOpen}
    >
      <Paper
        elevation={3}
        style={triggerLatchStyle}
      >
        <div style={triggerLatchLabelStyle}>
          <Icon name='life-ring' /> Hilfe
        </div>
      </Paper>
    </div>
    <div
      style={isOpen ? closeTriggerStyle : hiddenStyle}
      onMouseEnter={handleClose}
    />
    <Paper
      elevation={10}
      square
      style={isOpen ? drawerStyle : hiddenStyle}
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Paper>
  </div>

export const withDrawer = Component => props => {
  const { handleDrawerOpen, handleDrawerClose, isDrawerOpen } = props
  return (
    <Drawer
      handleOpen={handleDrawerOpen}
      handleClose={handleDrawerClose}
      isOpen={isDrawerOpen}
    >
      <Component
        {...props}
      />
    </Drawer>
  )
}
