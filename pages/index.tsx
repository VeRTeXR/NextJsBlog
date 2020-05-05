import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

import Link from 'next/link'
import Date from '../components/date'
import config from "../config.json";
import { createClient } from "contentful";

import Router from "next/router";
import { withApollo } from 'react-apollo';

const client = createClient({
    space: config.space,
    accessToken: config.accessToken
});

function Home(props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[TEST INTRODUCTIONS]</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
            {props.allPosts.map( (post) => (
                <li className={utilStyles.listItem} key={post.sys.id}>
                    <Link href={"/posts/[detail]"} as={`/posts/${post.sys.id}`}>
                        <a>{post.fields.title}</a>
                    </Link>
                </li>
            ) )}
        </ul>
        
        <div>
          <button onClick= {GoToSignUpPage} className={`btn btn-primary btn--full`}>{'SIGNUP'}</button>
        </div>
      </section>
    </Layout>
  )
}

function GoToSignUpPage() {
  Router.push("/sign-up")
}

Home.getInitialProps = async () => {
    // Get every entries in contentful from type Article, sorted by date.
    // article is the ID of the content model we created on the dashboard.
    const entries = await client.getEntries({
        content_type: "article",
        order: "-fields.date"
    });

    // Inject in props of our screen component
    return { allPosts: entries.items };
};


export default withApollo(Home)