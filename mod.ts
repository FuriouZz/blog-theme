import type Site from "lume/core/site.ts";
import plugins, { type Options } from "./plugins.ts";

export type { Options } from "./plugins.ts";

export default function (options: Partial<Options> = {}) {
  return (site: Site) => {
    // Configure the site
    site.use(plugins(options));

    // Add remote files
    const themeFiles = [
      "_includes/css/fonts.css",
      "_includes/css/navbar.css",
      "_includes/css/page.css",
      "_includes/css/post-list.css",
      "_includes/css/post.css",
      "_includes/css/reset.css",
      "_includes/css/badge.css",
      "_includes/css/variables.css",
      "_includes/css/search.css",
      "_includes/css/comments.css",
      "_includes/layouts/archive_result.vto",
      "_includes/layouts/archive.vto",
      "_includes/layouts/base.vto",
      "_includes/layouts/page.vto",
      "_includes/layouts/post.vto",
      "_includes/templates/post-details.vto",
      "_includes/templates/post-list.vto",
      "fonts/inter.woff2",
      "fonts/inter-italic.woff2",
      "fonts/epilogue-bold.woff2",
      "posts/_data.yml",
      "_data.yml",
      "_data/i18n.yml",
      "404.md",
      "archive_result.page.js",
      "archive.page.js",
      "index.vto",
      "styles.css",
      "favicon.png",
      "js/main.js",
    ];

    for (const file of themeFiles) {
      site.remoteFile(
        file,
        `https://deno.land/x/lume_theme_simple_blog@v0.13.3/src/${file}`,
      );
    }

    const myFiles = [
      "_includes/layouts/base.vto",
      "_includes/layouts/post.vto",
      "_includes/templates/post-giscus.vto",
      "pages/_data.yml",
      "posts/_data.yml",
    ];

    for (const file of myFiles) {
      site.remoteFile(file, import.meta.resolve(`./theme/${file}`));
    }
  };
}
