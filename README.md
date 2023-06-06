# CoViz
CoViz is a **visual deep learning framework** for the web that allows users to easily build and train neural networks. The framework supports basic neural network components such as dense layers of neurons, ReLU activations, Softmax, mean squared error loss, and cross-entropy error loss. With these building blocks, users can create and experiment with a wide range of neural network architectures. 

CoViz is one of the first projects to use WebGPU 🔥 to implement a fully differentiable programming engine. The project is still in its early stages and constantly evolving.


## Demo
You can try out CoViz by visiting the live demo at https://covizdemo.vercel.app/.

![image](https://github.com/TilliFe/CoViz/assets/93252915/146d32a5-a9d2-475b-a20d-a1c4041b0568) 
> CoViz's user interface features a node editor, powered by ReactFlow, that allows users to easily build a neural network computation graph. Users can select from a range of regression and classification tasks and datasets, and train their network to learn patterns in the data.


## Getting Started
To run CoViz locally on your machine, follow these steps:

1. Make sure you have npm installed on your machine. If not, you can download it from the official website.
2. Clone the repository.
3. In your terminal, navigate to the cloned repository and run `npm install` to install all the dependencies.
4. Run `npm start` to start the application.

2. Open a browser (e.g., Chrome) and go to [http://localhost:3000/](http://localhost:3000/).
Any changes you make to the code will automatically be reflected in the browser window.

**Note:** CoViz requires **WebGPU** to be enabled in your browser. In Chrome, you can enable WebGPU by going to [chrome://flags/](chrome://flags/) and searching for "WebGPU".

## About
CoViz is built as part of my bachelor's thesis. The thesis covers the theoretical foundations of building a deep learning framework, including computation graphs and automatic differentiation. You can read my thesis here: [link to PDF](<URL>).
