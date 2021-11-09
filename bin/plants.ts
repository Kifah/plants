#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PlantsStack} from '../lib/plants-stack';


// this should be integrated somehow export CONFIGURED_PLANT=neckarsulm
const app = new cdk.App();
const namePrefix = 'PlantsStack';
const defaultPlant = process.env.CONFIGURED_PLANT || 'neckarsulm';
const stackName=namePrefix+defaultPlant;
new PlantsStack(app, stackName);
