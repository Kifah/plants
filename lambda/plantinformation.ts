import * as AWS from 'aws-sdk';


declare const process: {
    env: {
        AWS_APPCONFIG_REF: string; // application id
        AWS_APPCONFIG_PLANT_NAME: string; // enviornment in AppConfig Application
    };
};

const appConfig = new AWS.AppConfig({apiVersion: '2019-10-09'});

export const handler = (
        event: any
    ): any => {
        const params = {
            MaxResults: 5,
        };
        appConfig.listApplications(params, function (err, data) {
            console.log('application data...');
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
        console.log('debugging plants configuration...');
        console.log('application ref', process.env.AWS_APPCONFIG_REF);
        console.log('application env', process.env.AWS_APPCONFIG_PLANT_NAME);
    }
;
