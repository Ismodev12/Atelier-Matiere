import type { SocialKey } from "@/lib/types";

const paths: Record<SocialKey, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
    </>
  ),
  facebook: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" fill="currentColor" />,
  tiktok: <path d="M16.6 3c.3 2 1.6 3.4 3.4 3.6v3a7.2 7.2 0 0 1-3.4-1v6.3a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.7 2.4V3h3z" fill="currentColor" />,
  pinterest: (
    <path d="M12 2.5a9.5 9.5 0 0 0-3.5 18.3c-.1-.8-.2-2 0-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9.5 9.5 0 1 0 12 2.5z" fill="currentColor" />
  ),
  linkedin: (
    <path d="M6.5 8.8H3.6V20h2.9V8.8zM5 4a1.7 1.7 0 1 0 0 3.4A1.7 1.7 0 0 0 5 4zm15 9.6c0-3-.7-5-4.1-5-1.6 0-2.7.9-3.2 1.7V8.8H9.9V20h2.9v-5.6c0-1.5.3-2.9 2.1-2.9s1.9 1.7 1.9 3V20H20v-6.4z" fill="currentColor" />
  ),
};

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
};

export function SocialIcon({ name, size = 18 }: { name: SocialKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {paths[name]}
    </svg>
  );
}
