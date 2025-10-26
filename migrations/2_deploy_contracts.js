const FoodSecurity = artifacts.require("FoodSecurity");

module.exports = function (deployer) {
  deployer.deploy(FoodSecurity);
};
