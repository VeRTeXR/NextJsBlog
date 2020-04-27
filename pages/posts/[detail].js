import {createClient} from "contentful";
import config from "../../config";
import React from "react";
import Head from 'next/head'
import Layout from "../../components/layout";
import utilStyles from '../../styles/utils.module.css'
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const client = createClient( {
    space: config.space,
    accessToken: config.accessToken
} );


export default class Detail extends React.Component {

    static async getInitialProps({query}) {
        return {query}
    }

    state = {
        title: "loading",
        date: '',
        body: '',
        author: '',
        imageUrl: '',

    };

    componentDidMount = async () => {
        console.log( this.props );

        let resp = await client.getEntry( this.props.query.detail );
        console.log( "resp", resp.fields);
        console.log(resp.fields.author.fields.firstname)
        this.setState( {
            title: resp.fields.title,
            date: resp.fields.date,
            body: resp.fields.body,
            authorFirstName: resp.fields.author.fields.firstname,
            authorLastName: resp.fields.author.fields.lastname,
            imageUrl: resp.fields.image.fields.file.url,
                } );
    };

    render() {
        return (
            <Layout>
            <Head>
                <title>{this.state.title}</title>
            </Head>
            <article>
                <img src={this.state.imageUrl} className="img-responsive img-fit-cover" style={{ height: 265 }} />
                <h1 className={utilStyles.headingXl}>{this.state.title}</h1>
                <div className={utilStyles.lightText}>
                    {new Date (this.state.date).toDateString()}
                </div>
                <div dangerouslySetInnerHTML={{__html: documentToHtmlString(this.state.body)}}/>
                <div className="card-footer">
                    <div className="tile">
                        <div className="tile-content">
                            <p className="tile-title">By {this.state.authorFirstName + " "+this.state.authorLastName}</p>
                        </div>
                    </div>
                </div>
            </article>
        </Layout>
        );
    }
};



