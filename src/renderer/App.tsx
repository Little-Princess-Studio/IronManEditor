import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/reset.css';
import './assets/global.less';
import StartPage from './pages/StartPage';
import EditorPage from './pages/EditorPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route path="/editor" component={EditorPage} />
      </Switch>
    </Router>
  );
}
