import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import react from 'react'
import { withRouter } from 'next/router'

import { cleanEmail, validateEmail, messageContains, invalidFeedback, invalidClass, deleteAllCookies } from '../lib/utils'
import authComplete from '../lib/auth-complete'

import Link from 'next/link'


const signInMutation = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`

class SignInBox extends react.Component {

  elms = {}

  constructor(props) {
    super()
    this.state = {
      email: (validateEmail(props.router.query.email) && props.router.query.email) || '',
      errors: {}
    }
  }

  componentDidMount = () => {
    if (this.state.email) {
      this.elms.password.focus()
    }
  }

  // =====================
  // Sign in with email
  // =====================

  onSubmit = (e) => {
    e.preventDefault()

    let {email, password} = this.elms

    const { router: { query: { next, asNext } } } = this.props

    this.props.client.mutate({
      mutation: signInMutation,
      variables: {
        email: cleanEmail(email.value), 
        password: password.value
      }
    })
    .then(({ data, error }) => {
      authComplete(this.props.client, data.tokenAuth.token, next, asNext)
    })
    .catch(({ graphQLErrors, networkError }) => {
      let errors = {}

      graphQLErrors.forEach((error) => {

        if (messageContains(error.message, ['enter valid credentials'])) {
          errors.password = `Your email and password are mismatched`
        } else if (messageContains(error.message, ['decoding', 'signature'])) {
          deleteAllCookies()
        }
      })

      this.setState({errors: errors})
    })

  }

  // ============================
  // Render Zone
  // ============================

  render = () => {

    const elms = this.elms
    const errors = this.state.errors
    const { t, router: { query: { next, asNext } } } = this.props
    let addNext = next ? `?next=${decodeURIComponent(next)}`: ``
    addNext += asNext ? `&asNext=${decodeURIComponent(asNext)}`: ``


    return (
      <div className={`sign-form order-1 order-md-2`}>
        <h2 className={`text-center text-md-left`}>{`Login`}</h2>
  
        <form onSubmit={this.onSubmit}>     
          <div className={`mb-3 mt-4`}>
            <input name="email" type="email" className={`form-control ${invalidClass(errors.password)}`} placeholder={`Email Address`} maxLength="200" required ref={node => {elms.email = node}} defaultValue={this.state.email} />
          </div>
          <div className={`mb-3`}>
            <input name="password" type="password" className={`form-control ${invalidClass(errors.password)}`} placeholder={`Password`} maxLength="50" required ref={node => {elms.password = node}} autoComplete="off" />
            {invalidFeedback(errors.password)}
          </div>
          <div>
            <button className={`btn btn-primary btn--full`}>{`Login`}</button>
          </div>
        </form>

        <p className={`small text-center text-secondary`}>
          <Link prefetch href={`/forgot-password` + addNext} as={`/forgot-password` + addNext}>
            <a className={`ml-1`}>{`Forgot password`}?</a>
          </Link>
        </p>

        <p className={`small text-center text-secondary`}>
          {`or Connect with Social Media`}
        </p>

        {/* <SignWithSocialMediaButtons /> */}

        <style jsx>{`
          .sign-form {
            background: var(--white);
            flex: 0 0 100%;
            padding: 2rem 1rem 1rem;
            border-top-right-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
            border-top-left-radius: var(--border-radius);
          }
            
          @media (min-width: 768px) {  
            .sign-form {
              flex: 0 0 45%;
              padding: 2rem;
              border-bottom-right-radius: var(--border-radius);
            }
          }
        `}</style>
      </div>
    
    )
  }
}

export default withApollo(withRouter(SignInBox))