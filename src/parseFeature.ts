/**
 * Browser-safe port of `jest-cucumber`'s `parseFeature`.
 *
 * `jest-cucumber/dist/src/parsed-feature-loading` cannot be imported in a
 * browser bundle: it `require("glob")` at module scope, and `glob`'s
 * `path-scurry` dependency touches `path.win32.native` while evaluating, which
 * throws once `path` is externalized by Vite.
 *
 * This module reimplements only the pure `featureText -> ParsedFeature`
 * transformation (no `fs`, no `glob`, no `path`). It is a straight port of the
 * logic in `jest-cucumber` 4.5.0 and must be kept in sync if that dependency is
 * upgraded. `uuid` is replaced by the standard `crypto.randomUUID`.
 */
import {
  AstBuilder,
  GherkinClassicTokenMatcher,
  Parser,
  dialects,
} from "@cucumber/gherkin";
import { Options } from "jest-cucumber/dist/src/configuration";
import { getJestCucumberConfiguration } from "jest-cucumber/dist/src/configuration";
import { ParsedFeature } from "jest-cucumber/dist/src/models";

const newId = () => (globalThis as any).crypto.randomUUID();

const parseDataTableRow = (astDataTableRow: any) =>
  astDataTableRow.cells.map((col: any) => col.value);

const parseDataTable = (astDataTable: any, astDataTableHeader?: any) => {
  let headerRow: any;
  let bodyRows: any;

  if (astDataTableHeader) {
    headerRow = parseDataTableRow(astDataTableHeader);
    bodyRows = astDataTable;
  } else {
    headerRow = parseDataTableRow(astDataTable.rows[0]);
    bodyRows =
      astDataTable &&
      astDataTable.rows &&
      astDataTable.rows.length &&
      astDataTable.rows.slice(1);
  }

  if (bodyRows && bodyRows.length > 0) {
    return bodyRows.map((nextRow: any) => {
      const parsedRow = parseDataTableRow(nextRow);
      return parsedRow.reduce(
        (rowObj: any, nextCol: any, index: number) => ({
          ...rowObj,
          [headerRow[index]]: nextCol,
        }),
        {}
      );
    });
  }

  return [];
};

const parseStepArgument = (astStep: any) => {
  if (astStep?.dataTable) {
    return parseDataTable(astStep.dataTable);
  }
  if (astStep?.docString) {
    return astStep.docString.content;
  }
  return null;
};

const parseStep = (astStep: any) => ({
  stepText: astStep.text,
  keyword: astStep.keyword.trim().toLowerCase(),
  stepArgument: parseStepArgument(astStep),
  lineNumber: astStep.location.line,
});

const parseSteps = (astScenario: any) =>
  astScenario.steps.map((astStep: any) => parseStep(astStep));

const parseTags = (ast: any): string[] => {
  if (!ast.tags) {
    return [];
  }
  return ast.tags.map((tag: any) => tag.name.toLowerCase());
};

const parseScenario = (astScenario: any) => ({
  title: astScenario.name,
  steps: parseSteps(astScenario),
  tags: parseTags(astScenario),
  lineNumber: astScenario.location.line,
});

const parseScenarioOutlineExampleSteps = (
  exampleTableRow: any,
  scenarioSteps: any[]
) =>
  scenarioSteps.map((scenarioStep) => {
    const stepText = Object.keys(exampleTableRow).reduce(
      (processedStepText, nextTableColumn) =>
        processedStepText.replace(
          new RegExp(`<${nextTableColumn}>`, "g"),
          exampleTableRow[nextTableColumn]
        ),
      scenarioStep.stepText
    );

    let stepArgument: any = null;

    if (scenarioStep.stepArgument) {
      if (Array.isArray(scenarioStep.stepArgument)) {
        stepArgument = scenarioStep.stepArgument.map((stepArgumentRow: any) => {
          const modifiedStepArgumentRow = { ...stepArgumentRow };
          Object.keys(exampleTableRow).forEach((nextTableColumn) => {
            Object.keys(modifiedStepArgumentRow).forEach((prop) => {
              modifiedStepArgumentRow[prop] = modifiedStepArgumentRow[prop].replace(
                new RegExp(`<${nextTableColumn}>`, "g"),
                exampleTableRow[nextTableColumn]
              );
            });
          });
          return modifiedStepArgumentRow;
        });
      } else {
        stepArgument = scenarioStep.stepArgument;
        if (typeof scenarioStep.stepArgument === "string") {
          Object.keys(exampleTableRow).forEach((nextTableColumn) => {
            stepArgument = stepArgument.replace(
              new RegExp(`<${nextTableColumn}>`, "g"),
              exampleTableRow[nextTableColumn]
            );
          });
        }
      }
    }

    return { ...scenarioStep, stepText, stepArgument };
  });

const getOutlineDynamicTitle = (exampleTableRow: any, title: string) =>
  title.replace(/<(\S*)>/g, (_, firstMatch) => exampleTableRow[firstMatch || ""]);

const parseScenarioOutlineExample = (
  exampleTableRow: any,
  outlineScenario: any,
  exampleSetTags: string[]
) => ({
  title: getOutlineDynamicTitle(exampleTableRow, outlineScenario.title),
  steps: parseScenarioOutlineExampleSteps(exampleTableRow, outlineScenario.steps),
  tags: Array.from(new Set([...outlineScenario.tags, ...exampleSetTags])),
});

const parseScenarioOutlineExampleSet = (
  astExampleSet: any,
  outlineScenario: any
) => {
  const exampleTable = parseDataTable(
    astExampleSet.tableBody,
    astExampleSet.tableHeader
  );
  return exampleTable.map((tableRow: any) =>
    parseScenarioOutlineExample(tableRow, outlineScenario, parseTags(astExampleSet))
  );
};

const parseScenarioOutlineExampleSets = (
  astExampleSets: any[],
  outlineScenario: any
) => {
  const exampleSets = astExampleSets.map((astExampleSet) =>
    parseScenarioOutlineExampleSet(astExampleSet, outlineScenario)
  );
  return exampleSets.reduce(
    (scenarios, nextExampleSet) => [...scenarios, ...nextExampleSet],
    []
  );
};

const parseScenarioOutline = (astScenarioOutline: any) => {
  const outlineScenario = parseScenario(astScenarioOutline.scenario);
  return {
    title: outlineScenario.title,
    scenarios: parseScenarioOutlineExampleSets(
      astScenarioOutline.scenario.examples,
      outlineScenario
    ),
    tags: outlineScenario.tags,
    steps: outlineScenario.steps,
    lineNumber: astScenarioOutline.scenario.location.line,
  };
};

const OUTLINE_KEYWORDS = ["Scenario Outline", "Scenario Template"];

const parseScenarios = (astFeature: any) =>
  astFeature.children
    .filter(
      (child: any) =>
        child.scenario && OUTLINE_KEYWORDS.indexOf(child.scenario.keyword) === -1
    )
    .map((astScenario: any) => parseScenario(astScenario.scenario));

const parseScenarioOutlines = (astFeature: any) =>
  astFeature.children
    .filter(
      (child: any) =>
        child.scenario && OUTLINE_KEYWORDS.indexOf(child.scenario.keyword) !== -1
    )
    .map((astScenarioOutline: any) =>
      parseScenarioOutline(astScenarioOutline)
    );

const collapseBackgrounds = (astChildren: any[], backgrounds: any[]) => {
  const backgroundSteps = backgrounds.reduce(
    (allBackgroundSteps, nextBackground) => [
      ...allBackgroundSteps,
      ...nextBackground.steps,
    ],
    []
  );
  return astChildren.map((child) => {
    const newChild = { ...child };
    if (newChild.scenario) {
      newChild.scenario.steps = [...backgroundSteps, ...newChild.scenario.steps];
    }
    return newChild;
  });
};

const parseBackgrounds = (ast: any) =>
  ast.children
    .filter((child: any) => child.background)
    .map((child: any) => child.background);

const collapseRulesAndBackgrounds = (astFeature: any) => {
  const featureBackgrounds = parseBackgrounds(astFeature);
  const children = collapseBackgrounds(
    astFeature.children,
    featureBackgrounds
  ).reduce((newChildren, nextChild) => {
    if (nextChild.rule) {
      const rule = nextChild.rule;
      const ruleBackgrounds = parseBackgrounds(rule);
      return [
        ...newChildren,
        ...collapseBackgrounds(rule.children, [
          ...featureBackgrounds,
          ...ruleBackgrounds,
        ]),
      ];
    }
    return [...newChildren, nextChild];
  }, []);
  return { ...astFeature, children };
};

const createTranslationMap = (translateDialect: any) => {
  const englishDialect = (dialects as any).en;
  const translationMap: Record<string, string> = {};
  const props = [
    "and",
    "background",
    "but",
    "examples",
    "feature",
    "given",
    "scenario",
    "scenarioOutline",
    "then",
    "when",
    "rule",
  ];

  for (const prop of props) {
    const dialectWords = translateDialect[prop];
    const translationWords = englishDialect[prop];
    let index = 0;
    let defaultWordIndex: number | null = null;

    for (const dialectWord of dialectWords) {
      // skip "* " word
      if (dialectWord.indexOf("*") !== 0) {
        if (translationWords[index] !== undefined) {
          translationMap[dialectWord] = translationWords[index];
          if (defaultWordIndex === null) {
            defaultWordIndex = index;
          }
        } else if (defaultWordIndex !== null) {
          translationMap[dialectWord] = translationWords[defaultWordIndex];
        } else {
          throw new Error(`No translation found for ${dialectWord}`);
        }
      }
      index += 1;
    }
  }

  return translationMap;
};

const translateKeywords = (astFeature: any) => {
  const languageDialect = (dialects as any)[astFeature.language];
  const translationMap = createTranslationMap(languageDialect);

  astFeature.language = "en";
  astFeature.keyword = translationMap[astFeature.keyword] || astFeature.keyword;

  for (const child of astFeature.children) {
    if (child.background) {
      child.background.keyword =
        translationMap[child.background.keyword] || child.background.keyword;
    }
    if (child.scenario) {
      child.scenario.keyword =
        translationMap[child.scenario.keyword] || child.scenario.keyword;
      for (const step of child.scenario.steps) {
        step.keyword = translationMap[step.keyword] || step.keyword;
      }
      for (const example of child.scenario.examples) {
        example.keyword = translationMap[example.keyword] || example.keyword;
      }
    }
  }

  return astFeature;
};

export const parseFeature = (
  featureText: string,
  options?: Options
): ParsedFeature => {
  let ast: any;

  try {
    const builder = new AstBuilder(newId);
    const tokenMatcher = new GherkinClassicTokenMatcher();
    ast = new Parser(builder, tokenMatcher).parse(featureText);
  } catch (err: any) {
    throw new Error(`Error parsing feature Gherkin: ${err.message}`);
  }

  let astFeature = collapseRulesAndBackgrounds(ast.feature);
  if (astFeature.language !== "en") {
    astFeature = translateKeywords(astFeature);
  }

  return {
    title: astFeature.name,
    scenarios: parseScenarios(astFeature),
    scenarioOutlines: parseScenarioOutlines(astFeature),
    tags: parseTags(astFeature),
    options: getJestCucumberConfiguration(options),
  } as ParsedFeature;
};
