import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <a
          href="https://tapza.in"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <Image
            className={styles.logo}
            src="/TapZaLogo.png"
            alt="TapZa logo"
            width={50}
            height={50}
            priority
          />
          <span className={styles.companyName}>TapZa</span>
        </a>

        <ol>
          <li>
            Welcome to the <b>TapZa Backend Assignment</b> project.
          </li>
          <li>
            Explore the codebase and learn how the backend is structured.
          </li>
          <li>
            Visit the GitHub repository for source code and documentation.
          </li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/github.svg"
              alt="GitHub logo"
              width={20}
              height={20}
            />
            View Repository
          </a>
          <a
            href="https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment#readme"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read Documentation
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Issues
        </a>
        <a
          href="https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment/pulls"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Pull Requests
        </a>
        <a
          href="https://github.com/kokkondaBhanuteja/TapZa-Backend-Assignment"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to GitHub →
        </a>
      </footer>
    </div>
  );
}
