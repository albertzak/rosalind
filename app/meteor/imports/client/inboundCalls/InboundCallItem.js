import Alert from 'react-s-alert'
import React from 'react'
import { __ } from '../../i18n'
import { zerofix } from '../../util/zerofix'
import { Stamps } from '../helpers/Stamps'
import { CommentsContainer, HumanCommentCount } from '../comments'
import { LinkToAppointmentContainer } from './LinkToAppointmentContainer'
import { InboundCallsTopics } from '../../api/inboundCalls'
import { highlightBackground, highlightColor } from '../layout/styles'
import { InlineEdit } from '../components/form'
import { prompt } from '../layout/Prompt'
import { TopicPicker } from './TopicPicker'
import { PatientName } from '../patients/PatientName'

export class InboundCallItem extends React.Component {
  render () {
    const {
      inboundCall,
      showTopic,
      unresolve,
      resolve,
      edit,
      canResolve,
      canEdit,
      patient,
      fullNameWithTitle
    } = this.props

    const {
      lastName,
      firstName,
      note,
      topicId,
      removed,
      telephone,
      pinnedBy,
      _id
    } = inboundCall

    const topic = showTopic && InboundCallsTopics.findOne({ _id: topicId })
    const topicLabel = topic && topic.label

    const style = pinnedBy ? pinnedStyle : null

    const handleTopicEdit = async () => {
      const newId = await prompt({
        // title: 'Verschieben',
        Component: TopicPicker,
        initialValue: topicId
      })
      await edit(_id, 'topicId')(newId)
      Alert.success(__('ui.moved'))
    }

    return (
      <div className='box box-widget' style={style}>
        <div className='box-header'>
          <h4 className='username enable-select'>
            {
              (lastName || firstName) &&
                <>
                  <InlineEdit
                    onChange={edit(_id, 'lastName')}
                    canEdit={canEdit}
                    value={lastName}
                    placeholder={__('inboundCalls.lastName')}
                    noUI
                  >
                    <b>{lastName}</b>
                  </InlineEdit>

                  &nbsp;

                  <InlineEdit
                    onChange={edit(_id, 'firstName')}
                    canEdit={canEdit}
                    placeholder={__('inboundCalls.firstName')}
                    value={firstName}
                    noUI
                  />
                </>
            }

            {
              (patient || inboundCall.patient) &&
                <PatientName patient={(patient || inboundCall.patient)} />
            }

            &ensp;

            <small
              onClick={canEdit ? handleTopicEdit : null}
              style={canEdit ? { cursor: 'pointer'} : null}
            >
              {topicLabel || (canEdit && __('inboundCalls.thisOpen'))}
            </small>
          </h4>
          {telephone &&
            <InlineEdit
              onChange={edit(_id, 'telephone')}
              canEdit={canEdit}
              value={zerofix(telephone)}
              noUI
              placeholder={__('inboundCalls.telephone')}
              fullWidth>
              <h3 className='description enable-select'>{zerofix(telephone)}</h3>
            </InlineEdit>
          }
        </div>
        <div className='box-body'>
          <blockquote>
            <InlineEdit
              onChange={edit(_id, 'note')}
              canEdit={canEdit}
              multiline
              value={note}
              noUI
              fullWidth>
              <p className='enable-select pre-wrap'>{note}</p>
            </InlineEdit>

          </blockquote>

          <LinkToAppointmentContainer inboundCall={inboundCall} />
          <HumanCommentCount docId={_id} />
          <Stamps
            collectionName='inboundCalls'
            fields={['removed', 'created']}
            doc={inboundCall}
          />
        </div>
        <CommentsContainer docId={_id} style={style} />
        <div className='box-footer'>
          {
            ((pinnedBy && canResolve) || !pinnedBy)
              ? (
                removed
                  ? <a onClick={() => unresolve(_id)}>{__('inboundCalls.unresolve')}</a>
                  : <a onClick={() => resolve(_id)}>{__('inboundCalls.resolve')}</a>
              ) : <span className='text-muted'>
                {__('inboundCalls.pinnedBy', { name: fullNameWithTitle && fullNameWithTitle(pinnedBy) })}
              </span>
          }
        </div>
      </div>
    )
  }
}

const pinnedStyle = {
  backgroundColor: highlightBackground,
  color: highlightColor
}
