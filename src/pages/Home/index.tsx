import React, { ChangeEvent, useState } from 'react';
import { Title, Description } from '../../typography';
import ComplexNumber from '../../utils/ComplexNumber';
import { Container, Row } from './styles';
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts';

interface DftSignalI {
  x: number;
  y: number;
}

const Home: React.FC = () => {
  const [realDFTSignal, setRealDFTSignal] = useState<DftSignalI[]>([]);
  const [imagDFTSignal, setImagDFTSignal] = useState<DftSignalI[]>([]);
  const [inputData, setInputData] = useState<DftSignalI[]>([]);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);

  function dft(inputAmplitudes: number[], zeroThreshold = 1e-10) {
    const N = inputAmplitudes.length;
    const signals = [];

    // Go through every discrete frequency.
    for (let frequency = 0; frequency < N; frequency += 1) {
      // Compound signal at current frequency that will ultimately
      // take part in forming input amplitudes.
      let frequencySignal = new ComplexNumber();

      // Go through every discrete point in time.
      for (let timer = 0; timer < N; timer += 1) {
        const currentAmplitude = inputAmplitudes[timer];

        // Calculate rotation angle.
        const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);
        // Remember that e^ix = cos(x) + i * sin(x);
        // eslint-disable-next-line
        // @ts-ignore
        const dataPointContribution = new ComplexNumber({
          re: Math.cos(rotationAngle),
          im: Math.sin(rotationAngle),
        }).multiply(currentAmplitude);

        // Add this data point's contribution.
        frequencySignal = frequencySignal.add(dataPointContribution);
      }

      // Close to zero? You're zero.
      if (Math.abs(frequencySignal.re) < zeroThreshold) {
        frequencySignal.re = 0;
      }

      if (Math.abs(frequencySignal.im) < zeroThreshold) {
        frequencySignal.im = 0;
      }

      // Average contribution at this frequency.
      // The 1/N factor is usually moved to the reverse transform (going from frequencies
      // back to time). This is allowed, though it would be nice to have 1/N in the forward
      // transform since it gives the actual sizes for the time spikes.
      frequencySignal = frequencySignal.divide(N);

      // Add current frequency signal to the list of compound signals.
      signals[frequency] = frequencySignal;
    }

    return signals;
  }

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(undefined);
      const { files } = e.target;
      const reader = new FileReader();
      if (files) {
        reader.onload = async e => {
          const res = e.target?.result;
          if (res) {
            const text = res.toString();
            text.replaceAll(' ', '');
            const array = JSON.parse('[' + text + ']');
            const signal = dft(array);
            setImagDFTSignal([]);
            setRealDFTSignal([]);
            signal.map((value, index) => {
              setLoading(true);
              setRealDFTSignal(prevState => [
                ...prevState,
                { x: value.re * 1000, y: index },
              ]);
              setImagDFTSignal(prevState => [
                ...prevState,
                { x: value.im * 1000, y: index },
              ]);
              index + 1 === signal.length && setLoading(false);
              return index;
            });
          }
        };
        reader.readAsText(files[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Title>Insira seu vetor como .txt abaixo</Title>
      <Description>
        Para que o sistema funcione corretamente, o arquivo deverá ser .txt e os
        valores do vetor deverão estar separados por vírgulas
      </Description>
      <input type="file" onChange={e => handleFile(e)} />
      {!loading && (
        <div>
          <Title>Dado de Entrada</Title>
          <LineChart width={400} height={400} data={realDFTSignal}>
            <Line type="monotone" dot={false} dataKey="x" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      )}
      <Row>
        {!loading && (
          <div>
            <Title>Real</Title>
            <LineChart width={400} height={400} data={realDFTSignal}>
              <Line type="monotone" dot={false} dataKey="x" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        )}
        {!loading && (
          <div>
            <Title>Imaginário</Title>
            <LineChart width={400} height={400} data={imagDFTSignal}>
              <Line dot={false} type="monotone" dataKey="x" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip />
              <XAxis />
              <YAxis />
            </LineChart>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Home;
