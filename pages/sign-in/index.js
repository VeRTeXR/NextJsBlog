
import { withApollo } from 'react-apollo'
import { withRouter } from 'next/router'

import Head from 'next/head'
import react from 'react'
import queryString from 'query-string'

import SignInBox from '../../components/SignInBox'
import SignRelatedBox from '../../components/SignRelatedBox'
import SignBoard from '../../components/SignBoard'

import { redirect } from '../../lib/utils'

import { connect } from '../../store'

class SignIn extends react.Component {

  componentWillReceiveProps = (nextProps) => {

    if (nextProps.loggedInUser) {
      //redirect(this.props, '/')
    }
  }
  
  render = () => {

    let { t, router: { asPath, query } } = this.props

    const xQuery = queryString.parse(asPath.split('?')[1])
    if (!query.next && xQuery) {
      query = xQuery
    }


    let addNext = query.next ? `?next=${encodeURIComponent(query.next)}`: ``
    addNext += query.asNext ? `&asNext=${encodeURIComponent(query.asNext)}`: ``


    return (
      <div>
        <Head>
          <title>{`Login`}</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel="shortcut icon" href="/static/frontend/img/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/static/frontend/img/favicon.ico" type="image/x-icon" />
        </Head>
        <SignBoard 
          firstSection={
            <SignRelatedBox boxPosition="left" textType={`Register`} relatedText={`Don’t have an account?`} linkHref={`/sign-up${addNext}`} linkText={`Register`}  />
          }
          secondSection={
            <SignInBox />
          }
        />
      </div>

    )
  }
}

export default withRouter(withApollo(connect(({ loggedInUser }) => ({ loggedInUser }))(SignIn)))