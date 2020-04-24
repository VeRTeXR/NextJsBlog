import {createClient} from "contentful";
import config from "../../config";
import React from "react";
import Head from 'next/head'
import Layout from "../../components/layout";
import utilStyles from '../../styles/utils.module.css'


const client = createClient( {
    space: config.space,
    accessToken: config.accessToken
} );


export default class Detail extends React.Component {

    static async getInitialProps({query}) {
        return {query}
    }

    state = {
        title: "loading", loading: ''
    };

    componentDidMount = async () => {
        console.log( this.props );

        let resp = await client.getEntry( this.props.query.detail );
        console.log( "resp", resp.fields.title );
        this.setState( {title: resp.fields.title} );
    };

    render() {
        return (
            <Layout>
            <Head>
                <title>{this.state.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{this.state.title}</h1>
                <div className={utilStyles.lightText}>
                    {/*<Date dateString={this.state}/>*/}
                </div>
                {/*<div dangerouslySetInnerHTML={{__html: this.state.contentHtml}}/>*/}
            </article>
        </Layout>
        );
    }
};



