import Home from './pages/Home';
import Global from './styles/global';
import Layout from './styles/Layout';

const App = () => {
  return (
    <Layout>
      <Global />
      <Home />
    </Layout>
  );
};

export { App };
