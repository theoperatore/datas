import React from 'react';
import Image from 'next/image';
import { formatDateFromGame, Game, selectImage } from '../clients/gotd';

type Props = {
  game: Game;
};

export function GameLayout(props: Props) {
  const { game } = props;
  return (
    <div className="flex justify-center py-8 text-gray-700 dark:text-gray-100 m-auto max-w-prose">
      <div className="mr-8" style={{ minWidth: '350px' }}>
        <Image
          src={selectImage(game.image)}
          width={350}
          height={350}
          objectFit="contain"
        />
      </div>
      <div>
        <p className="font-xs">{formatDateFromGame(game)}</p>
        <h2 className="pb-2 text-2xl font-bold">{game.name}</h2>
        <div className="flex flex-row mb-8 gap-2">
          {game.platforms &&
            game.platforms.map(plat => (
              <p
                key={plat.id}
                className="bg-blue-800 p-1 text-sm rounded whitespace-nowrap"
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
        <p className="mb-4">{game.deck || 'No short description'}</p>
        <a
          className="underline hover:no-underline"
          href={game.site_detail_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Giantbomb
        </a>
      </div>
    </div>
  );
}
