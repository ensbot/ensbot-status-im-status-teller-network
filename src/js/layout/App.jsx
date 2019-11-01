/*global web3*/
import React, {Component, Fragment} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import {connect} from 'react-redux';
import {Container, Alert} from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Header from "./Header";
import Wizard from '../wizards/Wizard';
import Loading from "../components/Loading";
import ErrorInformation from '../components/ErrorInformation';
import fourOFour from '../components/ErrorInformation/404';

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Escrow from '../pages/Escrow';
import OpenDispute from '../pages/OpenDispute';
import Arbitration from '../pages/Arbitration';
import Arbitrators from '../pages/Arbitrators';
import SellerApproval from '../pages/SellerApproval';
import EditMyContact from '../pages/EditMyContact';
import License from '../pages/License';
import ArbitrationLicense from '../pages/ArbitrationLicense';
import OffersList from '../pages/OffersList';
import OffersMap from '../pages/OffersMap';
import Settings from '../pages/Settings';
import NotificationManager from '../components/NotificationManager';

// Profile
import MyProfile from '../pages/MyProfile';
import MyOffers from '../pages/MyOffers';
import MyTrades from '../pages/MyTrades';
import MyDisputes from '../pages/MyDisputes';

// Buy
import BuyTrade from '../wizards/Buy/0_Trade';
import BuyContact from '../wizards/Buy/1_Contact';
import BuyConfirmTrade from '../wizards/Buy/2_ConfirmTrade';

// Sell
import SellLocation from '../wizards/Sell/3_Location';
import SellContact from '../wizards/Sell/4_Contact';
import SellAsset from '../wizards/Sell/0_Asset';
import SellPaymentMethods from '../wizards/Sell/1_PaymentMethods';
import SellArbitrator from '../wizards/Sell/5_SelectArbitrator';
import SellCurrency from '../wizards/Sell/2_Currency';
import SellMargin from '../wizards/Sell/6_Margin';
import SellLimits from '../wizards/Sell/7_Limits';
import SellSummary from '../wizards/Sell/8_Summary';

// Tmp
import SignatureContainer from '../pages/tmp/SignatureContainer';

import prices from '../features/prices';
import network from '../features/network';
import metadata from '../features/metadata';
import escrow from '../features/escrow';

const PRICE_FETCH_INTERVAL = 60000;

class App extends Component {
  constructor(props) {
    super(props);
    this.props.init();
    this.watchingTrades = false;
    this.state = {
      hidePriceError: false,
      isHome: this.isHome()
    };
    setInterval(() => {
      this.props.getGasPrice();
      this.props.fetchExchangeRates();
    }, PRICE_FETCH_INTERVAL);
    if (this.props.profile && this.props.profile.offers) {
      this.watchTradesForOffers();
    }
    this.props.loadOffers();

    window.addEventListener('hashchange', () => {
      if (this.state.isHome !== this.isHome()) {
        this.setState({isHome: this.isHome()});
      }
    });
  }

  isHome() {
    return window.location.hash === '#/';
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.isReady && this.props.isReady && this.props.isEip1102Enabled) || (!prevProps.isEip1102Enabled && this.props.isEip1102Enabled && this.props.isReady)) {
      if (this.props.currentUser && this.props.currentUser !== web3.eth.defaultAccount) {
        this.props.resetState();
      }
      this.props.loadProfile(this.props.address);
      this.props.setCurrentUser(web3.eth.defaultAccount);
    }
    if (!this.watchingTrades && ((!prevProps.profile && this.props.profile && this.props.profile.offers) || (prevProps.profile && !prevProps.profile.offers && this.props.profile.offers))) {
      this.watchTradesForOffers();
    }
    if (prevProps.priceError !== this.props.priceError) {
      this.setState({hidePriceError: false});
    }
  }

  watchTradesForOffers() {
    if (this.watchingTrades) {
      return;
    }
    this.props.watchEscrowCreations(this.props.profile.offers);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isReady !== this.props.isReady ||
      nextProps.isEip1102Enabled !== this.props.isEip1102Enabled ||
      !_.isEqual(nextProps.profile, this.props.profile) ||
      nextProps.error !== this.props.error ||
      nextProps.hasToken !== this.props.hasToken ||
      nextState.hidePriceError !== this.state.hidePriceError ||
      nextState.isHome !== this.state.isHome;
  }

  hidePriceError = () => {
    this.setState({hidePriceError: true});
  };

  render() {
    if (this.props.error) {
      console.error(this.props.error);
      return <ErrorInformation provider/>;
    }

    if (!this.props.isReady) {
      return <Loading initial/>;
    }

    if (!this.props.hasToken) {
      return <ErrorInformation network/>;
    }

    return (
      <Fragment>
        <HashRouter>
          <Container className="p-0" id="app-container">
            <NotificationManager/>
            <Header />
            <div className={(this.state.isHome ? 'home-body-content ' : 'app-body-content ') + "body-content"}>
              {this.props.priceError && !this.state.hidePriceError && <Alert color="danger"  toggle={this.hidePriceError}>
                Error while fetching prices. Opening a trade will not be possible until the issue is resolved.
              </Alert>}
              <Switch>
                <Route exact path="/" component={Home}/>

                <Route exact path="/settings" component={Settings}/>

                <Route exact path="/profile" component={MyProfile}/>
                <Route exact path="/profile/contact/edit" component={EditMyContact}/>
                <Route exact path="/profile/offers" component={MyOffers} />
                <Route exact path="/profile/trades" component={MyTrades} />
                <Route exact path="/profile/disputes" component={MyDisputes} />
                <Route exact path="/profile/arbitrators" component={Arbitrators} />
                <Route exact path="/profile/:address" component={Profile}/>

                <Route exact path="/arbitrator/license" component={ArbitrationLicense}/>
                <Route exact path="/license" component={License}/>
                <Route exact path="/escrow/:id" component={Escrow}/>
                <Route exact path="/arbitration/:id" component={Arbitration}/>
                <Route exact path="/sellers" component={SellerApproval} />
                <Route exact path="/openCase/:id" component={OpenDispute}/>

                <Route exact path="/buy" component={OffersList}/>
                <Route exact path="/offers/map" component={OffersMap}/>

                <Wizard path="/buy/trade" steps={[
                  {path: '/buy/trade', component: BuyTrade},
                  {path: '/buy/contact', component: BuyContact, nextLabel: 'Sign contact info'},
                  {path: '/buy/confirm', component: BuyConfirmTrade, nextLabel: 'Confirm the trade'}
                ]}/>

                <Wizard path="/sell/" steps={[
                  {path: '/sell/asset', component: SellAsset},
                  {path: '/sell/payment-methods', component: SellPaymentMethods},
                  {path: '/sell/currency', component: SellCurrency},
                  {path: '/sell/location', component: SellLocation},
                  {path: '/sell/contact', component: SellContact},
                  {path: '/sell/arbitrator', component: SellArbitrator},
                  {path: '/sell/margin', component: SellMargin},
                  {path: '/sell/limits', component: SellLimits, nextLabel: 'Go to summary'},
                  {path: '/sell/summary', component: SellSummary, nextLabel: 'Post the offer'}
                ]}/>

                <Route path="/tmp/signature" component={SignatureContainer}/>

                <Route component={fourOFour}/>
              </Switch>
            </div>
          </Container>
        </HashRouter>
      </Fragment>
    );
  }
}

App.propTypes = {
  init: PropTypes.func,
  error: PropTypes.string,
  priceError: PropTypes.string,
  fetchPrices: PropTypes.func,
  fetchExchangeRates: PropTypes.func,
  getGasPrice: PropTypes.func,
  isReady: PropTypes.bool,
  hasToken: PropTypes.bool,
  address: PropTypes.string,
  profile: PropTypes.object,
  loadProfile: PropTypes.func,
  setCurrentUser: PropTypes.func,
  resetState: PropTypes.func,
  currentUser: PropTypes.string,
  watchEscrowCreations: PropTypes.func,
  loadOffers: PropTypes.func,
  isEip1102Enabled: PropTypes.bool
};

const mapStateToProps = (state) => {
  const address = network.selectors.getAddress(state) || '';
  return {
    address,
    currentUser: metadata.selectors.currentUser(state),
    isEip1102Enabled: metadata.selectors.isEip1102Enabled(state),
    isReady: network.selectors.isReady(state),
    hasToken: Object.keys(network.selectors.getTokens(state)).length > 0,
    error: network.selectors.getError(state),
    profile: metadata.selectors.getProfile(state, address),
    newEscrow: escrow.selectors.newEscrow(state),
    priceError: prices.selectors.error(state)
  };
};

export default connect(
  mapStateToProps,
  {
    fetchPrices: prices.actions.fetchPrices,
    fetchExchangeRates: prices.actions.fetchExchangeRates,
    getGasPrice: network.actions.getGasPrice,
    init: network.actions.init,
    resetState: network.actions.resetState,
    loadProfile: metadata.actions.load,
    setCurrentUser: metadata.actions.setCurrentUser,
    watchEscrowCreations: escrow.actions.watchEscrowCreations,
    loadOffers: metadata.actions.loadOffers
  }
)(App);
