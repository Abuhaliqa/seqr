import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Menu, Header, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getUser } from 'redux/selectors'

import AwesomeBar from './AwesomeBar'

const HeaderMenu = styled(Menu)`
  padding-left: 100px;
  padding-right: 100px;
`

const PageHeader = React.memo(({ user }) =>
  <HeaderMenu borderless inverted attached>
    <Menu.Item as={Link} to="/"><Header size="medium" inverted>seqr</Header></Menu.Item>
    {Object.keys(user).length ? [
      <Menu.Item key="summary_data" as={Link} to="/summary_data" content="Summary Data" />,
      user.isAnalyst ? <Menu.Item key="report" as={Link} to="/report" content="Reports" /> : null,
      user.isDataManager ? <Menu.Item key="data_management" as={Link} to="/data_management" content="Data Management" /> : null,
      <Menu.Item key="awesomebar" fitted="vertically"><AwesomeBar newWindow inputwidth="350px" /></Menu.Item>,
      <Menu.Item key="spacer" position="right" />,
      <Dropdown item key="user" trigger={<span>Logged in as <b>{user.displayName || user.email}</b></span>}>
        <Dropdown.Menu>
          <Dropdown.Item icon="write" text="Edit User Info" onClick={console.log} />
        </Dropdown.Menu>
      </Dropdown>,
      <Menu.Item key="logout" as="a" href="/logout">Log out</Menu.Item>,
    ] : <Menu.Item as="a" href="/login" position="right">Log in</Menu.Item>}
  </HeaderMenu>,
)

PageHeader.propTypes = {
  user: PropTypes.object,
}

// wrap top-level component so that redux state is passed in as props
const mapStateToProps = state => ({
  user: getUser(state),
})

export { PageHeader as PageHeaderComponent }

export default connect(mapStateToProps)(PageHeader)
