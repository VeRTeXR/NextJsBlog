
import react from 'react'
import { withApollo } from 'react-apollo'
import Link from 'next/link'
import { connect } from '../store'


class SignBoard extends react.Component {
  
  render = () => {

    const t = this.props.t
    const loggedInUser = this.props.loggedInUser

    return (
      <div className={`sign-box sign-in-box`}>
        <div className={`card`}>
          {this.props.firstSection}
          {this.props.secondSection}
        </div>
        <div className={`back text-center text-lg-left`}>
        <Link prefetch href={`/`}>
          <a className={`text-white small`}>
            {'Back to Home'}
          </a>
        </Link>

        {/*<div className={`row justify-content-center mt-3 no-gutters ${!loggedInUser || !loggedInUser.isStaff ? ``: ``}`}>*/}
        {/*  <div className={`col-3 col-lg-4`}>*/}
        {/*    <div className={`wrapper-language-switcher`}>*/}
        {/*      /!*<ChangeLanguageMenu />*!/*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        
        
      </div>

      <style jsx>{`
          
        .card {
          flex-wrap: wrap;
          display: flex;
          flex-direction: row;
          width: 100%;
          max-width: 900px;
          margin: 1.5rem 1.5rem 0;
          border: none;
          border-radius: var(--border-radius);
        }
        .sign-box {
          background-image: url(/static/frontend/img/bg-sign.jpg);
          background-position: top center;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          background-size: cover;
          overflow: hidden;
        }
        .back {
          max-width: 900px;
          width: 100%;
          margin: 1rem 0;
        }

        @media (min-width: 992px) {   
          .sign-box {
            flex-direction: column;
          }
        }

        .wrapper-language-switcher {
          background: var(--white);
          border-radius: 30px;
          padding: 0.25rem 0.5rem;
        }

        `}</style>
      </div>
    )
  }
}

export default withApollo(connect(({ loggedInUser }) => ({ loggedInUser }))(SignBoard))