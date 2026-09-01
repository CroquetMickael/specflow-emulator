import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    icon: '🎯',
    title: 'One step pool',
    description: (
      <>
        Declare each <code>Given</code> / <code>When</code> / <code>Then</code>{' '}
        once. The pool is matched against every scenario in your{' '}
        <code>.feature</code> files — no <code>test()</code> boilerplate.
      </>
    ),
  },
  {
    icon: '♻️',
    title: 'Shared steps, zero glue',
    description: (
      <>
        A step reused across scenarios or features just works. Share across
        feature files with a tag instead of exporting helper functions.
      </>
    ),
  },
  {
    icon: '🏷️',
    title: 'Scoped on purpose',
    description: (
      <>
        Restrict a step to a feature, a scenario or a tag so identically worded
        steps never collide.
      </>
    ),
  },
  {
    icon: '🧩',
    title: 'Scenario context',
    description: (
      <>
        Every scenario gets a fresh context object to pass data between steps —
        no module-level mutable state.
      </>
    ),
  },
  {
    icon: '🧭',
    title: 'Errors that point at the line',
    description: (
      <>
        When a step matches zero or several definitions you get a formatted
        error naming the feature, scenario, step and file.
      </>
    ),
  },
  {
    icon: '⚡',
    title: 'Jest, Vitest & the browser',
    description: (
      <>
        Same API on Jest and Vitest. A dedicated{' '}
        <code>specflow-emulator/browser</code> entry point covers Vitest browser
        mode (alpha).
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <span className={styles.featureIcon} role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
