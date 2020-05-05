
import { withApollo } from 'react-apollo'
import { withRouter } from 'next/router'

import gql from 'graphql-tag'
import react from 'react'
import { cleanEmail, redirect, messageContains, invalidFeedback, invalidClass, deleteAllCookies } from '../lib/utils'

// import SignWithSocialMediaButtons from './SignWithSocialMediaButtons'

import Link from 'next/link'

const signUpMutation = gql`
  mutation SignUp($input: CreateUserInput!) {
    signUp(input: $input) {
      clientMutationId
    }
  }
`

class SignUpBox extends react.Component {

  elms = {}
  email = ''
  
  state = {
    errors: {}
  }

  onSubmit = (e) => {
    e.preventDefault()

    let {displayName, email, password} = this.elms
    const { router: { query: { next, asNext } } } = this.props
    let addNext = next ? `?next=${encodeURIComponent(next)}`: ``
    addNext += asNext ? `&asNext=${encodeURIComponent(asNext)}`: ``

    this.email = cleanEmail(email.value)
    
    this.props.client.mutate({
      mutation: signUpMutation,
      variables: {
        input: {
          user: {
            displayName: displayName.value, 
            email: this.email,
            password: password.value
          }
        }
      }
    })
    .then(({ data, error }) => {
      this.props.client.cache.reset().then(() => {
        redirect({}, `/sign-up/complete?email=${this.email}${addNext.replace('?', '&')}`)
      })
    })
    .catch(({ graphQLErrors, networkError }) => {

      let errors = {}

      graphQLErrors.forEach((error) => {

        if (messageContains(error.message, ['email', 'already exists'])) {
          errors.email = this.props.t(`This email already exists. If you have an account, please sign in`)
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
    let addNext = next ? `?next=${next}`: ``
    addNext += asNext ? `&asNext=${asNext}`: ``

    return (
      <div className={`sign-form`}>
        <h2 className={`text-center text-md-left`}>{`Register`}</h2>

        <form onSubmit={this.onSubmit}>
        <div className={`mb-3 mt-4`}>
            <input name="displayName" type="text" className={`form-control ${invalidClass(errors.displayName)}`} placeholder={`Display Name`} maxLength="200" required ref={node => {elms.displayName = node}} />
            {invalidFeedback(errors.displayName)}
          </div>
        <div className={`mb-3`}>
            <input type="email" className={`form-control ${invalidClass(errors.email)}`} placeholder={`Email Address`} maxLength="200" required ref={node => {elms.email = node}} />
            {invalidFeedback(errors.email)}
          </div>
          <div className={`mb-3`}>
            <input type="password" className={`form-control ${invalidClass(errors.password)}`} placeholder={`Password`} maxLength="50" required minLength="6" ref={node => {elms.password = node}} autoComplete="off" />
            {invalidFeedback(errors.password)}
          </div>
          <input name="next" type="hidden" value={next} ref={node => {elms.next = node}} />
          <div>
            <button className={`btn btn-primary btn--full`}>{`Register`}</button>
          </div>
        </form>  

        <p className={`small text-center text-secondary`}>
          {`or Connect with Social Media`}
        </p>

        {/*<SignWithSocialMediaButtons />*/}

        {/* <div className={`d-block d-md-none mt-3`}>
          <p className={`text-center font-weight-bold`}>
            {t(`Hey! I have an account.`)}
          </p>
          <div className={`text-center`}>
            <Link prefetch href={`/sign-in${addNext}`}>
              <a className={`btn btn-light`}>{t(`Login`)}</a>
            </Link>
          </div>
        </div> */}

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
              padding: 2rem
            }
          }
        `}</style>

      </div>
    )
  }
}

export default withRouter((withApollo(SignUpBox)))