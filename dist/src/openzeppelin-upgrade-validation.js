"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openzeppelin_saveDeploymentManifest = exports.openzeppelin_assertIsValidImplementation = exports.openzeppelin_assertIsValidUpgrade = void 0;
const validations_1 = require("@openzeppelin/hardhat-upgrades/dist/utils/validations");
const upgrades_core_1 = require("@openzeppelin/upgrades-core");
// Checks the old implementation against the new implementation and
// ensures that it's valid.
const openzeppelin_assertIsValidUpgrade = async (provider, proxyAddress, newImplementation) => {
    const { version: newVersion, validations } = await getVersionAndValidations(newImplementation);
    const manifest = await upgrades_core_1.Manifest.forNetwork(provider);
    const newStorageLayout = upgrades_core_1.getStorageLayout(validations, newVersion);
    const oldStorageLayout = await upgrades_core_1.getStorageLayoutForAddress(manifest, validations, await upgrades_core_1.getImplementationAddress(provider, proxyAddress));
    // This will throw an error if the upgrade is invalid.
    upgrades_core_1.assertStorageUpgradeSafe(oldStorageLayout, newStorageLayout, upgrades_core_1.withValidationDefaults({}));
    return;
};
exports.openzeppelin_assertIsValidUpgrade = openzeppelin_assertIsValidUpgrade;
// Checks the contract is a valid implementation (e.g. no `constructor` etc.)
const openzeppelin_assertIsValidImplementation = async (implementation) => {
    const requiredOpts = upgrades_core_1.withValidationDefaults({});
    const { version, validations } = await getVersionAndValidations(implementation);
    // This will throw an error if the implementation is invalid.
    upgrades_core_1.assertUpgradeSafe(validations, version, requiredOpts);
    return;
};
exports.openzeppelin_assertIsValidImplementation = openzeppelin_assertIsValidImplementation;
// Appends the implementation to the implementation history of the proxy.
// Used for comparison against future implementations to ensure they are
// compatible with eachother in `openzeppelin_assertIsValidUpgrade()`.
const openzeppelin_saveDeploymentManifest = async (provider, proxy, implementation) => {
    const { version, validations } = await getVersionAndValidations(implementation);
    const manifest = await upgrades_core_1.Manifest.forNetwork(provider);
    await manifest.addProxy({
        address: proxy.address,
        txHash: proxy.transactionHash,
        kind: 'transparent',
    });
    await manifest.lockedRun(async () => {
        const manifestData = await manifest.read();
        const layout = upgrades_core_1.getStorageLayout(validations, version);
        manifestData.impls[version.linkedWithoutMetadata] = {
            address: implementation.address,
            txHash: implementation.transactionHash,
            layout,
        };
        await manifest.write(manifestData);
    });
    return;
};
exports.openzeppelin_saveDeploymentManifest = openzeppelin_saveDeploymentManifest;
const getVersionAndValidations = async (implementation) => {
    if (implementation.bytecode === undefined)
        throw Error('No bytecode for implementation');
    // @ts-expect-error `hre` is actually defined globally
    const validations = await validations_1.readValidations(hre);
    const unlinkedBytecode = upgrades_core_1.getUnlinkedBytecode(validations, implementation.bytecode);
    const version = upgrades_core_1.getVersion(unlinkedBytecode, implementation.bytecode);
    return {
        version,
        validations,
    };
};
//# sourceMappingURL=openzeppelin-upgrade-validation.js.map