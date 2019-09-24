import React from 'react'
import { PatientName } from '../patients/PatientName'
import { Patients, Media } from '../../api'
import { withTracker } from '../components/withTracker'
import { withState, withHandlers } from 'recompose'
import { Icon } from '../components/Icon'
import { MediaTags } from './MediaTags'

export const SidebarComponent = ({ patient, media }) =>
  <div style={containerStyle}>
    <PatientName
      patient={patient}
      style={patientNameStyle}
    />
    <Explorer />
    <MediaTags media={media} />
    <Edit media={media} />
    <Navigation />
  </div>

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(50,50,50,0.8)',
  height: '100%',
  justifyContent: 'space-between'
}

const patientNameStyle = {
  padding: 10,
  display: 'inline-block'
}

const Explorer = () =>
  <div style={explorerStyle}>
    &nbsp;
  </div>

const explorerStyle = {
  flexGrow: 1
}

const Edit = withHandlers({
  handleRotate: ({ media }) => e => {
    console.log('rotate', (((media.rotation || 0) + 90) % 360))
    Media.actions.update.callPromise({
      mediaId: media._id,
      update: {
        rotation: (((media.rotation || 0) + 90) % 360)
      }
    })
  }
})(({ handleRotate }) =>
  <div style={editStyle}>
    <Button><Icon name='trash-o' /></Button>
    <Button><Icon name='crop' /></Button>
    <Button onClick={handleRotate}><Icon name='retweet' /></Button>
  </div>
)

const editStyle = {
  display: 'flex',
  height: 56
}

const Navigation = () =>
  <div style={navigationStyle}>
    <Button><Icon name='chevron-left' /></Button>
    <Button><Icon name='chevron-right' /></Button>
  </div>

const navigationStyle = {
  display: 'flex',
  height: 90
}

const Button = withState('hover', 'setHover')(({ children, hover, setHover, ...props }) =>
  <div
    style={hover ? hoverButtonStyle : buttonStyle}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    {...props}
  >
    <div style={buttonInnerStyle}>
      {children}
    </div>
  </div>
)

const buttonStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  cursor: 'pointer'
}

const buttonInnerStyle = {
  textAlign: 'center',
  flex: 1
}

const hoverButtonStyle = {
  ...buttonStyle,
  opacity: 1,
  backgroundColor: 'rgba(255,255,255,0.1)'
}

const composer = props => {
  const { patientId } = props

  const patient = Patients.findOne({ _id: patientId })
  return {
    ...props,
    patient
  }
}

export const Sidebar = withTracker(composer)(SidebarComponent)
