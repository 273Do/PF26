// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const LOCAL_URL = import.meta.env.LOCAL_URL;

export const SITE_TITLE = "273* Portfolio";
export const SITE_DESCRIPTION = "Hello. I love CREATIVE.";

// ページリンクとタイトル
export const PAGE_LINKS = [
  { title: "Home", href: "" },
  { title: "About", href: "about" },
  { title: "Works", href: "works" },
  { title: "Sandbox", href: "sandbox" },
  { title: "Contact", href: "contact" },
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
  { title: "Note", href: NOTE_LINK || "" },
];

export const CONTACT_SNS_LINKS = [
  { title: "Qiita", href: QIITA_LINK || "" },
  { title: "X (Twitter)", href: X_LINK || "" },
  {
    title: "YouTube",
    href: YOUTUBE_LINK || "",
  },
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

// 3Dモデルに同時に表示するオーバーレイrectの最大数
export const MAX_RECTS = 5;

// オーバーレイrectの+記号の座標
export const CORNER_POSITIONS: [string, string][] = [
  ["-translate-x-1/2 -translate-y-1/2", "left-0 top-0"],
  ["translate-x-1/2 -translate-y-1/2", "right-0 top-0"],
  ["-translate-x-1/2 translate-y-1/2", "left-0 bottom-0"],
  ["translate-x-1/2 translate-y-1/2", "right-0 bottom-0"],
];

// オーバーレイrect表示用divのクラス名
export const BlOB_TRACKING_ClASS = {
  // 枠線
  border:
    "border-[0.5px] border-dashed border-muted-foreground pointer-events-none box-border",
  // 斜線
  diagonalLine:
    "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(180,180,180,0.2) 3px, rgba(180,180,180,0.2) 4px)",
  // ラベル
  label:
    "absolute right-0 bottom-full font-mono text-xs text-secondary whitespace-nowrap bg-primary",
  // 座標
  coord:
    "dark:mix-blend-difference absolute left-0 top-full font-mono text-xs text-primary whitespace-nowrap",
  // +記号
  plus: "absolute font-mono text-base leading-none font-bold text-muted-foreground",
};

const C = {
  lightGray: "\x1b[37m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  bg: "\x1b[48;5;m",
  bgWhite: "\x1b[107m",
  black: "\x1b[30m",
  underline: "\x1b[4m",
  reset: "\x1b[0m",
};

const link = (url: string, text: string) =>
  `\x1b]8;;${url}\x07${C.underline}${text}\x1b]8;;\x07${C.reset}`;

export const SELF_INTRO = `
  ${C.lightGray}${C.bold}____ _____ _____        ${C.reset}${C.gray}${C.bold}__    __           _${C.reset}
 ${C.lightGray}${C.bold}|___ |___  |___ /__/\\__ ${C.reset}${C.gray}${C.bold}/ / /\\ \\ \\___  _ __| | _____${C.reset}
   ${C.lightGray}${C.bold}__) | / /  |_ \\     / ${C.reset}${C.gray}${C.bold}\\ \\/  \\/ / _ \\| '__| |/ / __|${C.reset}
  ${C.lightGray}${C.bold}/ __/ / /  ___) /_  _\\ ${C.reset}${C.gray}${C.bold} \\  /\\  | (_) | |  |   <\\__ \\${C.reset}
 ${C.lightGray}${C.bold}|_____/_/  |____/  \\/     ${C.reset}${C.gray}${C.bold}\\/  \\/ \\___/|_|  |_|\\_|___/${C.reset}


${C.bgWhite}${C.black}273* (tuna-sand)${C.reset}
Hello! I'm a developer who loves ${C.bold}Experimental Creative${C.reset}.

${C.bgWhite}${C.black}Role${C.reset}${C.gray} : Develop, Graphic Design, Sensor Analysis, Piano${C.reset}
${C.bgWhite}${C.black}Portfolio${C.reset}${C.gray} : ${link(import.meta.env.URL || import.meta.env.LOCAL_URL, import.meta.env.URL || import.meta.env.LOCAL_URL)}${C.reset}

${C.bgWhite}${C.black}GitHub${C.reset}${C.gray} : ${link(GITHUB_LINK, "273Do")}${C.reset}
${C.bgWhite}${C.black}Discord${C.reset}${C.gray} : ${link(DISCORD_LINK, "273")}${C.reset}
${C.bgWhite}${C.black}X(Twitter)${C.reset}${C.gray} : ${link(X_LINK, "@273Do")}${C.reset}
${C.bgWhite}${C.black}Note${C.reset}${C.gray} : ${link(NOTE_LINK, "273*")}${C.reset}
${C.bgWhite}${C.black}Qiita${C.reset}${C.gray} : ${link(QIITA_LINK, "@273Do")}${C.reset}
${C.bgWhite}${C.black}YouTube${C.reset}${C.gray} : ${link(YOUTUBE_LINK, "imperiRwrath")}${C.reset}
`;
