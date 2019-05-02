export const states = [
  {
    state: 'planned',
    when: a => !a.admitted,
    primaryActions: ['setAdmitted', 'setNoShow', 'setCanceled'],
    secondaryActions: null
  },
  {
    state: 'admitted',
    when: a => a.admitted && !a.treatmentStart,
    primaryActions: ['startTreatment'],
    secondaryActions: ['unsetAdmitted', 'setNoShow', 'setCanceled']
  },
  {
    state: 'treating',
    when: a => a.treatmentStart && !a.treatmentEnd,
    primaryActions: ['endTreatment'],
    secondaryActions: ['unsetAdmitted', 'unsetStartTreatment', 'setNoShow', 'setCanceled']
  },
  {
    state: 'treated',
    when: a => a.treated,
    primaryActions: null,
    secondaryActions: ['unsetAdmitted', 'unsetStartTreatment', 'unsetEndTreatment', 'setNoShow', 'setCanceled']
  }
]

export const currentState = appointment =>
  states.find(s => s.when(appointment))