'use strict';

const KeyVault = require('azure-keyvault');
const AuthenticationContext = require('adal-node').AuthenticationContext;

//Service principal details for running the sample
const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
const tenantId = process.env['AZURE_TENANT_ID'];
const clientId = process.env['AZURE_CLIENT_ID'];
const objectId = process.env['AZURE_CLIENT_OID'];
const secret = process.env['AZURE_CLIENT_SECRET'];
const util = require('util');


class SPSecretManagement {
    
    constructor() {
        this.validateEnvironmentVariables();
        
    }
    // Small util to validate that we have the correct environment variables set. 
    validateEnvironmentVariables() {
        console.log('validate variables');
        var envs = [];
        if (!process.env['AZURE_SUBSCRIPTION_ID']) envs.push('AZURE_SUBSCRIPTION_ID');
        if (!process.env['AZURE_TENANT_ID']) envs.push('AZURE_TENANT_ID');
        if (!process.env['AZURE_CLIENT_ID']) envs.push('AZURE_CLIENT_ID');
        if (!process.env['AZURE_CLIENT_OID']) envs.push('AZURE_CLIENT_OID');
        if (!process.env['AZURE_CLIENT_SECRET']) envs.push('AZURE_CLIENT_SECRET');

        if (envs.length > 0) {
            throw new Error(util.format('please set/export the following environment variables: %s', envs.toString()));
        }
    }

    // Authenticates to the Azure Key Vault by providing a callback to authenticate using ADAL.
    async  GetSecret(vaultUri, secretName) {
        console.log("Using ADAL to authenticate to '" + vaultUri + "'");
        
        // Callback for ADAL authentication.
        const adalCallback = (challenge, callback) => {
            const context = new AuthenticationContext(challenge.authorization);
            return context.acquireTokenWithClientCredentials(challenge.resource, clientId, secret, (err, tokenResponse) => {
                if(err) {
                    throw err;
                }
                
                // The KeyVaultCredentials callback expects an error, if any, as the first parameter. 
                // It then expects a value for the HTTP 'Authorization' header, which we compute based upon the access token obtained with the SP client credentials. 
                // The token type will generally equal 'Bearer' - in some user-specific situations, a different type of token may be issued. 
                return callback(null, tokenResponse.tokenType + ' ' + tokenResponse.accessToken);
            });
        };
        
        const keyVaultClient = new KeyVault.KeyVaultClient(new KeyVault.KeyVaultCredentials(adalCallback));

        console.log("Gettting Secret '" + secretName + "'");

        return keyVaultClient.getSecret(vaultUri, secretName, "");
  

    }

  }

  const spSecretManagement =new SPSecretManagement();

  module.exports = spSecretManagement;
