import map from 'lodash/map'
import { mapPatientToFields } from '../mapPatientToFields'
import { autofill, touch, untouch } from 'redux-form'
import { Search } from '../../../api/search'
import { Patients } from '../../../api/patients'

export const PATIENT_CHANGE_INPUT_VALUE = 'PATIENT_CHANGE_INPUT_VALUE'
export const PATIENT_CHANGE_VALUE = 'PATIENT_CHANGE_VALUE'
export const PATIENT_LOAD_START = 'PATIENT_LOAD_START'
export const PATIENTS_RESULTS_LOADED = 'PATIENTS_RESULTS_LOADED'

export const changeInputValue = (inputValue, fieldAction) => {
  return (dispatch) => {
    dispatch({
      type: PATIENT_CHANGE_INPUT_VALUE,
      inputValue,
      fieldAction
    })

    if (inputValue && inputValue.length >= 1) {
      Search.actions.patientsWithAppointments
        .callPromise({ query: inputValue })
        .then(patients => {
          dispatch({
            type: PATIENTS_RESULTS_LOADED,
            patients
          })
        })
    }
  }
}

export const changeValue = (patient, fieldAction, ownProps) => {
  return (dispatch, getState) => {
    dispatch({
      type: PATIENT_CHANGE_VALUE,
      patient,
      fieldAction
    })

    // Autofill form fields when patient is selected, and the
    // picker is part of a form.
    // Setting initialValues would overwrite other form sections,
    // eg. tag is lost when patient changes
    if (ownProps.formName) {
      const matchedPatient =
        (patient && patient.patientId === 'newPatient')
        ? { ...patient, lastName: getState().patientPicker.inputValue }
        : patient

      const fields = mapPatientToFields(matchedPatient)

      console.log('[PatientPicker] actions: changeValue: Autofilling', fields)

      map(fields, (value, field) =>
        dispatch(autofill(ownProps.formName, `patient.${field}`, value))
      )

      // Reveal validation errors only if actual patient was selected
      const setTouched = patient && patient.patientId !== 'newPatient'
      dispatch(touchPatientFields(ownProps.formName, { setTouched }))
    }
  }
}

export const touchPatientFields = (formName, { setTouched = true } = {}) => {
  // Note: need to touch patient.contacts[0] and [1] separately
  const changedFields = [
    ...Object.keys(mapPatientToFields()).map(k => `patient.${k}`),
    'patient.contacts[0].value',
    'patient.contacts[1].value'
  ]
  return (setTouched
    ? touch(formName, ...changedFields)
    : untouch(formName, ...changedFields)
  )
}

export const loadPatient = (patientId) => {
  return (dispatch) => {
    dispatch({
      type: PATIENT_LOAD_START,
      patientId
    })

    Patients.actions.findOne.callPromise({ _id: patientId })
      .then(patient => {
        // HACK: Get rid of hardcoded form name
        dispatch(changeValue(patient, 'load', { formName: 'newAppointment' }))
      })
  }
}