import React from 'react';
import Image from 'next/image';
import { TwitchGame } from '../clients/igdb';
import { dateFormatter } from '../clients/gotd/utils';

type Props = {
  game: TwitchGame;
};

function selectImage(game: TwitchGame) {
  if (game.cover) {
    return `https:${game.cover.url.replace('t_thumb', 't_cover_big_2x')}`;
  }

  if (game.screenshots) {
    const [first] = game.screenshots;
    return `https:${first.url.replace('t_thumb', 't_cover_big_2x')}`;
  }

  return '';
}

function formatDateFromGame(game: TwitchGame) {
  if (!game.first_release_date) return 'No date listed';

  return dateFormatter(game.first_release_date * 1000);
}

export function IgdbLayout(props: Props) {
  const { game } = props;
  const imgSrc = selectImage(game);

  return (
    <div className="flex py-8 text-gray-700 dark:text-gray-100">
      <div className="mr-8" style={{ minWidth: '240px' }}>
        {imgSrc && (
          <Image
            src={imgSrc}
            width={240}
            height={320}
            objectFit="cover"
            objectPosition="center top"
            role="presentation"
          />
        )}
        {!imgSrc && (
          <div
            className="bg-black flex items-center justify-center text-9xl"
            role="presentation"
            style={{ width: '240px', height: '320px' }}
          >
            ?
          </div>
        )}
      </div>
      <div>
        <p className="font-xs">{formatDateFromGame(game)}</p>
        <h2 className="pb-2 text-2xl font-bold">{game.name}</h2>
        <div className="flex flex-row flex-wrap mb-8 gap-2">
          {game.platforms &&
            game.platforms.map(plat => (
              <p
                key={plat.id}
                className="bg-blue-800 p-1 text-sm rounded whitespace-nowrap text-gray-100"
              >
                {plat.name}
              </p>
            ))}
          {!game.platforms && (
            <p className="text-gray-700 bg-gray-300 p-1 text-sm rounded whitespace-nowrap">
              unknown platforms
            </p>
          )}
        </div>
        <p className="mb-4">{game.summary || 'No short description'}</p>
        <a
          className="underline hover:no-underline"
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on IGDB.com
        </a>
      </div>
    </div>
  );
}
