import * as cdk from '@aws-cdk/core';
import * as appconfig from '@aws-cdk/aws-appconfig';
import * as lambda from '@aws-cdk/aws-lambda';
import {CfnParameter} from "@aws-cdk/core";
import {Effect, PolicyStatement} from '@aws-cdk/aws-iam';

export class PlantsStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // the AppConfig Application has been created manually, and could be accessed by all stacks
        const appConfigApplicationName='PlantAppConfigApplication';

        // This should be provided during manual deployment or through CI/CID
        const plantNameParameter = new CfnParameter(this, "plantName", {
            type: "String",
            allowedValues: ['neckarsulm', 'wolfsburg', 'osnabrueck'],
            description: "The name of the plant to be deployed."
        });

        const plantInformationLambda = new lambda.Function(this, "plantInformation", {
            runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset('lambda'),
            handler: 'plantinformation.handler',
            environment: {
                AWS_APPCONFIG_EXTENSION_HTTP_PORT: '2772',
                AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS: '45',
                AWS_APPCONFIG_EXTENSION_POLL_TIMEOUT_MILLIS: '3000',
                AWS_APPCONFIG_APP_NAME: appConfigApplicationName,
                AWS_APPCONFIG_PLANT_NAME: plantNameParameter.value.toString(),
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
