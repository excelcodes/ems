"use client";

import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <><div className="founders-container">
      <div className="founder-card">
        <h2>Chapter 1 - Medical Terminology</h2>
        <Link href="/chapters/1"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button onClick={() => window.open("/ch1.pdf", "_blank")} className="download-cv">Download Book</button>
          <button onClick={() => window.open("/ch1-notes.pdf", "_blank")} className="contact-me">Solution Key</button>
        </div>
      </div>
      <div className="founder-card">
        <h2>Chapter 2 - Suffixes</h2>
        <Link href="/chapters/2"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button onClick={() => window.open("/ch2.pdf", "_blank")} className="download-cv">Download Book</button>
          <button onClick={() => window.open("/ch2-notes.pdf", "_blank")} className="contact-me">Solution Key</button>
        </div>
      </div>
      <div className="founder-card">
        <h2>Chapter 3 - Prefixes</h2>
        <Link href="/chapters/3"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          <button onClick={() => window.open("/ch3.pdf", "_blank")} className="download-cv">Download Book</button>
          <button onClick={() => window.open("/ch3-notes.pdf", "_blank")} className="contact-me">Solution Key</button>
        </div>
      </div>
      <div className="founder-card">
        <h2>Previous</h2>
        <Link href="/previous"><button className="practice-button">Practice</button></Link>
        <br />
        <br />
        <div className="buttons">
          {/* <button onClick={() => window.open("/ch3.pdf", "_blank")} className="download-cv">Download Book</button>
          <button onClick={() => window.open("/ch3-notes.pdf", "_blank")} className="contact-me">Solution Key</button> */}
        </div>
      </div>
    </div>
    <p style={{ opacity: 0.01 }}>ابو بكر عم ريزوان</p>
    </>
  )
}
