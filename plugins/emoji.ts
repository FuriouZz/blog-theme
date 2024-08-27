import type Site from "lume/core/site.ts";

import { full } from "npm:markdown-it-emoji@3.0.0";
import emojies_defs from "npm:markdown-it-emoji@3.0.0/lib/data/full.mjs";

const notoCSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
span.emoji {
  font-family: "Noto Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-style: normal;
}`;

interface IToken {
  markup: string;
  content: string;
}

export default function emoji() {
  return (site: Site) => {
    site.hooks.addMarkdownItPlugin(full, {
      defs: { ...emojies_defs, dino: "🦕" },
    });

    site.hooks.addMarkdownItRule("emoji", (tokens: IToken[], idx: number) => {
      return `<span class="emoji emoji_${tokens[idx].markup}">${
        tokens[idx].content
      }</span>`;
    });

    site.process([".html"], (pages) => {
      for (const page of pages) {
        const style = page.document?.createElement("style");
        if (!style) return;
        style.textContent = notoCSS;
        page.document?.head.append(style);
      }
    });
  };
}
