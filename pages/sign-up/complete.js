import { withRouter } from 'next/router'

import queryString from 'query-string'

import Link from 'next/link'
import Layout from '../../components/Layout'


export default withRouter(({ t, router: { asPath, query } }) => {

  const xQuery = queryString.parse(asPath.split('?')[1])
  if (!query.next && xQuery) {
    query = xQuery
  }

  let addNext = query.next ? `&next=${encodeURIComponent(query.next)}`: ``
  addNext += query.asNext ? `&asNext=${encodeURIComponent(query.asNext)}`: ``

  return (
    <Layout>
      <div className={`sign-box sign-up-complete-box`}>
        <div className={`full-part`}>
          <div >
            <h2 className={`text-center mb-4`}>{`Your registration has been completed.`}</h2>
            {/* <p>
              {t(`To ensure that our mailing list contains only those who wish to be on it, we have sent a confirmation link to your email address.`)}
            </p>
            <p>
              {t(`Please sign in to your email account and find the email we have just sent you. It may be in your Spam/Bulk/Junk folder. To complete the process of being added to our mailing list, just click the link in that email.`)}
            </p> */}
          </div>
          <div className={`text-center`}>
            <Link prefetch href={`/sign-in?email=${query.email}${addNext}`}>
              <a className={`btn btn-primary`}>{`Login`}</a>
            </Link>
          </div>
        </div>

        <style jsx>{`
        .full-part {
          background: #fff;
          padding: 4rem .5rem;
          min-height: 400px;
        }
          .sign-up-complete-box {
          }
        `}</style>
      </div>
    </Layout>
  )
})