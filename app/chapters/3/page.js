"use client";

import data from "./data.json"
import Viewer from "@/app/components/Viewer";


export default function Page() {
  return <Viewer data={data} color="#8a5091" />;
}
