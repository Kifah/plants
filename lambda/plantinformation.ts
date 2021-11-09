import * as AWS from 'aws-sdk';


declare const process: {
    env: {
        AWS_APPCONFIG_PLANT_NAME: string; // enviornment in AppConfig Application
    };
};

const appConfig = new AWS.AppConfig({apiVersion: '2019-10-09'});

export const handler = (
        event: any
    ): any => {
        const callParams = {
            // the AppConfig Application has been created manually, and could be accessed by all stacks
            Application: 'PlantAppConfigApplication',
            Configuration: 'DefaultConfig',
            Environment: process.env.AWS_APPCONFIG_PLANT_NAME,
            ClientId: createClientId()
        };

        // debug call to list all applications
        appConfig.getConfiguration(callParams, function (err, data) {
            const content=data.Content?.toString() as string;
            const plantConfig = JSON.parse(content);
            console.log('application data...');
            if (err) console.log(err, err.stack);
            else {

                if (plantConfig.horizontalIntegration==false){
                    console.log('ejecting...cannot use horizontalIntegration service');
                } else {
                    console.log('wait....making complicated horizontalIntegration API call here....');
                }
            }
        });


        console.log('debugging plants configuration...');
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
