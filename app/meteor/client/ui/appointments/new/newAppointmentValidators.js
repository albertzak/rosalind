export const validateNameCase = (name) => {
  if (name && name.length >= 4) {
    return !!(
      name.match(/^[A-Z][a-z]/) ||
      name.match(/\s/) ||
      name.match(/[a-z][A-Z][a-z]/)
    )
  } else {
    return true
  }
}

export const validateDay = (day) => {
  return (typeof day === 'object' && day.year && day.month && day.day)
}

export const validate = (values) => {
  let errors = {}

  if (values.patientId === 'newPatient') {
    if (!values.lastName) {
      errors.lastName = 'patients.lastNameRequired'
    }

    if (!values.birthday || !validateDay(values.birthday)) {
      errors.birthday = 'patients.birthdayRequired'
    }

    if (!values.telephone) {
      errors.telephone = 'patients.telephoneRequired'
    }

    if (!validateNameCase(values.lastName)) {
      errors.lastName = 'patients.nameCaseWarning'
    }

    if (!validateNameCase(values.firstName)) {
      errors.firstName = 'patients.nameCaseWarning'
    }
  }

  return errors
}
