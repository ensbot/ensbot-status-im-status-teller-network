import moment from 'moment';
import { fromTokenDecimals } from '../../utils/numbers';
import { addressCompare, zeroAddress } from '../../utils/address';
import { getTradeStatus, tradeStates } from './helpers';

const unimportantStates = [tradeStates.canceled, tradeStates.expired, tradeStates.released];

export const getCreateEscrowStatus = state => state.escrow.createEscrowStatus;

export const getCreateEscrowId = state => state.escrow.createEscrowId;

export const getTrades = (state, userAddress, offers) => {
  const escrows = state.escrow.escrows || {};
  return Object.values(escrows).filter(escrow => addressCompare(escrow.buyer, userAddress) || offers.find(x => x.toString() === escrow.offerId.toString()) !== undefined)
                .map((escrow) => {
                  let token = Object.values(state.network.tokens).find((token) => addressCompare(token.address, escrow.offer.asset));
                  if (!token) {
                    token = {
                      symbol: "???",
                      name: "Unknown",
                      address: zeroAddress,
                      decimals: 18,
                      balance: "0"
                    };
                  }
                  return {
                    ...escrow,
                    token,
                    status: getTradeStatus(escrow),
                    tokenAmount: fromTokenDecimals(escrow.tokenAmount, token.decimals)
                  };
                })
    .sort((a, b) => {
      if (unimportantStates.includes(a.status)) {
        if (unimportantStates.includes(b.status)) {
          return (parseInt(a.escrowId, 10) < parseInt(b.escrowId, 10)) ? 1 : -1;
        }
        return 1;
      }
      if (unimportantStates.includes(b.status)) {
        return -1;
      }
      return (parseInt(a.escrowId, 10) < parseInt(b.escrowId, 10)) ? 1 : -1;
    });
};

export const getEscrowById = (state, escrowId) => {
  if (!state.escrow.escrows) {
    return null;
  }
  const escrow = state.escrow.escrows[escrowId];
  if(!escrow) return null;

  const token = Object.values(state.network.tokens).find((token) => addressCompare(token.address, escrow.offer.asset));
  return {
    ...escrow,
    token,
    status: getTradeStatus(escrow),
    tokenAmount: fromTokenDecimals(escrow.tokenAmount, token.decimals)
  };
};

export const txHash = state => state.escrow.txHash;

export const newEscrow = state => state.escrow.newEscrow;
export const changedEscrow = state => state.escrow.changedEscrow;

export const actionNeeded = state => state.escrow.actionNeeded;

// TODO: move to new UI
export const receipt = state => state.escrow.receipt;
export const error = state => state.escrow.error;
export const isLoading = state => state.escrow.loading;
export const txHashList = state => state.escrow.txHashList;
export const escrows = state => Object.values(state.escrow.escrows).map(escrow => {
  escrow.sellerRating = (typeof escrow.sellerRating === 'string') ? parseInt(escrow.sellerRating, 10) : escrow.sellerRating;
  if (!escrow.expirationTime.unix) {
    escrow.expirationTime = moment(escrow.expirationTime * 1000);
  }
  return escrow;
});
export const errorGet = state => state.escrow.errorGet;
export const loadingList = state => state.escrow.loadingList;
export const signature = state => {
  const {
    message,
    escrowId,
    type
  } = state.escrow;
  return {
    message,
    escrowId,
    type
  };
};

export const getLastActivity = state => state.escrow.lastActivity;

export const feeMilliPercent = state => state.escrow.feeMilliPercent;
