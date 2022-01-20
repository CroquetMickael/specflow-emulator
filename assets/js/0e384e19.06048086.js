"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[671],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9881:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],s={sidebar_position:1},l="Getting started",c={unversionedId:"intro",id:"intro",title:"Getting started",description:"Adding specflow-emulator on your project",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/docs/intro",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Create your first test",permalink:"/docs/create-your-first-test"}},u=[{value:"Adding specflow-emulator on your project",id:"adding-specflow-emulator-on-your-project",children:[],level:2},{value:"Configuration",id:"configuration",children:[{value:"Vitest",id:"vitest",children:[],level:3},{value:"Jest",id:"jest",children:[],level:3}],level:2},{value:"Does this work with Vue/React",id:"does-this-work-with-vuereact",children:[],level:2},{value:"Other test framework",id:"other-test-framework",children:[],level:2}],p={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"getting-started"},"Getting started"),(0,a.kt)("h2",{id:"adding-specflow-emulator-on-your-project"},"Adding specflow-emulator on your project"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"// with npm\n$ npm install -D specflow-emulator\n\n// or with yarn\n$ yarn add -D specflow-emulator\n\n// or with pnpm\n$ pnpm add -D specflow-emulator\n")),(0,a.kt)("h2",{id:"configuration"},"Configuration"),(0,a.kt)("h3",{id:"vitest"},"Vitest"),(0,a.kt)("p",null,"Using vitest, you have to had some configuration on ",(0,a.kt)("inlineCode",{parentName:"p"},"vite.config.js"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},'export default defineConfig({\n  test: {\n    global: true,\n    include: [\n      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",\n      "**/*.steps.js",\n    ],\n    environment: "choose your environnement here",\n    setupFiles: ["./setupTests.js"],\n    watch: true,\n  },\n});\n')),(0,a.kt)("p",null,"Then setup your setup test file like this :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},'import { loadSteps } from "specflow-emulator";\n\nawait loadSteps();\n')),(0,a.kt)("h3",{id:"jest"},"Jest"),(0,a.kt)("p",null,"Using jest, you have to had some configuration on your ",(0,a.kt)("inlineCode",{parentName:"p"},"package.json")," or your ",(0,a.kt)("inlineCode",{parentName:"p"},"jest.config.js"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'"jest": {\n"transformIgnorePatterns": [\n      "node_modules/(?!specflow-emulator)/)"\n    ],\n    "testMatch": [\n      "**/__tests__/**/*.[jt]s?(x)",\n      "**/?(*.)+(spec|test|steps).[jt]s?(x)"\n    ],\n}\n')),(0,a.kt)("p",null,"Then setup your setup test file like this :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},'import { loadStepsJest } from "specflow-emulator";\n\nloadStepsJest();\n')),(0,a.kt)("h2",{id:"does-this-work-with-vuereact"},"Does this work with Vue/React"),(0,a.kt)("p",null,"Yes, nothing is related with ",(0,a.kt)("inlineCode",{parentName:"p"},"Vue.js")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"React.js"),", you can do some test with them."),(0,a.kt)("h2",{id:"other-test-framework"},"Other test framework"),(0,a.kt)("p",null,"Currently, we are using ",(0,a.kt)("inlineCode",{parentName:"p"},"jest-cucumber")," behind the door, that's mean we can't provide more test framework like ",(0,a.kt)("inlineCode",{parentName:"p"},"mocha")," or anything else."))}d.isMDXComponent=!0}}]);