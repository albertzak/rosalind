import React from 'react'
import { Box } from '../components/Box'
import { Icon } from '../components/Icon'
import { Table } from '../components/Table'

const colorStyle = {
  borderRadius: 4,
  padding: 4,
  margin: 2,
  width: 30,
  height: 30
}

const structure = ({ getCalendarName, getAssigneeName }) => [
  {
    header: '#',
    field: 'order'
  },
  {
    header: 'Farbe',
    field: 'color',
    render: t => (
      <div style={{...colorStyle, backgroundColor: t.color || '#ccc'}} />
    )
  },
  {
    header: 'Icon',
    field: 'icon',
    render: c => <Icon name={c.icon} />
  },
  {
    header: 'Name',
    field: 'name'
  },
  {
    header: 'Slug',
    field: 'slug'
  },
  {
    header: 'Standard-Termindauer in Minuten',
    field: 'defaultDuration'
  }
]

export const CalendarsScreen = ({ tags, getCalendarName, getAssigneeName, handleUpdate }) =>
  <div className='content'>
    <div className='row'>
      <div className='col-md-12'>
        <Box title='Kalender' icon='tags'>
          <Table
            structure={structure}
            rows={tags}
            getCalendarName={getCalendarName}
            getAssigneeName={getAssigneeName}
            onUpdate={handleUpdate}
          />
        </Box>
      </div>
    </div>
  </div>