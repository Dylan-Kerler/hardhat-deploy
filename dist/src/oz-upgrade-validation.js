"use strict";
const manifest = await Manifest.forNetwork(provider);
const currentImplAddress = await getImplementationAddress(provider, proxy.address);
const currentLayout = await getStorageLayoutForAddress(manifest, validations, currentImplAddress);
const layout = getStorageLayout(validations, version);
assertStorageUpgradeSafe(currentLayout, layout, requiredOpts);
//# sourceMappingURL=oz-upgrade-validation.js.map