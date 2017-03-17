import React from 'react'
import { shallow } from 'enzyme'
import { ProjectsTableComponent } from './ProjectsTable'

test('shallow-render without crashing', () => {
  /*
   visibleProjects: React.PropTypes.array.isRequired,
   */

  const props = {
    visibleProjects: [],
  }

  shallow(<ProjectsTableComponent {...props} />)
})
