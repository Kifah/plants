import * as AWS from 'aws-sdk';


declare const process: {
    env: {
        AWS_APPCONFIG_PLANT_NAME: string; // enviornment in AppConfig Application
        AWS_APPCONFIG_APP_NAME: string; // name in AppConfig Application
    };
};

const appConfig = new AWS.AppConfig({apiVersion: '2019-10-09'});

export const handler = (
        event: any
    ): any => {
        const callParams = {
            Application: process.env.AWS_APPCONFIG_APP_NAME,
            Configuration: process.env.AWS_APPCONFIG_PLANT_NAME + 'DefaultConfig',
            Environment: process.env.AWS_APPCONFIG_PLANT_NAME,
            ClientId: createClientId()
        };

        // debug call to list all applications
        appConfig.getConfiguration(callParams, function (err, data) {
            console.log('application data...');
            if (err) console.log(err, err.stack);
            else console.log(data.Content?.toString());
        });

        console.log('debugging plants configuration...');
        console.log('application name', process.env.AWS_APPCONFIG_APP_NAME);
        console.log('application env', process.env.AWS_APPCONFIG_PLANT_NAME);
    }
;

function createClientId() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
