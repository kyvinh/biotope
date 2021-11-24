import Head from 'next/head'
import {SessionProvider} from 'next-auth/react'
import '../scss/main.scss'
import Layout from '../components/layout'

export default function App({Component, pageProps}) {
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