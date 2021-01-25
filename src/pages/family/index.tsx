import Head from 'next/head';

export default function FamilyTable() {
  return (
    <>
      <Head>
        <title>Family tree</title>
      </Head>
      <div className="py-6 max-w-prose m-auto text-gray-700 dark:text-gray-100">
        <p>
          A table, which makes it easy to find a Person and who they are
          connected to. Easily add a new person, and link them to other Persons.
        </p>
      </div>
    </>
  );
}
