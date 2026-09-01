// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Specflow-emulator",
  tagline: "Make your BDD test mindblow",
  url: "https://croquetmickael.github.io",
  baseUrl: "/specflow-emulator/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "CroquetMickael", // Usually your GitHub org/user name.
  projectName: "specflow-emulator", // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/CroquetMickael/specflow-emulator/tree/main/docs/",
          // `2.0` is the released version served at /docs/.
          // The `current` docs (the docs/ folder) hold unreleased work
          // (e.g. the Vitest browser mode alpha) and are served at /docs/next/.
          lastVersion: "2.0",
          versions: {
            current: {
              label: "Next (alpha) 🚧",
              path: "next",
              banner: "unreleased",
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Specflow-emulator",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Guide",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
          },
          {
            href: "https://github.com/CroquetMickael/specflow-emulator",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Guide",
                to: "/docs/intro",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Specflow-emulator, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
