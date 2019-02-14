import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'reactstrap';
import {Link} from "react-router-dom";
import Blockies from "react-blockies";
import Reputation from './Reputation';

const OfferListing = ({positiveRatings, negativeRating, nbTrades, seller, assets, location, address = '0x353db7d7ad524f77afdd0720b3808b0645bfcfc3'}) => (
  <Row className="offer-listing rounded p-2 mr-0 ml-0 mb-2" tag={Link} to={`/buy/profile/${address}`}>
    <Col className="p-0">
      <Row className="mb-2">
        <Col xs={2}><Blockies seed={address} className="rounded-circle" scale={5}/></Col>
        <Col xs={5}>
          <p className="seller-name m-0 font-weight-bold">{seller}</p>
          <p className="text-dark m-0">{location}</p>
        </Col>
        <Col xs={5} className="text-right rating-col">
          <p className="text-dark m-0 text-right mb-1">{nbTrades} trades</p>
          <Reputation reputation={{upCount: positiveRatings, downCount: negativeRating}} size="s"/>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="m-0">{assets.map((asset, idx) => (
            <span className="border rounded mr-2 font-weight-bold p-1"
                  key={'asset-' + idx}>{asset.name} &rarr; {asset.price}$</span>))}</p>
        </Col>
      </Row>
    </Col>
  </Row>

);


OfferListing.propTypes = {
  seller: PropTypes.string,
  nbTrades: PropTypes.number,
  positiveRatings: PropTypes.number,
  negativeRating: PropTypes.number,
  assets: PropTypes.array,
  location: PropTypes.string,
  address: PropTypes.string
};


export default OfferListing;
