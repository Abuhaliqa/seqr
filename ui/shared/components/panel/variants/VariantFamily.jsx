import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { getFamiliesByGuid } from 'redux/selectors'
import {
  FAMILY_FIELD_DESCRIPTION,
  FAMILY_FIELD_ANALYSIS_STATUS,
  FAMILY_FIELD_ANALYSIS_NOTES,
  FAMILY_FIELD_ANALYSIS_SUMMARY,
  FAMILY_FIELD_INTERNAL_NOTES,
  FAMILY_FIELD_INTERNAL_SUMMARY,
} from 'shared/utils/constants'
import { HorizontalSpacer } from '../../Spacers'
import PopupWithModal from '../../PopupWithModal'
import Family from '../family'


const FAMILY_FIELDS = [
  { id: FAMILY_FIELD_DESCRIPTION, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_STATUS, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_NOTES, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_SUMMARY, canEdit: true },
  { id: FAMILY_FIELD_INTERNAL_NOTES },
  { id: FAMILY_FIELD_INTERNAL_SUMMARY },
]

const InlineHeader = styled(Header)`
  display: inline-block;
  margin-right: 1em !important;
  margin-bottom: 0 !important;
`

const FAMILY_POPUP_STYLE = { maxWidth: '1200px' }

const VariantFamily = ({ family }) =>
  <InlineHeader size="small">
    Family<HorizontalSpacer width={5} />
    <PopupWithModal
      hoverable
      style={FAMILY_POPUP_STYLE}
      position="right center"
      keepInViewPort
      trigger={
        <Link to={`/project/${family.projectGuid}/family_page/${family.familyGuid}`}>
          {family.displayName}
        </Link>
      }
      content={<Family family={family} fields={FAMILY_FIELDS} useFullWidth disablePedigreeZoom />}
    />
  </InlineHeader>

VariantFamily.propTypes = {
  family: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  family: getFamiliesByGuid(state)[ownProps.variant.familyGuid],
})

export default connect(mapStateToProps)(VariantFamily)
