import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './assets/reset.css';
import './assets/global.less';
import 'tailwindcss/tailwind.css';
import 'antd/dist/antd.css';
import StartPage from './pages/StartPage';
import EditorPage from './pages/EditorPage';
import { bindDispatchs } from './store/reducers';

export default function App() {
  const dispatch = useDispatch();
  bindDispatchs(dispatch);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route path="/editor" component={EditorPage} />
      </Switch>
    </Router>
  );
}
