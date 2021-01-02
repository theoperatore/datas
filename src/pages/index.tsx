import { GetStaticProps } from 'next';
import Head from 'next/head';
import useSwr from 'swr';
import { Game, getRandomGotd } from '../clients/gotd';
import { getRandomGame, TwitchGame } from '../clients/igdb';
import { GameLayout } from '../components/GameLayout';
import { IgdbLayout } from '../components/IgdbLayout';
import Nav from '../components/Nav';

type Props = {
  igdbGame: TwitchGame | null;
  game: Game | null;
  error: string;
};

async function apiFetcher(url: string) {
  const response = await (await fetch(url)).json();
  return response.result;
}

function useGBGame(initial: Game | null) {
  return useSwr<Game>('/api/v1/games/random', apiFetcher, {
    initialData: initial,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });
}

function useIgdbGame(initial: TwitchGame | null) {
  return useSwr<TwitchGame>('/api/v1/games/random?client=igdb', apiFetcher, {
    initialData: initial,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });
}

export default function IndexPage(props: Props) {
  const gb = useGBGame(props.game);
  const igdb = useIgdbGame(props.igdbGame);

  function handleRandomize() {
    gb.revalidate();
    igdb.revalidate();
  }

  return (
    <div>
      <Head>
        <title>Random game</title>
      </Head>
      <Nav isRandomizing={gb.isValidating} onRandomize={handleRandomize} />
      <div className="max-w-prose m-auto">
        {props.error && (
          <p className="text-gray-700 dark:text-gray-100">{props.error}</p>
        )}
        {gb.data && <GameLayout game={gb.data} />}
        {igdb.data && <IgdbLayout game={igdb.data} />}
      </div>
    </div>
  );
}

type R = ReturnType<GetStaticProps<Props>>;
export async function getStaticProps(): Promise<R> {
  let game: Game | null = null;
  let igdbGame: TwitchGame | null = null;
  let error = '';
  try {
    game = await getRandomGotd(process.env.GB_TOKEN);
    igdbGame = await getRandomGame(
      process.env.TWITCH_CLIENT,
      process.env.TWITCH_SECRET,
    );
  } catch (error) {
    game = null;
    error = error.message;
  }

  return {
    props: {
      game,
      igdbGame,
      error,
    },
    revalidate: 10,
  };
}
