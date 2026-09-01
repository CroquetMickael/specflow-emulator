import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

const stepsSample = `import { defineSteps } from "specflow-emulator";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Calculator" }],
  ({ Given, When, Then }) => {
    Given(/^number "(.*)"$/, (ctx) => (n) => {
      ctx.numbers = [...(ctx.numbers ?? []), n];
    });

    When("I add them", (ctx) => () => {
      ctx.result = ctx.numbers.reduce((a, b) => a + +b, 0);
    });

    Then(/^the result should be "(.*)"$/, (ctx) => (expected) => {
      expect(ctx.result).toBe(+expected);
    });
  }
);`;

const featureSample = `import { defineFeature } from "specflow-emulator";

// The step pool is bound to every scenario automatically.
defineFeature("./calculator.feature");`;

const beforeSample = `// raw jest-cucumber: rewire given/when/then in every test()
const addThem = (when) =>
  when("I add them", () => {/* ... */});

test("Simple addition", ({ given, when, then }) => {
  given(/^number "(.*)"$/, (n) => {/* ... */});
  given(/^number "(.*)"$/, (n) => {/* ... */});
  addThem(when);
  then(/^the result should be "(.*)"$/, (r) => {/* ... */});
});

test("Simple multiplication", ({ given, when, then }) => {
  // ...copy every step again...
});`;

const afterSample = `// specflow-emulator: declare each step once
defineSteps([{ feature: "Simple Calculator" }], ({ Given, When, Then }) => {
  Given(/^number "(.*)"$/, (ctx) => (n) => {/* ... */});

  When("I add them", (ctx) => () => {/* ... */});
  When("I multiply them", (ctx) => () => {/* ... */});

  Then(/^the result should be "(.*)"$/, (ctx) => (r) => {/* ... */});
});
// every matching scenario is wired for you`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroBlurb}>
          Declare your Gherkin step definitions once. <code>specflow-emulator</code>{' '}
          keeps them in a pool and binds them to every <code>.feature</code>{' '}
          scenario automatically — shared steps, scoped steps and a scenario
          context included. Runs on Jest, Vitest and Vitest browser&nbsp;mode.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Get started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/create-your-first-test">
            Write your first test
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageHowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className="text--center">Three files, no wiring</h2>
        <p className={clsx('text--center', styles.sectionLead)}>
          Write your steps in a <code>*.stepdefinitions</code> file, point{' '}
          <code>defineFeature</code> at your <code>.feature</code>, and the matcher
          does the rest.
        </p>
        <div className="row">
          <div className="col col--6">
            <h4>calculator.stepdefinitions.js</h4>
            <CodeBlock language="javascript">{stepsSample}</CodeBlock>
          </div>
          <div className="col col--6">
            <h4>calculator.steps.js</h4>
            <CodeBlock language="javascript">{featureSample}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageBeforeAfter() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2 className="text--center">Stop rewiring the same steps</h2>
        <div className="row">
          <div className="col col--6">
            <h4>Before</h4>
            <CodeBlock language="javascript">{beforeSample}</CodeBlock>
          </div>
          <div className="col col--6">
            <h4>After</h4>
            <CodeBlock language="javascript">{afterSample}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Bind Gherkin steps automatically"
      description="A SpecFlow-style emulator for jest-cucumber: declare step definitions once and let specflow-emulator bind them to every feature scenario. Works with Jest, Vitest and Vitest browser mode.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageHowItWorks />
        <HomepageBeforeAfter />
        <section className={clsx(styles.section, 'text--center')}>
          <div className="container">
            <h2>Ready to try it?</h2>
            <p className={styles.sectionLead}>
              <code>npm i -D specflow-emulator</code>
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/docs/intro">
                Read the guide
              </Link>
              <Link
                className="button button--outline button--primary button--lg"
                href="https://github.com/CroquetMickael/specflow-emulator">
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
