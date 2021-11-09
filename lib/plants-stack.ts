import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import {CfnParameter} from "@aws-cdk/core";
import {Effect, PolicyStatement} from '@aws-cdk/aws-iam';

import {
    CfnApplication,
    CfnEnvironment,
    CfnConfigurationProfile,
    CfnHostedConfigurationVersion
} from "@aws-cdk/aws-appconfig";

export class PlantsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // This should be provided during manual deployment or through CI/CID
        const plantNameParameter = new CfnParameter(this, "plantName", {
            type: "String",
            allowedValues: ['neckarsulm', 'wolfsburg', 'osnabrueck'],
            description: "The name of the plant to be deployed."
        });


        const appConfigApplication = new CfnApplication(this, 'PlantAppConfigApplication', {
            name: 'PlantAppConfigApplication',
            description: 'AppConfig Application for plants Demo'
        });

        const plantInformationLambda = new lambda.Function(this, "plantInformation", {
            runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset('lambda'),
            handler: 'plantinformation.handler',
            environment: {
                AWS_APPCONFIG_EXTENSION_HTTP_PORT: '2772',
                AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS: '45',
                AWS_APPCONFIG_EXTENSION_POLL_TIMEOUT_MILLIS: '3000',
                AWS_APPCONFIG_REF: appConfigApplication.ref,
                AWS_APPCONFIG_PLANT_NAME:plantNameParameter.value.toString(),
            }
        });

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
