/*global web3*/
import EmbarkJS from '../../embarkArtifacts/embarkjs';
import {contactCodeRegExp} from '../utils/address';
import TellerProvider from '../provider';
import tabookey from 'tabookey-gasless';
import Subspace from '@embarklabs/subspace';

export function onReady() {
  return new Promise((resolve, reject) => {
    EmbarkJS.onReady((err) => {
      if (err) {
        return reject(err);
      }

      const relayProvider = new tabookey.RelayProvider(web3.currentProvider);
      const customProvider = new TellerProvider(relayProvider);
      customProvider.startProvider(web3);

      global.subspace = new Subspace(web3.currentProvider);
      global.subspace.init().then(resolve); 
    });
  });
}

export function getEnsAddress(name) {
  return new Promise(async (resolve, reject) => {
    try {
      // TODO check if an address is not correct and we only want contact codes, we need to validate that ENS returns a contact code
      if (contactCodeRegExp.test(name) || web3.utils.isAddress(name)) {
        return resolve(name);
      }
      if (name.indexOf('.') === -1) {
        name += '.stateofus.eth';
      }
      const address = await EmbarkJS.Names.resolve(name);
      resolve(address);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

export function enableEthereum() {
  return new Promise(async (resolve, reject) => {
    try {
      const accounts = await EmbarkJS.enableEthereum();
      resolve(accounts);
    } catch(e) {
      reject(e);
    }
  });
}
