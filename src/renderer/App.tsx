import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './reset.css';
import './global.less';
import StartPage from './pages/StartPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={StartPage} />
      </Switch>
    </Router>
  );
}
