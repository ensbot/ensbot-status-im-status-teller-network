import React from 'react';
import {Row, Col} from 'reactstrap';
import RoundedIcon from "../../../ui/RoundedIcon";
import PropTypes from 'prop-types';
import ProfileIcon from "../../../../images/profileUser.svg";
import {withRouter, Link} from "react-router-dom";
import {withTranslation} from "react-i18next";

const Profile = ({t, address, withBuyer}) => (
  <Row className="mt-4" tag={Link} to={"/profile/" + address} >
    <Col xs="2">
      <RoundedIcon image={ProfileIcon} bgColor="blue"/>
    </Col>
    <Col xs="10 my-auto">
      <h6 className="m-0 font-weight-normal">{t('escrow.profile.title', {person: withBuyer ? t('general.buyer') : t('general.seller')})}</h6>
    </Col>
  </Row>
);

Profile.defaultProps = {
  withBuyer: false
};

Profile.propTypes = {
  t: PropTypes.func,
  address: PropTypes.string,
  withBuyer: PropTypes.bool
};

export default withRouter(withTranslation()(Profile));
