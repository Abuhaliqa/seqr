/**
 * Top-level page layout that consists of the standard seqr header and footer, with arbitrary
 * content in-between.
 */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Grid } from 'semantic-ui-react'
import { Route } from 'react-router-dom'

import Header from './Header'
import PageHeader from './PageHeader'
import Footer from './Footer'

const LayoutContainer = styled.div`
  height: calc(100% - 32px);
`

const ContentGrid = styled(Grid)`
  padding-top: 15px !important;
  min-height: calc(100% - 46px);
`

const BaseLayout = ({ children }) =>
  <LayoutContainer>
    <Header />
    <ContentGrid>
      <Route path="/:entity/:entityGuid?/:breadcrumb?/:breadcrumbId*" component={PageHeader} />
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          {children}
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </ContentGrid>
    <Footer />
  </LayoutContainer>

export { BaseLayout as BaseLayoutComponent }

BaseLayout.propTypes = {
  children: PropTypes.node,
}

export default BaseLayout
