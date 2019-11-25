#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { EcsJenkinsFargateStack } from '../lib/ecs-jenkins-fargate-stack';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();
new EcsJenkinsFargateStack(app, 'EcsJenkinsFargateStack', { env: env });
