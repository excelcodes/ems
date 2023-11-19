"use client"
import React from "react";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function App({ children }) {

  const pathname = usePathname()

  React.useEffect(() => {
    withReactContent(Swal).fire({
      title: "أحتاج مساعدة",
      text: "لو تحب تساعد مطور الموقع عشان يستمر بتقديم الأفضل سويله كونسبت ماب.\nللتفاصيل تواصل عالرقم 0502563890"
    })
    ReactGA.initialize(process.env.NEXT_PUBLIC_MEASUREMENT_ID);
  }, []);

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
  }, [pathname])
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=.6" />
      </head>
      <body>{children}</body>
    </html>
  )
}