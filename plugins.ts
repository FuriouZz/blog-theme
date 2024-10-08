import date, { type Options as DateOptions } from "lume/plugins/date.ts";
import postcss, {
  type Options as PostCSSOptions,
} from "lume/plugins/postcss.ts";
import terser, { type Options as TerserOptions } from "lume/plugins/terser.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls, {
  type Options as SlugifyUrlsOptions,
} from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas, { type Options as MetasOptions } from "lume/plugins/metas.ts";
import pagefind, {
  type Options as PagefindOptions,
} from "lume/plugins/pagefind.ts";
import sitemap, {
  type Options as SitemapOptions,
} from "lume/plugins/sitemap.ts";
import feed, { type Options as FeedOptions } from "lume/plugins/feed.ts";
import readingInfo, {
  type Options as ReadingInfoOptions,
} from "lume/plugins/reading_info.ts";
import picture, {
  type Options as PictureOptions,
} from "lume/plugins/picture.ts";
import transform_images, {
  type Options as TransformImagesOptions,
} from "lume/plugins/transform_images.ts";

import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import type { Options as TocOptions } from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc/mod.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.7.0/image.ts";
import type { Options as ImageOptions } from "https://deno.land/x/lume_markdown_plugins@v0.7.0/image/mod.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.7.0/footnotes.ts";
import type { Options as FootNotesOptions } from "https://deno.land/x/lume_markdown_plugins@v0.7.0/footnotes/mod.ts";

import emoji from "./plugins/emoji.ts";
import showLabel, {
  type Options as ShowLabelOptions,
} from "./plugins/showLabel.ts";
import shikiji, {
  shikijiExtra,
  type Options as ShikijiOptions,
} from "./plugins/shikiji.ts";

export interface Options {
  shikiji?: ShikijiOptions;
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
  transform_images?: Partial<TransformImagesOptions>;
  toc?: Partial<TocOptions>;
  picture?: Partial<PictureOptions>;
  readingInfo?: Partial<ReadingInfoOptions>;
  feed?: Partial<FeedOptions>;
  sitemap?: Partial<SitemapOptions>;
  showLabel?: Partial<ShowLabelOptions>;
  image?: Partial<ImageOptions>;
  footnotes?: Partial<FootNotesOptions>;
  metas?: Partial<MetasOptions>;
  postcss?: Partial<PostCSSOptions>;
  terser?: Partial<TerserOptions>;
  slugifyUrls?: Partial<SlugifyUrlsOptions>;
}

/** Configure the site */
export default function (options: Options = {}) {
  return (site: Lume.Site) => {
    site
      .use(postcss(options.postcss))
      .use(basePath())
      .use(toc(options.toc))
      .use(readingInfo(options.readingInfo))
      .use(date(options.date))
      .use(metas(options.metas))
      .use(image(options.image))
      .use(footnotes(options.footnotes))
      .use(resolveUrls())
      .use(slugifyUrls(options.slugifyUrls))
      .use(terser(options.terser))
      .use(pagefind(options.pagefind))
      .use(sitemap(options.sitemap))
      .use(emoji())
      .use(picture(options.picture))
      .use(transform_images(options.transform_images))
      .use(showLabel(options.showLabel))
      .use(
        shikiji(
          options.shikiji ?? {
            highlighter: {
              themes: ["github-dark", "github-light"],
              langs: [
                "javascript",
                "yaml",
                "markdown",
                "bash",
                "json",
                "typescript",
                "css",
              ],
            },
            themes: {
              dark: "github-dark",
              light: "github-light",
            },
            cssFile: "/styles/shikiji.css",
            useColorScheme: true,
          },
        ),
      )
      .use(shikijiExtra({ copyFiles: true }))
      .use(
        feed({
          output: ["/feed.xml", "/feed.json"],
          query: "type=post",
          info: {
            title: "=metas.site",
            description: "=metas.description",
          },
          items: {
            title: "=title",
          },
        }),
      )
      .copy("fonts")
      .copy("js")
      .copy("favicon.png")
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /<!--\s*more\s*-->/i,
          )[0];
        }
      });

    // Basic CSS Design System
    site.remoteFile(
      "_includes/css/ds.css",
      "https://unpkg.com/@lumeland/ds@0.4.0/ds.css",
    );

    // Mastodon comment system
    site.remoteFile(
      "/js/comments.js",
      "https://unpkg.com/@oom/mastodon-comments@0.2.1/src/comments.js",
    );
  };
}
