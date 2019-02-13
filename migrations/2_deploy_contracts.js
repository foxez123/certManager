var CertManager = artifacts.require("CertManager.sol");

module.exports = function(deployer) {
    deployer.deploy(CertManager);
};