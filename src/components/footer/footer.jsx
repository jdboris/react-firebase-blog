export function Footer({ useSettings }) {
  const { socialLinks, business } = useSettings();
  console.log(business);

  return (
    <footer>
      {socialLinks.length > 0 && (
        <>
          <nav>
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                <img src={link.iconUrl} alt="social icon" />
              </a>
            ))}
          </nav>
        </>
      )}
      {business && business.name && (
        <div>
          © {new Date().getFullYear()} {business.name}
        </div>
      )}
    </footer>
  );
}
