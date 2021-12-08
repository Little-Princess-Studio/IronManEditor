import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './reset.css';
import './global.less';
import StartPage from './pages/StartPage';
import EditorPage from './pages/EditorPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={StartPage} />
        <Route path="/editor" component={EditorPage} />
      </Switch>
    </Router>
  );
}
