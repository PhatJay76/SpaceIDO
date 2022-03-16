module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy("SpaceIDO", {
      from: deployer,
      log: true,
      skipIfAlreadyDeployed: true
    });
  };
  module.exports.tags = ["SpaceIDO"];