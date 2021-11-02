import Head from 'next/head'
import Link from 'next/link'
import { HumeursList } from '../components/humeur-list';

export default function Home() {
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
          Sondage des habitants
        </p>

        <div className="grid">

          <Link href="/profile">
            <div className="card">
              <h3>Vous &rarr;</h3>
              <p>Votre compte, votre cercle, vos biotopes.</p>
            </div>
          </Link>

          <Link href="/humeurs/">
            <div className="card">
              <h3>Humeurs &rarr;</h3>
              <HumeursList />
            </div>
          </Link>

          <Link href="/propositions">
            <div className="card">
              <h3>Propositions &rarr;</h3>
              <p>Soutien pour la directrice faisant-fonction de Claire-Joie</p>
              <p>Activités Claire-Joie</p>
              <p>CST dans l'HORECA</p>
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
          padding: 5rem 0;
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
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
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
