import React, {Component, Fragment} from "react";
import {withTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {Alert} from 'reactstrap';
import {connect} from "react-redux";
import emailNotifications from '../../features/emailNotifications';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

class ValidateEmail extends Component {
  state = {
    error: ''
  };

  componentDidMount() {
    if (!this.props.match || !this.props.match.params || !this.props.match.params.token) {
      return this.setState({error: this.props.t('validateEmail.noToken')});
    }
    this.props.validateEmail(this.props.match.params.token);
  }

  hideError = () => {
    this.props.hideError();
  };

  render() {
    const {t, working, error, verifySuccess} = this.props;

    return (<Fragment>
      <h2 className="mb-4 mt-3">{t('validateEmail.title')}</h2>
      {error && <Alert color="danger" toggle={this.hideError}>Error: {error}</Alert>}
      {working && <Fragment>{t('general.loading')} <FontAwesomeIcon icon={faCircleNotch} spin/></Fragment>}
      {verifySuccess && <Alert color="success">{t('validateEmail.success')}</Alert>}
    </Fragment>);
  }
}

ValidateEmail.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  working: PropTypes.bool,
  verifySuccess: PropTypes.bool,
  match: PropTypes.object,
  validateEmail: PropTypes.func,
  hideError: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    error: emailNotifications.selectors.error(state),
    working: emailNotifications.selectors.working(state),
    verifySuccess: emailNotifications.selectors.verifySuccess(state)
  };
};

export default connect(
  mapStateToProps,
  {
    validateEmail: emailNotifications.actions.verifyEmail,
    hideError: emailNotifications.actions.hideError
  }
)(withTranslation()(ValidateEmail));
