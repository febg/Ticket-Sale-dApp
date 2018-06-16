var Migrations = artifacts.require("Conference.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
