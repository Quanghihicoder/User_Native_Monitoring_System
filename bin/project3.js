#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { Project3Stack } = require('../lib/project3-stack');

const Sydney = {
  account: "058264550947",
  region: "ap-southeast-2",
};

const app = new cdk.App();
new Project3Stack(app, 'Project3Stack', {
  stackName: "project3",
  env: Sydney
});
