import React from 'react';
import { Sketch } from 'politico-style';
import { component } from './styles.scss';

const { TextInput, Button } = Sketch;

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const {
      google_display_name: googleDisplayName,
      google_email: googleEmail,
      politico_author_page: politicoAuthorPage,
      twitter_handle: twitterHandle,
    } = props.profile;

    this.defaultState = {
      sending: false,
      error: false,
      success: false,
    };

    this.state = {
      googleDisplayName,
      googleEmail,
      politicoAuthorPage,
      twitterHandle,
      ...this.defaultState,
    };
  }

  resetState = () => {
    this.setState(this.defaultState);
  }

  patchProfile = () => {
    const { token, patch } = this.props.api;
    const { id } = this.props.profile;
    this.setState({ sending: true, error: false, success: false });
    fetch(patch, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        id,
        google_display_name: this.state.googleDisplayName,
        google_email: this.state.googleEmail,
        politico_author_page: this.state.politico_author_page,
        twitter_handle: this.state.twitterHandle,
      }),
    })
      .then(response => {
        if (response.status !== 200) {
          console.log('API error: ', response);
          this.lagState({ sending: false, error: true }, 1500);
        } else {
          this.lagState({ sending: false, success: true }, 1500);
        }
        setTimeout(this.resetState, 10000);
      }).catch((e) => {
        console.log('API error: ', e);
        this.setState({ sending: false, error: true });
        setTimeout(this.resetState, 10000);
      });
  }

  lagState = (state, delay) => {
    setTimeout(() => {
      this.setState(state);
    }, delay);
  }

  render() {
    let message = null;

    if (this.state.success) {
      message = (
        <div className='alert alert-success' role='alert'>
          <i className='far fa-check-circle' /> Success!
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
          <i className='fas fa-spinner fa-spin fa-fw' /> Saving your profile...
        </div>
      );
    }

    return (
      <div className={component}>
        <hr />
        <div className='form'>
          <h5 className='tag' style={{ marginBottom: 0 }}>Profile</h5>
          <div className='row'>
            <div className='col'>
              <TextInput
                id='gmail'
                label='Gmail'
                type='email'
                value={this.state.googleEmail}
                onChange={(e) => this.setState({ googleEmail: e.target.value })}
              />
            </div>
            <div className='col'>
              <TextInput
                id='google-display-name'
                label='Google display name'
                value={this.state.googleDisplayName}
                onChange={(e) => this.setState({ googleDisplayName: e.target.value })}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <label id='label-twitter' htmlFor='twitter'>Twitter</label>
              <div className='input-group form-group'>

                <div className='input-group-prepend'>
                  <div className='input-group-text'>@</div>
                </div>
                <input
                  type='text'
                  className='form-control'
                  name='twitter'
                  placeholder='handle'
                  value={this.state.twitterHandle}
                  onChange={(e) => this.setState({ twitterHandle: e.target.value })}
                />
              </div>
            </div>
            <div className='col'>
              <TextInput
                label='Author page'
                id='author-page'
                type='url'
                value={this.state.politicoAuthorPage}
                onChange={(e) => this.setState({ politicoAuthorPage: e.target.value })}
                placeholder='politico.com/'
              />
            </div>

          </div>

        </div>
        <div>
          {message}
        </div>
        <Button onClick={this.patchProfile}>Save profile</Button>
        <br /><br /><br />
      </div>
    );
  }
}

export default Profile;
