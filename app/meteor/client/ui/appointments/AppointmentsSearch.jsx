import moment from 'moment'
import identity from 'lodash/identity'
import React from 'react'
import Select from 'react-select'
import { TAPi18n } from 'meteor/tap:i18n'
import { Appointments } from 'api/appointments'
import { Users } from 'api/users'
import { Icon } from 'client/ui/components/Icon'
import { UserHelper } from 'client/ui/users/UserHelper'
import { PatientName } from 'client/ui/patients/PatientName'
import { Birthday } from 'client/ui/patients/Birthday'
import { getColor } from './getColor'
import style from './appointmentsSearchStyle'

const findAppointments = (query) => {
  if (query && query.length > 1) {
    return Appointments.actions.search.callPromise({ query }).then((patientsWithAppointments) => {
      let options = []
      let lastPatient = null

      patientsWithAppointments.forEach((result) => {
        if (lastPatient !== result.patient) {
          lastPatient = result.patient
          options.push({
            value: `patient-${result.patient && result.patient._id}`,
            patient: result.patient
          })
        }

        result.appointments.forEach((appointment) => {
          options.push({
            label: `appointment-${appointment._id}`,
            assignee: appointment.assigneeId && Users.findOne({ _id: appointment.assigneeId }),
            value: appointment._id,
            appointment
          })
        })
      })

      return { options }
    })
  } else {
    return new Promise((resolve) => {
      resolve([])
    })
  }
}

class AppointmentSearchResult extends React.Component {
  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  handleMouseDown (event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onSelect(this.props.option, event)
  }

  handleMouseEnter (event) {
    this.props.onFocus(this.props.option, event)
  }

  handleMouseMove (event) {
    if (this.props.isFocused) { return }
    this.props.onFocus(this.props.option, event)
  }

  render () {
    const { patient, appointment } = this.props.option
    let tagColor, start
    if (appointment) {
      tagColor = getColor(appointment.tags)
      start = moment(appointment.start)
    }

    return (
      <div className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}>

        {
          patient && <span>
            <span className={style.name}>{patient && <PatientName patient={patient} />}&emsp;</span>
            {
              patient.profile && patient.profile.birthday &&
                <span className={style.birthday}>{patient && <Birthday day={patient.profile.birthday} veryShort />}</span>
            }
          </span>
        }
        {
          appointment && <span className={style.appointment} style={{borderColor: tagColor}}>
            <span>
              {start.format(TAPi18n.__('time.dateFormat'))}
              &nbsp;
              {TAPi18n.__('time.at')}
              &nbsp;
              {start.format(TAPi18n.__('time.timeFormat'))}
            </span>
            &emsp;
            {
              appointment.assigneeId &&
                <UserHelper userId={appointment.assigneeId} helper="fullNameWithTitle" />
            }
          </span>
        }
      </div>
    )
  }
}

const AppointmentSelected = ({ value }) => (
  <div className="Select-value">
    <span className="Select-value-label">
      {value.patient && <PatientName patient={value.patient} />}
    </span>
  </div>
)

export class AppointmentsSearch extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }

    this.handleQueryChange = this.handleQueryChange.bind(this)
  }

  handleQueryChange (query) {
    this.setState({
      ...this.state,
      query: query
    })
  }

  render () {
    return (
      <Select.Async
        value={this.state.query}
        onChange={this.handleQueryChange}
        loadOptions={findAppointments}
        cache={false}
        ignoreCase={false}
        autofocus={false}
        placeholder={TAPi18n.__('appointments.search')}
        loadingPlaceholder={TAPi18n.__('appointments.searching')}
        searchPromptText={'Suche nach PatientInnen, Geburtsdatum'}
        filterOptions={identity}
        optionComponent={AppointmentSearchResult}
        valueComponent={AppointmentSelected} />
    )
  }
}