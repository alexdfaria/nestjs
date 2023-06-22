import { defineSupportCode } from 'cucumber';

defineSupportCode(({ setDefaultTimeout, setDefinitionFunctionWrapper }) => {
  setDefaultTimeout(10 * 1000); // Set the default timeout for Cucumber steps

  // Add the feature paths and step definitions
  setDefinitionFunctionWrapper((definition) => {
    definition.uri = './test/features/**/*.feature'; // Specify the location of your feature files
    definition.feature = './test/step-definitions/**/*.steps.ts'; // Specify the location of your step definitions
    return definition;
  });


});