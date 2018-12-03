import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getFamiliesByGuid } from 'redux/selectors'
import { getProject } from 'pages/Project/selectors'
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
import { InlineHeader } from '../../StyledComponents'
import Family from '../family'


const FAMILY_FIELDS = [
  { id: FAMILY_FIELD_DESCRIPTION, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_STATUS, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_NOTES, canEdit: true },
  { id: FAMILY_FIELD_ANALYSIS_SUMMARY, canEdit: true },
  { id: FAMILY_FIELD_INTERNAL_NOTES },
  { id: FAMILY_FIELD_INTERNAL_SUMMARY },
]

const FAMILY_POPUP_STYLE = { maxWidth: '1200px' }

const VariantFamily = ({ project, family }) =>
  <InlineHeader size="small">
    Family<HorizontalSpacer width={5} />
    <PopupWithModal
      hoverable
      style={FAMILY_POPUP_STYLE}
      position="right center"
      keepInViewPort
      trigger={
        <Link to={`/project/${project.projectGuid}/family_page/${family.familyGuid}`}>
          {family.displayName}
        </Link>
      }
      content={<Family family={family} fields={FAMILY_FIELDS} useFullWidth disablePedigreeZoom />}
    />
  </InlineHeader>

VariantFamily.propTypes = {
  project: PropTypes.object,
  family: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  project: getProject(state),
  family: getFamiliesByGuid(state)[ownProps.variant.familyGuid],
})

export default connect(mapStateToProps)(VariantFamily)
