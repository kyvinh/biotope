import Head from 'next/head'
import {SessionProvider} from 'next-auth/react'
import '../scss/main.scss'
import Layout from '../components/Layout'
import {AppProps} from "next/app";

// https://next-auth.js.org/tutorials/securing-pages-and-api-routes

export default function App({  Component,
                                pageProps: { session, ...pageProps },
                            }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Biotope</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}