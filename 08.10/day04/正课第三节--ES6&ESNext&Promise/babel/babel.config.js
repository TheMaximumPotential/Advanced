const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "8",
        firefox: "60",
        chrome: "50",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

const plugins = ['transform-arrow-functions'];
module.exports = { presets, plugins };
