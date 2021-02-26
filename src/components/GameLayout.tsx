import React from 'react';
import Image from 'next/image';
import { formatDateFromGame, Game, selectImage } from '../clients/gotd';

type Props = {
  game: Game;
};

export function GameLayout(props: Props) {
  const { game } = props;
  return (
    <div className="flex py-8 text-gray-700 dark:text-gray-100">
      <div className="mr-8" style={{ minWidth: '240px' }}>
        <Image
          src={selectImage(game.image)}
          width={240}
          height={320}
          objectFit="cover"
          objectPosition="center top"
        />
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
        <div className="flex flex-row flex-wrap mb-8 gap-2">
          {game.concepts?.map(concept => (
            <p
              key={concept.id}
              className="bg-yellow-800 p-1 text-sm rounded whitespace-nowrap text-gray-100"
            >
              {concept.name}
            </p>
          ))}
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
