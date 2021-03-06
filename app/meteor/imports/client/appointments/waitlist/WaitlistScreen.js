import React from 'react'
import { WaitlistItem } from './WaitlistItem'
import FlipMove from 'react-flip-move'
import Modal from 'react-bootstrap/lib/Modal'
import { __ } from '../../../i18n'
import Button from '@material-ui/core/Button'
import { UserPicker } from '../../users/UserPicker'
import { hasRole } from '../../../util/meteor/hasRole'

export class WaitlistScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      changingAssignee: false
    }

    this.handleStartChangeWaitlistAssignee = this.handleStartChangeWaitlistAssignee.bind(this)
    this.handleFinishChangeWaitlistAssignee = this.handleFinishChangeWaitlistAssignee.bind(this)
  }

  handleStartChangeWaitlistAssignee ({ appointmentId }) {
    this.setState({
      changingAssignee: true,
      changingAssigneeAppointmentId: appointmentId,
      changingAssigneeNewId: null
    })
  }

  handleFinishChangeWaitlistAssignee () {
    this.props.action(
      'changeWaitlistAssignee',
      this.state.changingAssigneeAppointmentId,
      {},
      {
        waitlistAssigneeId: this.state.changingAssigneeNewId
      }
    ).fn()

    this.setState({
      changingAssignee: false,
      changingAssigneeAppointmentId: null,
      changingAssigneeNewId: null
    })
  }

  render () {
    const {
      appointments,
      action,
      canViewAllWaitlists,
      handleChangeAssigneeView,
      canChangeWaitlistAssignee,
      telemedicineWorker
    } = this.props

    return (
      <div className='content'>
        {
          (telemedicineWorker || canViewAllWaitlists) &&
            <div className='hide-print' style={{ paddingBottom: 15 }}>
              <UserPicker
                autoFocus
                onChange={handleChangeAssigneeView}
                filter={a => (
                  canViewAllWaitlists ||
                  a._id === Meteor.userId() ||
                  (telemedicineWorker && hasRole(a._id, ['telemedicine-provider'])))}
              />
            </div>

        }
        <FlipMove style={containerStyle}>
          {
            appointments.map((appointment, i) => (
              <div key={appointment._id}>
                <WaitlistItem
                  isFirst={i === 0}
                  isLast={i === (appointments.length - 1)}
                  appointment={appointment}
                  action={action}
                  handleChangeWaitlistAssignee={this.handleStartChangeWaitlistAssignee}
                  canChangeWaitlistAssignee={canChangeWaitlistAssignee}
                  history={appointment.history}
                />
              </div>
            ))
          }
        </FlipMove>

        <Modal
          enforceFocus={false}
          show={!!this.state.changingAssignee}
          bsSize='small'>
          <Modal.Body>
            <UserPicker
              autoFocus
              onChange={newAssigneeId =>
                this.setState({
                  changingAssigneeNewId: newAssigneeId
                })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <div className='pull-left'>
              <Button onClick={() => this.setState({ changingAssignee: false })}>
                {__('ui.close')}
              </Button>
            </div>
            <div className='pull-right'>
              <Button color='primary' onClick={this.handleFinishChangeWaitlistAssignee}>
                {__('ui.ok')}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}

const containerStyle = {
  padding: 12
}
