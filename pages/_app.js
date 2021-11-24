import { SessionProvider } from 'next-auth/react'
import '../scss/main.scss'

export default function App ({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} >
      <Component {...pageProps} />
    </SessionProvider >
  )
}