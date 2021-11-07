import Head from 'next/head'
import Link from 'next/link'
import { HumeurList } from '../components/HumeurList';
import { PropositionList } from '../components/PropositionList';
import { useSession, signIn } from "next-auth/client"
import React, { useEffect } from 'react';

export default function Home() {

  const [session, loading ] = useSession()

  /*
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])
  */
  return (
    <div className="container">
      <Head>
        <title>Biotope Terlinden</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Mieux que des <Link href="/faq/champignons">champignons!</Link>
        </h1>

        <p className="description">
          Sondage des habitants de la résidence Terlinden
        </p>

        <div className="grid">

          <div className="card">
            <h3>Vous avez été invité(e) à ce biotope de la part de xyz &rarr;</h3>
            <p>Vous êtes enregistré sous l'email {session?.user.email}. Veuillez renseigner votre nom ou pseudo: <input/></p>
          </div>

          <Link href="/profile">
            <div className="card">
              <h3>Vous &rarr;</h3>
              <p>Votre compte, vos cercles, vos biotopes.</p>
            </div>
          </Link>

          <div className="card">
            <h3>Biotope Terlinden &rarr;</h3>
            <p>Le biotope Terlinden est un Cercle Fermé (seulement sur invitation) et comprend 25 membres. Pour toute information, veuillez contacter xyz.</p>
          </div>

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
