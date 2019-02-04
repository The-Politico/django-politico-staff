import React from 'react';
import { Sketch } from 'politico-style';
import { component } from './styles.scss';

const { Button } = Sketch;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      sending: false,
      error: false,
      success: false,
    };
    this.state = this.defaultState;
  }

  resetState = () => {
    this.setState(this.defaultState);
  }

  lagState = (state, delay) => {
    setTimeout(() => {
      this.setState(state);
    }, delay);
  }

  requestResync = () => {
    const { token, sync } = this.props.api;
    const { id: user } = this.props.user;
    this.setState({ sending: true, error: false, success: false });
    fetch(sync, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user }),
    })
      .then(response => {
        if (response.status !== 200) {
          console.log('API error: ', response);
          this.lagState({ sending: false, error: true }, 1000);
        } else {
          this.lagState({ sending: false, success: true }, 1000);
        }
        setTimeout(this.resetState, 10000);
      }).catch((e) => {
        console.log('API error: ', e);
        this.setState({ sending: false, error: true });
        setTimeout(this.resetState, 10000);
      });
  }
  render() {
    const { user } = this.props;
    const { profile } = user;

    let message = null;

    if (this.state.success) {
      message = (
        <div className='alert alert-success' role='alert'>
          <i className='far fa-check-circle' /> Success! Refresh to see your updated byline.
        </div>
      );
    }
    if (this.state.error) {
      message = (
        <div className='alert alert-danger' role='alert'>
          <i className='far fa-times-circle' /> There was an error. Try again or contact #interactive-news.
        </div>
      );
    }
    if (this.state.sending) {
      message = (
        <div className='alert alert-info' role='alert'>
          <i className='fas fa-spinner fa-spin fa-fw' /> Requesting a resync...
        </div>
      );
    }

    return (
      <div className={component}>
        <div>
          <h5 className='tag'>Byline</h5>
        </div>
        <small className='sans'>To update this info, <a href='https://get.slack.help/hc/en-us/articles/204092246-Edit-your-profile' target='_blank'>edit your profile in Slack</a> and then resync below.</small>
        <div className='profile'>
          <div className='row'>
            <div className='col-auto pic'>
              <figure>
                <img src={profile.slack_image} />
              </figure>
            </div>
            <div className='col name'>
              <h3>{user.first_name} {user.last_name}</h3>
              <h6>{profile.politico_title}</h6>
            </div>
            <div className='col-auto'>
              <Button
                onClick={this.requestResync}
              >Sync with Slack</Button></div>
          </div>
          <div className='row msg'>
            {message}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
