import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import {CfnParameter} from "@aws-cdk/core";
import {Effect, PolicyStatement} from '@aws-cdk/aws-iam';

export class PlantsStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // the AppConfig Application has been created manually, and could be accessed by all stacks
        const appConfigApplicationName = 'PlantAppConfigApplication';

        const plantName = process.env.CONFIGURED_PLANT || 'neckarsulm';


        const plantInformationLambda = new lambda.Function(this, "plantInformation", {
            runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset('lambda'),
            handler: 'plantinformation.handler',
            environment: {
                AWS_APPCONFIG_APP_NAME: appConfigApplicationName,
                AWS_APPCONFIG_PLANT_NAME: plantName,
            }
        });

        // allow access to Appconfig confugrations (these rights should be refined)
        plantInformationLambda.addToRolePolicy(
            new PolicyStatement({
                resources: [
                    `arn:aws:appconfig:${this.region}:${this.account}:*`
                ],
                actions: ['appconfig:*'],
                effect: Effect.ALLOW
            })
        );

    }
}
