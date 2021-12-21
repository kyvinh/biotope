import Link from 'next/link'
import {HumeurList} from '../components/HumeurList';
import {PropositionList} from '../components/PropositionList';

export default function Home() {

  return (
    <div className="container">

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

    </div>
  )
}
