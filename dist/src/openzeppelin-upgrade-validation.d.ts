import { Web3Provider } from '@ethersproject/providers';
import { Address, Deployment } from '../types';
export declare const openzeppelin_assertIsValidUpgrade: (provider: Web3Provider, proxyAddress: Address, newImplementation: {
    bytecode?: string;
}) => Promise<undefined>;
export declare const openzeppelin_assertIsValidImplementation: (implementation: {
    bytecode?: string;
}) => Promise<undefined>;
export declare const openzeppelin_saveDeploymentManifest: (provider: Web3Provider, proxy: Deployment, implementation: Deployment) => Promise<undefined>;
//# sourceMappingURL=openzeppelin-upgrade-validation.d.ts.map