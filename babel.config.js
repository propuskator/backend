module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    "add-module-exports",
    "@babel/plugin-proposal-class-properties",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining"
  ],
  "ignore": [
    "node_modules"
  ]
};
