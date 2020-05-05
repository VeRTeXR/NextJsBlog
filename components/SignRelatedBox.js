
import { withRouter } from 'next/router'

import Link from 'next/link'

import theme from './../styles/theme'

export default withRouter((({t, pathname, boxPosition, linkHref, linkText, relatedText, router: { query: { next, asNext } }}) => {
  

  let addNext = next ? `?next=${encodeURIComponent(next)}`: ``
  addNext += asNext ? `&asNext=${encodeURIComponent(asNext)}`: ``

  return (
    <div className={`sign-relate-box text-center text-md-left order-2 order-md-1`}>
      <div className={`sign-relate-logo d-none d-md-block`}>
        <Link prefetch href={`/`}>
          <a className={pathname === '/' ? 'is-active' : ''}>
            <h1><img src="/static/frontend/img/logo-eArena.png" srcSet="/static/frontend/img/logo-eArena@2x.png 2x" alt="eArena" /></h1>
          </a>
        </Link>
      
      </div>
      

      <div className={`sign-relate-content`}>
        <h3 className={`sign-relate-label`}>
          {relatedText}
        </h3>
        <div className={`sign-relate-link`}>
          {linkHref?
          <Link prefetch href={linkHref} as={linkHref}>
            <a className={`btn btn-primary mr-1`}>{linkText}</a>
          </Link>
          : ``}
        </div>
      </div>

      <style jsx>{`
        .sign-relate-box {
          flex: 0 0 100%;
          padding: 1rem;
          min-height: auto;
        }
        .sign-relate-label { font-size: 1.35rem; }
        .sign-relate-link .btn {
          background-color: var(--secondary);
          border-color: var(--secondary)
        }

        @media (min-width: 768px) {  
          .sign-relate-box {
            background-color: ${theme.colors.default};
            min-height: 400px;
            flex: 0 0 55%;
            padding: 2rem;
            display: flex !important;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: space-between;
            border-radius: ${boxPosition == 'left' ? '10px 0 0 10px' : '0 10px 10px 0'};
          }
          .sign-relate-label { 
            color: white; 
            font-size: 1.65rem
          }
          .sign-relate-link .btn {
            background-color: var(--primary);
            border-color: var(--primary)
          }
        }

      `}</style>
    </div>
  )
}))