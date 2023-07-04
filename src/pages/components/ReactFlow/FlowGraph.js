import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BezierEdge,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TensorNode from '../Tensors/TensorNode';
import { useSelector, useDispatch } from 'react-redux';
import { computeGraphActions } from '../../../store/ComputeGraph-slice';

async function fetchNodes(modelName) {
  if (modelName === '') {
    return [];
  }
  try {
    const response = await fetch('/Models/' + modelName + '/nodes.json');
    const nodes = await response.json();
    return nodes;
  } catch (error) {
    return [];
  }
}

async function fetchEdges(modelName) {
  if (modelName === '') {
    return [];
  }
  try {
    const response = await fetch('/Models/' + modelName + '/edges.json');
    const nodes = await response.json();
    return nodes;
  } catch (error) {
    return [];
  }
}

const rfStyle = {
  backgroundColor: 'rgb(255,255,255)',
};

const nodeTypes = { TensorNode: TensorNode };

const CustomEdge = (props) => {
  const { animated } = props;

  // Set the stroke color based on whether the edge is selected
  const stroke = animated ? 'rgb(140,140,140)' : 'rgb(140,140,140)';

  return <BezierEdge {...props} style={{ stroke, strokeWidth: 2 }} />;
};

export default function Flow() {
  const initialNodes = [];
  const initialEdges = [];

  const predefinedModel = useSelector(
    (state) => state.computeGraph.predefinedModel
  );

  const dispatch = useDispatch();
  const setTensorNodes = (tensors) => {
    dispatch(computeGraphActions.setTensorNodes(tensors));
  };
  const setXVals = (xVals) => {
    dispatch(computeGraphActions.setXVals(xVals));
  };
  const setPredVals = (predictions) => {
    dispatch(computeGraphActions.setPredVals(predictions));
  };
  const setTrueVals = (trueVals) => {
    dispatch(computeGraphActions.setTrueVals(trueVals));
  };
  const setAvgError = (avgError) => {
    dispatch(computeGraphActions.setAvgError(avgError));
  };

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [heighestId, setHeighestId] = useState(0);

  useEffect(() => {
    setNodes([]);
    setEdges([]);

    fetchNodes(predefinedModel).then((nodes) => {
      setNodes(nodes);
      fetchEdges(predefinedModel).then((edges) => {
        setEdges(edges);
        if (nodes.length > 0) {
          let highest = parseInt(nodes[0].id); // assume first element is the highest
          for (let i = 1; i < nodes.length; i++) {
            if (parseInt(nodes[i].id) > highest) {
              highest = parseInt(nodes[i].id); // update highest number
            }
          }
          setHeighestId(highest + 1);
        }
      });
    });
    setXVals([]);
    setPredVals([]);
    setTrueVals([]);
    setAvgError(2);
  }, [predefinedModel]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params) => {
      // Create a new edge object with the custom type
      const newEdge = {
        ...params,
        type: 'custom',
      };

      // Add the new edge to the edges array
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setNodes]
  );

  const onRemoveEdge = useCallback(
    (event, edge) => {
      if (event.altKey) {
        event.stopPropagation();
        setEdges((els) => els.filter((e) => e.id !== edge.id));
      }
    },
    [setEdges]
  );

  const onRemoveNode = useCallback(
    (event, node) => {
      if (event.altKey) {
        event.stopPropagation();
        setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
        setEdges((edges) =>
          edges.filter((e) => e.source !== node.id && e.target !== node.id)
        );
      }
    },
    [setNodes, setEdges]
  );

  const resetLastTensor = () => {
    dispatch(computeGraphActions.setLastTensor(-1));
  };

  const clicked = useSelector((state) => state.computeGraph.clicked);
  const lastTensorId = useSelector((state) => state.computeGraph.lastTensor);
  const edgesActive = useSelector((state) => state.computeGraph.edgesActive);
  const batchSize = useSelector((state) => state.computeGraph.batchSize);
  // console.log(batchSize)

  useEffect(() => {
    setEdges((els) =>
      els.map((el) => {
        return {
          ...el,
          animated: edgesActive,
        };
      })
    );
  }, [edgesActive]);

  useEffect(() => {
    let nodesAll = JSON.parse(JSON.stringify(nodes));
    let edgesAll = JSON.parse(JSON.stringify(edges));
    let heighestNodeId = heighestId;

    const lastTensor = nodes.filter((node) => node.id === lastTensorId)[0];

    if (lastTensorId == -1) {
      return;
    }

    console.log(nodesAll);
    console.log(edgesAll);
    console.log(heighestId);
    console.log(lastTensorId);

    // set the cols size appropriately
    for (let node of nodesAll) {
      //we have only set rows (the number of neurons) for the Dense layer
      if (
        node.data.type == 'Dense' ||
        node.data.type == 'input' ||
        node.data.type == 'isTrue' ||
        node.data.type == 'MSE' ||
        node.data.type == 'CE'
      ) {
        node.data.cols = batchSize;
      }
      // infer the rows and column size from the parent
      else if (node.data.type == 'ReLU' || node.data.type == 'softmax') {
        const parentEdge = edgesAll.filter(
          (edge) => edge.target === node.id
        )[0];
        const parentNode = nodesAll.filter(
          (nde) => nde.id === parentEdge.source
        )[0];
        node.data.rows = parentNode.data.rows;
        node.data.cols = batchSize;
      }
    }

    // add additional nodes that are not rendered sucha as: nodes of Dense layer
    for (let node of nodesAll) {
      if (node.data.type == 'input' || node.data.type == 'isTrue') {
        node.data.requiresGradient = false;
      }

      if (node.data.type == 'Dense') {
        const parentEdge = edgesAll.filter(
          (edge) => edge.target === node.id
        )[0];
        const parentNode = nodesAll.filter(
          (nde) => nde.id === parentEdge.source
        )[0];
        const parentNodeId = parentNode.id;

        // because we calculate W*X + B and X is right
        for (let nd of nodesAll) {
          if (nd.id == parentNodeId) {
            nd.isRight = true;
          }
        }

        let id = heighestNodeId++;
        const W = {
          id: id.toString(),
          modelId: -1,
          modelParents: [],
          modelChildren: [],
          isRight: false,
          type: 'TensorNode',
          animated: true,
          dragHandle: '.custom-drag-handle',
          position: { x: node.position.x, y: node.position.y },
          data: {
            type: 'none',
            initialization: 'random',
            rows: node.data.rows,
            cols: parentNode.data.rows,
            requiresGradient: true,
            parents: [],
            children: [id + 1],
            isLast: false,
            isTrue: false,
            isInput: false,
            isOutput: false,
            metaDims: [node.data.rows],
          },
        };
        nodesAll.push(W);

        if (node.data.addBias) {
          id = heighestNodeId++;
          const W_x_X = {
            id: id.toString(),
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: true,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'mult',
              initialization: 'zeros',
              rows: node.data.rows,
              cols: batchSize,
              requiresGradient: true,
              parents: [id - 1, Number(parentNodeId)], // [ id of b , id of Ones ]
              children: [node.id],
              isLast: false,
              isTrue: false,
              isInput: false,
              isOutput: false,
              metaDims: [node.data.rows],
            },
          };
          // setHeighestId((heighestId) => heighestId + 1);
          nodesAll.push(W_x_X);

          // make W_x_X the child of parent node of node
          parentNode.children = parentNode.data.children.filter(
            (nd) => nd.id != node.id
          );
          parentNode.children.push(W_x_X.id);
          // console.log(nodesAll);

          id = heighestNodeId++;
          const b = {
            id: id.toString(),
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: false,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'none',
              initialization: 'random',
              rows: node.data.rows,
              cols: 1,
              requiresGradient: true,
              parents: [],
              children: [id + 2],
              isLast: false,
              isTrue: false,
              isInput: false,
              isOutput: false,
              metaDims: [node.data.rows],
            },
          };
          nodesAll.push(b);

          id = heighestNodeId++;
          const Ones = {
            id: id.toString(),
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: true,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'none',
              initialization: 'ones',
              rows: 1,
              cols: node.data.cols,
              requiresGradient: false,
              parents: [],
              children: [id + 1],
              isLast: false,
              isTrue: false,
              isInput: false,
              isOutput: false,
              metaDims: [node.data.rows],
            },
          };
          nodesAll.push(Ones);

          id = heighestNodeId++;
          const b_x_Ones = {
            id: id.toString(),
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: true,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'mult',
              initialization: 'zeros',
              rows: node.data.rows,
              cols: node.data.cols,
              requiresGradient: true,
              parents: [id - 1, id - 2], // [ id of b , id of Ones ]
              children: [Number(node.id)],
              isLast: false,
              isTrue: false,
              isInput: false,
              isOutput: false,
              metaDims: [node.data.rows],
            },
          };
          nodesAll.push(b_x_Ones);

          let nodeNew = {
            id: node.id,
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: false,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'add',
              initialization: 'zeros',
              rows: node.data.rows,
              cols: node.data.cols,
              requiresGradient: node.data.requiresGradient,
              parents: [Number(W_x_X.id), Number(b_x_Ones.id)], // [ id of b , id of Ones ]
              children: node.children,
              isLast: node.data.isLast,
              isTrue: false,
              isInput: false,
              isOutput: node.data.isOutput,
              metaDims: [node.data.rows],
            },
          };
          // remove old (Dense) node and and add (add) newNode
          nodesAll = nodesAll.filter((nde) => nde.id != node.id);
          nodesAll.push(nodeNew);

          // add edges between additional  tensors
          edgesAll = edgesAll.filter((edg) => edg.target != node.id);
          edgesAll.push({
            source: parentNode.id,
            sourceHandle: 'Source',
            target: W_x_X.id,
            targetHandle: 'Right',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: W.id,
            sourceHandle: 'Source',
            target: W_x_X.id,
            targetHandle: 'Left',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: b.id,
            sourceHandle: 'Source',
            target: b_x_Ones.id,
            targetHandle: 'Left',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: Ones.id,
            sourceHandle: 'Source',
            target: b_x_Ones.id,
            targetHandle: 'Right',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: W_x_X.id,
            sourceHandle: 'Source',
            target: nodeNew.id,
            targetHandle: 'Left',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: b_x_Ones.id,
            sourceHandle: 'Source',
            target: nodeNew.id,
            targetHandle: 'Right',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
        }

        // if no bias is added
        else {
          const nodeNew = {
            id: node.id,
            modelId: -1,
            modelParents: [],
            modelChildren: [],
            isRight: true,
            type: 'TensorNode',
            animated: true,
            dragHandle: '.custom-drag-handle',
            position: { x: node.position.x, y: node.position.y },
            data: {
              type: 'mult',
              initialization: 'zeros',
              rows: node.data.rows,
              cols: node.data.cols,
              requiresGradient: true,
              parents: [W.id, Number(parentNodeId)],
              children: node.children,
              isLast: node.data.isLast,
              isTrue: false,
              isInput: false,
              isOutput: node.data.isOutput,
              metaDims: [node.data.rows],
            },
          };
          nodesAll = nodesAll.filter((nde) => nde.id != node.id);
          nodesAll.push(nodeNew);

          edgesAll = edgesAll.filter((edg) => edg.target != node.id);
          edgesAll.push({
            source: parentNode.id,
            sourceHandle: 'Source',
            target: nodeNew.id,
            targetHandle: 'Right',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
          edgesAll.push({
            source: W.id,
            sourceHandle: 'Source',
            target: nodeNew.id,
            targetHandle: 'Left',
            id: 'reactflow__edge-1Source-0Single',
            type: 'custom',
          });
        }
      }
    }

    // console.log("building up model graph...")
    for (let i = 0; i < nodesAll.length; i++) {
      nodesAll[i].queueCount = 0;
      if (nodesAll[i].id == lastTensorId) {
        nodesAll[i].data.isLast = true;
      } else {
        nodesAll[i].data.isLast = false;
      }
    }
    const forwardTape = [];
    let lastTensorAll = nodesAll.filter((nd) => nd.id == lastTensor.id)[0];
    let queue = [lastTensorAll];

    while (queue.length > 0) {
      let currentVertex = queue.shift();

      const parents = edgesAll.filter(
        (edge) => edge.target === currentVertex.id
      );
      forwardTape.push(currentVertex);
      for (let par of parents) {
        let parNode = nodesAll.filter((node) => node.id == par.source)[0];
        parNode.queueCount++;
        let allChildrenOfParNode = edgesAll.filter(
          (edge) => edge.source === parNode.id
        );
        if (parNode.queueCount == allChildrenOfParNode.length) {
          queue.push(parNode);
        }
      }
    }
    for (let i = 0; i < nodesAll.length; i++) {
      nodesAll[i].queueCount = 0;
    }
    forwardTape.reverse();

    for (let i = 0; i < forwardTape.length; i++) {
      forwardTape[i].modelId = i;
    }

    for (let node of forwardTape) {
      node.modelChildren = [];
      const children = edgesAll.filter((edge) => edge.source === node.id);
      for (const child of children) {
        const childNode = nodesAll.filter((ch) => ch.id === child.target)[0];
        node.modelChildren.push(childNode.modelId);
      }

      node.modelParents = [];
      const parents = edgesAll.filter((edge) => edge.target === node.id);
      for (let par of parents) {
        const parNode = nodesAll.filter((nd) => nd.id === par.source)[0];
        node.modelParents.push(parNode.modelId);
        if (par.targetHandle == 'Right') {
          parNode.isRight = true;
        } else {
          parNode.isRight = false;
        }
      }
    }

    let tensors = [];
    for (let node of forwardTape) {
      let tensor = {
        id: node.modelId,
        type: node.data.type,
        initialization: node.data.initialization,
        rows: Number(node.data.rows),
        cols: Number(node.data.cols),
        requiresGradient: node.data.requiresGradient,
        parents: node.modelParents,
        children: node.modelChildren,
        isRightMultiplicator: node.isRight,
        initialization: node.data.initialization,
        isLast: node.data.isLast,
        isTrue: node.data.isTrue,
        isInput: node.data.isInput,
        isOutput: node.data.isOutput,
        metaDims: node.data.metaDims,
      };

      // check for wrong order of parent: left should be first and right should be second
      if (tensor.parents.length == 2) {
        if (forwardTape[tensor.parents[0]].isRight) {
          // console.log("shifting order of parents array at tensor " + node.modelId);
          let temp = tensor.parents[0];
          tensor.parents[0] = tensor.parents[1];
          tensor.parents[1] = temp;
        }
      }
      tensors.push(tensor);
    }
    console.log(tensors);
    setTensorNodes(tensors);
    resetLastTensor();
  }, [clicked, lastTensorId]);

  const [variant] = useState('dots');

  const onNodeDoubleClick = useCallback(
    (event, node) => {
      event.stopPropagation();
      setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
      setEdges((edges) =>
        edges.filter((e) => e.source !== node.id && e.target !== node.id)
      );
    },
    [setNodes, setEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      setEdges((edges) => edges.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  const onPaneClick = useCallback(
    (event) => {
      event.stopPropagation();
      const isKeyDownA = event.ctrlKey;
      if (isKeyDownA) {
        let newMetaData = {
          type: 'none',
          initialization: 'zeros',
          rows: 1,
          cols: 1,
          requiresGradient: true,
          parents: [],
          children: [],
          isLast: false,
          isTrue: false,
          isInput: false,
          isOutput: false,
          metaDims: [1],
          addBias: true, // only important for Dense layers
        };
        const x = event.clientX;
        const y = event.clientY;
        const newNode = {
          id: heighestId.toString(),
          modelId: -1,
          modelParents: [],
          modelChildren: [],
          isRight: false,
          type: 'TensorNode',
          animated: true,
          dragHandle: '.custom-drag-handle',
          position: { x, y },
          data: newMetaData,
        };
        setHeighestId((heighestId) => heighestId + 1);
        setNodes((nodes) => nodes.concat(newNode));
      }
    },
    [nodes]
  );
  const reactFlowWrapper = useRef(null);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
        const x = event.clientX - boundingRect.left + window.scrollX;
        const y = event.clientY - boundingRect.top + window.scrollY;
        // Manually take into account any zooming or panning here
        const position = { x, y };
        let newMetaData = {
          type: 'none',
          initialization: 'zeros',
          rows: 1,
          cols: 1,
          requiresGradient: true,
          parents: [],
          children: [],
          isLast: false,
          isTrue: false,
          isInput: false,
          isOutput: false,
          metaDims: [1],
          addBias: true, // only important for Dense layers
        };
        const newNode = {
          id: heighestId.toString(),
          modelId: -1,
          modelParents: [],
          modelChildren: [],
          isRight: false,
          type: 'TensorNode',
          animated: true,
          dragHandle: '.custom-drag-handle',
          position,
          data: newMetaData,
        };
        setHeighestId((heighestId) => heighestId + 1);
        setNodes((nodes) => nodes.concat(newNode));
      }
    };
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.addEventListener(
        'contextmenu',
        handleContextMenu
      );
    }
    return () => {
      if (reactFlowWrapper.current) {
        reactFlowWrapper.current.removeEventListener(
          'contextmenu',
          handleContextMenu
        );
      }
    };
  }, [heighestId]);

  return (
    <>
      <div style={{ height: '100%', width: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          minZoom={0.1}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onRemoveEdge}
          onNodeClick={onRemoveNode}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          style={rfStyle}
          snapToGrid
          snapGrid={[40, 40]}
          edgeTypes={{ custom: CustomEdge }}
          fitView="true"
        >
          <Controls />
          <Background
            color="rgba(200,200,200,0.35)"
            size="4"
            variant={variant}
          />
        </ReactFlow>
      </div>
    </>
  );
}
