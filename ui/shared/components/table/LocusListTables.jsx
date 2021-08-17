import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { getLocusListsByGuid, getLocusListsIsLoading } from 'redux/selectors'
import { UpdateLocusListButton, DeleteLocusListButton } from '../buttons/LocusListButtons'
import DataTable from './DataTable'
import { VerticalSpacer } from '../Spacers'
import {
  LOCUS_LIST_FIELDS, LOCUS_LIST_NAME_FIELD, LOCUS_LIST_NUM_ENTRIES_FIELD, LOCUS_LIST_LAST_MODIFIED_FIELD_NAME,
  LOCUS_LIST_DESCRIPTION_FIELD, LOCUS_LIST_IS_PUBLIC_FIELD_NAME, LOCUS_LIST_CURATOR_FIELD_NAME,
} from '../../utils/constants'

const FilterContainer = styled.div`
  position: relative;
  top: -60px;
  margin-bottom: -60px;
  text-align: right;
`

const EDIT_FIELD = 'edit'
const NAME_WITH_LINK_FIELD = 'nameWithLink'
const NUM_PROJECTS_FIELD = 'numProjects'

const FIELD_LOOKUP = LOCUS_LIST_FIELDS.reduce(
  (acc, { name, label, fieldDisplay, width }) => ({
    ...acc,
    [name]: {
      name,
      width: Math.min(width, 6),
      content: label,
      format: fieldDisplay ? val => fieldDisplay(val[name]) : null,
    },
  }), {},
)
FIELD_LOOKUP[NAME_WITH_LINK_FIELD] = {
  ...FIELD_LOOKUP[LOCUS_LIST_NAME_FIELD],
  format: locusList => <Link to={`/summary_data/gene_lists/${locusList.locusListGuid}`}>{locusList.name}</Link>,
}
FIELD_LOOKUP[EDIT_FIELD] = {
  name: '',
  format: locusList => ([
    <UpdateLocusListButton key="edit" locusList={locusList} />,
    <DeleteLocusListButton key="delete" iconOnly locusList={locusList} />,
  ]),
  width: 1,
}
FIELD_LOOKUP[NUM_PROJECTS_FIELD] = {
  name: NUM_PROJECTS_FIELD,
  content: 'Projects',
  width: 1,
  format: null,
}

const CORE_FIELDS = [
  NAME_WITH_LINK_FIELD, LOCUS_LIST_NUM_ENTRIES_FIELD, LOCUS_LIST_DESCRIPTION_FIELD, LOCUS_LIST_LAST_MODIFIED_FIELD_NAME,
  NUM_PROJECTS_FIELD,
]

const MY_TABLE = {
  name: 'My',
  tableFields: [...CORE_FIELDS, LOCUS_LIST_IS_PUBLIC_FIELD_NAME, EDIT_FIELD],
}
const PUBLIC_TABLE = {
  name: 'Public',
  tableFields: [...CORE_FIELDS, LOCUS_LIST_CURATOR_FIELD_NAME],
}
const TABLES = [MY_TABLE, PUBLIC_TABLE]

const getLocusListFilterVal = list =>
  [LOCUS_LIST_NAME_FIELD, LOCUS_LIST_DESCRIPTION_FIELD].map(key => list[key] || '').join()

const LocusListTables = React.memo(({ locusListsByGuid, fields, omitLocusLists, tableButtons, ...tableProps }) => {
  let data = Object.values(locusListsByGuid)
  if (omitLocusLists) {
    data = data.filter(locusList => !omitLocusLists.includes(locusList.locusListGuid))
  }

  const tableData = data.reduce((acc, locusList) => {
    if (locusList.canEdit) {
      acc.My.push(locusList)
    } else if (locusList.isPublic) {
      acc.Public.push(locusList)
    }
    return acc
  }, { My: [], Public: [] })

  return TABLES.map(
    ({ name, tableFields }) =>
      <div key={name}>
        <VerticalSpacer height={5} />
        <Header size="large" dividing content={`${name} Gene Lists`} />
        <DataTable
          basic="very"
          fixed
          idField="locusListGuid"
          defaultSortColumn="name"
          columns={(fields || tableFields).map(field => FIELD_LOOKUP[field])}
          data={tableData[name]}
          getRowFilterVal={getLocusListFilterVal}
          filterContainer={FilterContainer}
          {...tableProps}
        />
        {tableButtons && tableButtons[name]}
      </div>,
  )
})

LocusListTables.propTypes = {
  locusListsByGuid: PropTypes.object,
  fields: PropTypes.array,
  omitLocusLists: PropTypes.array,
  tableButtons: PropTypes.node,
}


const mapStateToProps = state => ({
  locusListsByGuid: getLocusListsByGuid(state),
  loading: getLocusListsIsLoading(state),
})

export default connect(mapStateToProps)(LocusListTables)
