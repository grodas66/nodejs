const kvName = process.env['KEYVAULT_NAME'];
const kvNameUri = 'https://" + kvName + ".vault.azure.net/';
const secretName = process.env['SECRET_NAME'];;


const spSecretManagement =  require('./SPSecretManagement');


spSecretManagement.GetSecret(kvNameUri, secretName)
.then( (result) => {
    console.log(result);
    
})
.catch( (err) => { 
    console.log(err); 
});
