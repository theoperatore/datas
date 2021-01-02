import { GetStaticProps, GetStaticPropsContext } from 'next';
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
        {props.error && <p>{props.error}</p>}
        {props.game && <GameLayout game={props.game} />}
      </div>
    </div>
  );
}

type R = ReturnType<GetStaticProps<Props>>;
type C = GetStaticPropsContext;
export async function getStaticProps(context: C): Promise<R> {
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
    revalidate: 60,
  };
}
