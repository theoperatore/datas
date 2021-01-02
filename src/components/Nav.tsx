// const links = []
export default function Nav() {
  return (
    <nav>
      <ul className="flex items-center justify-end py-8 max-w-prose m-auto">
        <li>
          <button
            className="text-blue-500 no-underline text-accent-1 dark:text-blue-300"
            onClick={() => window.location.reload()}
          >
            Randomize
          </button>
        </li>
        {/* <ul className="flex items-center justify-between space-x-4">
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <a href={href} className="no-underline btn-blue">
                {label}
              </a>
            </li>
          ))}
        </ul> */}
      </ul>
    </nav>
  );
}
