import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="founders-container">
      <div className="founder-card">
        <h2>Chapter 1 - Medical Terminology</h2>
        <Link href="/chapters/1"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button className="download-cv">Download Book</button>
          <button className="contact-me">Solution Key</button>
        </div>
      </div>
      <div className="founder-card">
        <h2>Chapter 2 - Suffixes</h2>
        <Link href="/chapters/2"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button className="download-cv">Download Book</button>
          <button className="contact-me">Solution Key</button>
        </div>
      </div>
      <div className="founder-card">
        <h2>Chapter 3 - Prefixes</h2>
        <Link href="/chapters/3"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button className="download-cv">Download Book</button>
          <button className="contact-me">Solution Key</button>
        </div>
      </div>
    </div>
  )
}
