import Head from 'next/head'
import Link from 'next/link'
import {HumeurList} from '../components/HumeurList';
import {PropositionList} from '../components/PropositionList';
import {useSession, signOut} from "next-auth/react"
import React from 'react';

export default function Home() {

  const {data: session} = useSession({required: false}) // Should add serverSideProps so session is loaded on server?

  return (
    <div className="container">
      { session ? <button onClick={() => signOut()}>Sign out</button> : <Link href="/api/auth/signin">Sign-in?</Link>}

      <Head>
        <title>Biotope</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Mieux que des <Link href="/faq/champignons">champignons!</Link>
        </h1>

        <div className="grid">

          <Link href="/b/bx">
            <div className="card">
              <h3>Biotope BX &rarr;</h3>
              <p>Le biotope BX est public et comprend plus de 500 membres.</p>
            </div>
          </Link>

          <Link href="/b/terlinden-1040">
            <div className="card">
              <h3>Biotope Terlinden &rarr;</h3>
              <p>Le biotope Terlinden est privé (seulement sur invitation) et comprend 25 membres.</p>
            </div>
          </Link>

          <Link href="/b/qqpart-1030">
            <div className="card">
              <h3>Biotope 1030 &rarr;</h3>
              <p>Le biotope 1030 est privé (seulement sur invitation) et comprend 25 membres.</p>
            </div>
          </Link>

          <Link href="/profile">
            <div className="card">
              <h3>Vous &rarr;</h3>
              <p>Votre compte, vos cercles, vos biotopes.</p>
            </div>
          </Link>

          <Link href="/humeurs/">
            <div className="card">
              <h3>Humeurs &rarr;</h3>
              <HumeurList />
            </div>
          </Link>

          <Link href="/propositions">
            <div className="card">
              <h3>Propositions &rarr;</h3>
              <PropositionList />
            </div>
          </Link>

        </div>
      </main>


      <style jsx>{`

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 2.5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .grid {
          display: flex;
          align-items: start;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 0.2rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 39%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

    </div>
  )
}
