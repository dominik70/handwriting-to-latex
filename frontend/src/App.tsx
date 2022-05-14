import { Canvas } from './components/Canvas/Canvas';
import { Heading } from './components/Heading/Heading';
import { Layout } from './components/Layout/Layout';
import { Symbols } from './components/Symbols/Symbols';
import './styles/globals.scss';

export const App = () => {
  return (
    <Layout>
      <Heading>Handwritten math expression recognizer</Heading>
      <Canvas />
      <Symbols />
    </Layout>
  );
};
