import { MathJax, MathJaxContext } from 'better-react-mathjax';
import React from 'react';

const InfoReLU = () => {
  return (
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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
      A <strong>Dense layer</strong>, also known as a fully connected layer, is
      a layer of neurons where each neuron is connected to all neurons in the
      previous layer. It is used to learn complex relationships between the
      input and output data.
      <div>
        The number of <strong>Neurons</strong> can be adjusted to balance model
        accuracy, training time, and overfitting/underfitting.
      </div>
      A <strong>Bias</strong> is a value added to the weighted sum of the inputs
      to a neuron, allowing the model to fit the data better by shifting the
      activation function.
      <div>
        Mathematically, a Dense layer can be represented as:
        <MathJax>{'$$ Dense(X) = W*X + b*1 $$'}</MathJax>
        where <MathJax inline>{'W'}</MathJax> represents the weights,{' '}
        <MathJax inline>{'X'}</MathJax> represents the input data,{' '}
        <MathJax inline>{'b'}</MathJax> represents the bias, and{' '}
        <MathJax inline>{'1'}</MathJax> is a vector of ones. The weights and
        biases are parameters of the network that are adapted during training to
        minimize the loss of the network.
      </div>
    </div>
  );
};

const InfoMult = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      The <strong>Mult</strong> operation performs matrix multiplication of its
      parent nodes&apos; data. For a successful matrix multiplication, the
      number of columns in the upper (left) parent must match the number of rows
      in the lower (right) parent.
      <div>
        Mathematically, this can be represented as:
        <MathJax>{'$$ Mult(A,B) = A * B $$'}</MathJax> where{' '}
        <MathJax inline>{'A'}</MathJax> represents the upper (left) parent and{' '}
        <MathJax inline>{'B'}</MathJax> represents the lower (right) parent.
      </div>
      <div>
        The resulting matrix <MathJax inline>{'C = A * B'}</MathJax> has
        dimensions equal to the number of rows in matrix{' '}
        <MathJax inline>{'A'}</MathJax> by the number of columns in matrix{' '}
        <MathJax inline>{'B'}</MathJax>. Each element in matrix{' '}
        <MathJax inline>{'C'}</MathJax> is calculated as:
        <MathJax>{`$$ c_{i,j} = \\sum_{k=1}^{n} a_{i,k} b_{k,j} $$`}</MathJax>
        where <MathJax inline>{'n'}</MathJax> is the number of columns in matrix{' '}
        <MathJax inline>{'A'}</MathJax> (or equivalently, the number of rows in
        matrix <MathJax inline>{'B'}</MathJax>).
      </div>
    </div>
  );
};

const InfoAdd = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      The <strong>Add</strong> operation performs element-wise addition of its
      parent nodes&apos; data. For a successful matrix addition, the shapes of
      the parent nodes must be the same.
      <div>
        Mathematically, this can be represented as:
        <MathJax>{'$$ Add(A,B) = A + B $$'}</MathJax>
        where <MathJax inline>{'A'}</MathJax> represents the upper (left) parent
        and <MathJax inline>{'B'}</MathJax> represents the lower (right) parent.
      </div>
    </div>
  );
};

const InfoInput = () => {
  return (
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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

const InfoNone = () => {
  return (
    <div style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '1.5' }}>
      A node with type <strong>None</strong> holds a matrix of size rows x cols
      and serves as input to later nodes. The user can set the initialization to
      `allZeros`, `allOnes`, or `random`.
      <div>
        It is important to keep in mind the dimensions set here, as later
        nodes&apos; dimensions depend on these values.
      </div>
      <div>
        If `requiresGradient` is set to false, the node will not participate in
        the backpropagation algorithm and its values will remain static. If
        `requiresGradient` is set to true, the entries of the matrix will be
        updated during training.
      </div>
    </div>
  );
};

const InfoTrueValues = () => {
  return (
    <div
      style={{
        fontFamily: 'Roboto',
        fontSize: '16px',
        lineHeight: '1.5',
        marginRight: '7px',
      }}
    >
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
    <>
      <style>
        {`
          /* For WebKit (Safari, Chrome, etc.) */
          ::-webkit-scrollbar {
            width: 4px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 20px;
            border: 4px solid transparent;
          }

          /* For Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
        `}
      </style>
      <MathJaxContext>
        {props.type === 'ReLU' ? (
          <InfoReLU />
        ) : props.type === 'softmax' ? (
          <InfoSoftmax />
        ) : props.type === 'mult' ? (
          <InfoMult />
        ) : props.type === 'add' ? (
          <InfoAdd />
        ) : props.type === 'none' ? (
          <InfoNone />
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
    </>
  );
}
