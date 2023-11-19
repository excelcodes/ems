"use client"
import React from "react";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";
export default function App({ children }) {
  const pathname = usePathname()

  React.useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_MEASUREMENT_ID);
  }, []);

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
  },[pathname])
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=.6" />
      </head>
      <body>{children}</body>
    </html>
  )
}