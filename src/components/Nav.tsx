type Props = {
  isRandomizing: boolean;
  onRandomize: () => void;
};
// const links = []

export default function Nav({ isRandomizing, onRandomize }: Props) {
  return (
    <nav>
      <ul className="flex items-center py-8 max-w-prose m-auto">
        <li>
          <button
            className="text-blue-500 no-underline text-accent-1 dark:text-blue-300"
            onClick={onRandomize}
            disabled={isRandomizing}
          >
            {isRandomizing ? 'Fetching...' : 'Randomize'}
          </button>
        </li>
      </ul>
    </nav>
  );
}
