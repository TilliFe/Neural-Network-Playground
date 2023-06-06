import { MathJax, MathJaxContext } from 'better-react-mathjax';
import React from 'react';

const InfoReLU = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      <strong>ReLU (Rectified Linear Unit)</strong> is an activation function
      commonly used in neural networks. It is defined as:
      <MathJax>{'$$ f(x) = max(0,x) $$'}</MathJax>
      ReLU is used to introduce non-linearity into the model, allowing it to
      learn more complex relationships between the input and output data.
    </div>
  );
};

const InfoCE = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      <strong>Cross-Entropy</strong> loss for binary classification is defined
      as:
      <MathJax>
        {
          '$$ L = -\\frac{1}{N}\\sum_{i=1}^{N}y_i\\log(\\hat{y}_i)+(1-y_i)\\log(1-\\hat{y}_i) $$'
        }
      </MathJax>
      Cross-Entropy loss is used in classification problems to measure the
      dissimilarity between the predicted probability distribution and the true
      probability distribution.
    </div>
  );
};

const InfoMSE = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      <strong>MSE (Mean Squared Error)</strong> loss is defined as:
      <MathJax>
        {'$$ L = \\frac{1}{N}\\sum_{i=1}^{N}(y_i - \\hat{y}_i)^2 $$'}
      </MathJax>
      MSE is used in regression problems to calculate the average squared
      difference between the predicted and true values.
    </div>
  );
};

const InfoSoftmax = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      In a neural network, the <strong>Softmax</strong> function is used to
      normalize the output of a network to a probability distribution over
      predicted output classes. It is defined as:
      <MathJax>
        {'$$ \\sigma(z)_j = \\frac{e^{z_j}}{\\sum_{k=1}^K e^{z_k}} $$'}
      </MathJax>
      for <MathJax inline>{'\\( j = 1, …, K \\)'}</MathJax>.
    </div>
  );
};

const InfoDense = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      A <strong>Dense layer</strong> is a layer of neurons where each neuron is
      connected to all neurons in the previous layer. It is also known as a
      fully connected layer. Dense layers are used to learn complex
      relationships between the input and output data.
      <div>
        You can change the number of <strong>Neurons</strong>. Usually a higher
        number of neurons leads to a more accurate model, but also increases the
        training time and too many neurons can lead to overfitting. On the other
        hand, too few neurons can lead to underfitting.
      </div>
      A <strong>Bias</strong> is a value that is added to the weighted sum of
      the inputs to a neuron. It allows the model to fit the data better by
      shifting the activation function to the left or right.
    </div>
  );
};

const InfoInput = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      The <strong>Input</strong> to a neural network consists of a dataset of
      samples. Each sample is a vector of a fixed size, called the{' '}
      <strong>sampleSize</strong>. The input to the network is processed in
      mini-batches of samples, where the size of the mini-batch is determined by
      the <strong>batchSize</strong>. You can change the batchSize in the Error
      component to control the number of samples processed at once. The MetaDims
      are the dimensions of the unflatten input, which is useful for computing
      convolutions on high dimensional input data. You can change between simple
      Classification and Regression datasets.
    </div>
  );
};

const InfoTrueValues = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      The <strong>True values</strong> are the ground truth labels or values
      associated with each input sample. The size of one true value, called the{' '}
      <strong>sampleSize</strong>, should be the same dimension as the predicted
      value. The true values are used to calculate the loss and update the model
      during training.
    </div>
  );
};

export default function InfoComponent(props) {
  return (
    <MathJaxContext>
      {props.type === 'ReLU' ? (
        <InfoReLU />
      ) : props.type === 'softmax' ? (
        <InfoSoftmax />
      ) : props.type === 'CE' ? (
        <InfoCE />
      ) : props.type === 'MSE' ? (
        <InfoMSE />
      ) : props.type === 'Dense' ? (
        <InfoDense />
      ) : props.type === 'input' ? (
        <InfoInput />
      ) : props.type === 'isTrue' ? (
        <InfoTrueValues />
      ) : null}
    </MathJaxContext>
  );
}
