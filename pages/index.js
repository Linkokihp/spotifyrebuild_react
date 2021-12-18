import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">

      {/* TOPSECTION */}
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      {/* BOTSECTION */}
      <div className="sticky bottom-0">
        <Player />
      </div>

    </div>
  )
}

//To load default stuff
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}