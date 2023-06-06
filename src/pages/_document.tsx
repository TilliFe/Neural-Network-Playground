import { Html, Head, Main, NextScript } from 'next/document';

const Document: React.FunctionComponent = () => {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="CoViz - A visual deep learning playground built with WebGPU. Easily build and train Neural Networks for Classification and Regression tasks in a Node editor without any coding required. Try our beta version now!"
        />
        <meta
          name="keywords"
          content="CoViz, WebGPU, Deep Learning, Playground, Neural Network, Node Editor, Visualization, Computation Graph, Tensor Node, PyTorch, TensorFlow, TensorBoard"
        />
        <link rel="canonical" href="https://dicovis.vercel.app/" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/theme/monokai.min.css"
          rel="stylesheet"
        />
        <meta
          httpEquiv="origin-trial"
          content="As2GyKl2RoDVd+xr1KVeqGjbcUMUPClbP9TvrWOUZbCQv6AJK/Km38sx3qrqKukLVt+KTgVeDl/YcsjxHsLEdwAAAABOeyJvcmlnaW4iOiJodHRwczovL2F1c3Rpbi1lbmcuY29tOjQ0MyIsImZlYXR1cmUiOiJXZWJHUFUiLCJleHBpcnkiOjE2NzUyMDk1OTl9"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
