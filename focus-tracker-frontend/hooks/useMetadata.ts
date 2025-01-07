import { useEffect, useState } from "react";
export interface Metadata {
  title: string;
  description: string;
}
export function useMetadata() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    setMetadata({
      title: "Focus Tracker",
      description:
        "Track and improve your focus with our Pomodoro timer and analytics.",
    });
  }, []);

  return metadata;
}
