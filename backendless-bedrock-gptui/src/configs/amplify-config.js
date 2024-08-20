const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'eu-west-1_vXnj5CzaF',
            userPoolClientId: '4pvjjuc844a8rj312v3bv8d0co',
            identityPoolId: 'eu-west-1:33e8c5d9-6f78-4c60-9eff-f1aacd0499e8',
            allowGuestAccess: false,
            signUpVerificationMethod: 'code',
            loginWith: {
                oauth: {
                    domain: '0603b44c84cb.auth.eu-west-1.amazoncognito.com',
                    scopes: [
                        'email',
                        'openid',
                    ],
                    redirectSignIn: ['https://d36alxksqozi75.cloudfront.net'],
                    redirectSignOut: ['https://d36alxksqozi75.cloudfront.net'],
                    responseType: 'code'
                }
            }
        }
    }
};

export default amplifyConfig;