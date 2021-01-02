import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import { Game, getRandomGotd } from '../clients/gotd';
import { GameLayout } from '../components/GameLayout';
import Nav from '../components/Nav';

type Props = {
  game: Game | null;
  error: string;
};

export default function IndexPage(props: Props) {
  return (
    <div>
      <Head>
        <title>Random game</title>
      </Head>
      <Nav />
      <div className="py-15">
        {props.error && (
          <p className="text-gray-700 dark:text-gray-100">{props.error}</p>
        )}
        {props.game && <GameLayout game={props.game} />}
      </div>
    </div>
  );
}

type R = ReturnType<GetStaticProps<Props>>;
export async function getStaticProps(): Promise<R> {
  let game: Game | null = null;
  let error = '';
  try {
    game = await getRandomGotd(process.env.GB_TOKEN);
  } catch (error) {
    game = null;
    error = error.message;
  }

  return {
    props: {
      game,
      error,
    },
    revalidate: 10,
  };
}

// type SSR = ReturnType<GetServerSideProps<Props>>;
// export async function getServerSideProps(): Promise<SSR> {
//   let game: Game | null = null;
//   let error = '';
//   try {
//     game = await getRandomGotd(process.env.GB_TOKEN);
//   } catch (error) {
//     game = null;
//     error = error.message;
//   }

//   return {
//     props: {
//       game,
//       error,
//     },
//   };
// }
