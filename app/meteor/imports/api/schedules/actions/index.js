import { Users } from '../../users'
import { addUserToDay } from './addUserToDay'
import { removeUserFromDay } from './removeUserFromDay'
import { postRequest } from './postRequest'
import { approveRequest } from './approveRequest'
import { declineRequest } from './declineRequest'
import { softRemove } from './softRemove'
import { upsert } from './upsert'
import { setNote } from './setNote'
import { upsertDefaultSchedule } from './upsertDefaultSchedule'

export default ({ Schedules }) => {
  return {
    addUserToDay: addUserToDay({ Schedules, Users }),
    removeUserFromDay: removeUserFromDay({ Schedules, Users }),
    postRequest: postRequest({ Schedules, Users }),
    approveRequest: approveRequest({ Schedules, Users }),
    declineRequest: declineRequest({ Schedules, Users }),
    softRemove: softRemove({ Schedules }),
    upsert: upsert({ Schedules, Users }),
    setNote: setNote({ Schedules }),
    upsertDefaultSchedule: upsertDefaultSchedule({ Schedules })
  }
}
