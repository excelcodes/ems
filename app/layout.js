"use client"
import React from "react";
import "./globals.css";

import ReactGA from "react-ga4";

export default function RootLayout({ children }) {
  React.useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_MEASUREMENT_ID);
    ReactGA.send({ hitType: "pageview", page: "/", title: "EMS" });
  }, []);
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=.6" />
      </head>
      <body>{children}</body>
    </html>
  )
}
