import React from 'react';
import ReactDOM from 'react-dom';
import { Sketch } from 'politico-style';
import SlackProfile from './edit/SlackProfile';
import EditableProfile from './edit/EditableProfile';

import './theme/base.scss';

const { Nav, Header, Footer } = Sketch;

const App = (props) => (
  <div>
    <Nav appName='Your profile' homeLink='/' />
    <Header
      subhed=''
      title={`Hi, ${props.user.first_name} 👋`}
    />
    <SlackProfile user={props.user} api={api} />
    <EditableProfile profile={props.user.profile} api={api} />
    <Footer />
  </div>
);

const user = JSON.parse(document.getElementById('user').textContent);
const api = JSON.parse(document.getElementById('api').textContent);

document.getElementById('user').outerHTML = '';
document.getElementById('api').outerHTML = '';

ReactDOM.render(<App user={user} api={api} />, document.getElementById('app'));
