// Module scaffolding
const environment = {};

// App configuration
environment.staging = {
  port: 3000,
  envName: "staging",
  secrateKey : "dsafj0pwri342dskfdfi02349fdfdsjf0",
  maxChecks : 5
};

environment.production = {
  port: 6000,
  envName: "production",
  secrateKey : "dkdkfjafoejrelsfd43rjewp940r2303",
  maxChecks : 5
};

// Determining which environment is passed
const currentEnv =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV.trim() : "staging"; //trim the white space for prevent the enviorment issue 

// Export corresponding environment object
const environmentToExport =
  typeof environment[currentEnv] === "object" ? environment[currentEnv] : environment.staging;

// Export module
module.exports = environmentToExport;
