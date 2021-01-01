import Nav from '../components/Nav';

export default function IndexPage() {
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-5xl text-center text-gray-700 dark:text-gray-100">
          Random Game
        </h1>
      </div>
    </div>
  );
}
