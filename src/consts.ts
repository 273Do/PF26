// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Astro Blog";
export const SITE_DESCRIPTION = "Welcome to my website!";

// ページリンクとタイトル
export const PAGE_LINKS = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Works", href: "/works" },
  { title: "Showcase", href: "/showcase" },
  { title: "Contact", href: "/contact" },
] as const;

// snsリンクとタイトル
const GITHUB_LINK = import.meta.env.PUBLIC_GITHUB_LINK;
const DISCORD_LINK = import.meta.env.PUBLIC_DISCORD_LINK;
const YOUTUBE_LINK = import.meta.env.PUBLIC_YOUTUBE_LINK;
const X_LINK = import.meta.env.PUBLIC_X_LINK;
const QIITA_LINK = import.meta.env.PUBLIC_QIITA_LINK;
const NOTE_LINK = import.meta.env.PUBLIC_NOTE_LINK;
const KOFI_LINK = import.meta.env.PUBLIC_KOFI_LINK;

export const SNS_LINKS = [
  { title: "GitHub", href: GITHUB_LINK || "" },
  { title: "Discord", href: DISCORD_LINK || "" },
  {
    title: "YouTube",
    href: YOUTUBE_LINK || "",
  },
];

export const CONTACT_SNS_LINKS = [
  { title: "X (Twitter)", href: X_LINK || "" },
  { title: "Qiita", href: QIITA_LINK || "" },
  { title: "Note", href: NOTE_LINK || "" },
];

export const SUPPORT_LINKS = [
  {
    title: "Ko-fi",
    href: KOFI_LINK || "",
  },
];

export const MAIL_ADDRESS = import.meta.env.MAIL_ADDRESS;

export const COPYRIGHT_THIS_YEAR = Number(
  import.meta.env.PUBLIC_COPYRIGHT_THIS_YEAR,
);
