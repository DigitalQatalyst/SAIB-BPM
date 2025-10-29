import React, { useCallback, useState, DragEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Node,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Save, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StartEventNode from '../components/processModel/nodes/StartEventNode';
import EndEventNode from '../components/processModel/nodes/EndEventNode';
import TaskNode from '../components/processModel/nodes/TaskNode';
import GatewayNode from '../components/processModel/nodes/GatewayNode';
import SubprocessNode from '../components/processModel/nodes/SubprocessNode';

const nodeTypes: NodeTypes = {
  startEvent: StartEventNode,
  endEvent: EndEventNode,
  task: TaskNode,
  gateway: GatewayNode,
  subprocess: SubprocessNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'startEvent',
    data: { label: 'Start' },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [];

let nodeId = 2;

const FlowCanvas = () => {
  const navigate = useNavigate();
  const { screenToFlowPosition } = useReactFlow();

  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: { ...node.data, onLabelChange: updateNodeLabel },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      console.log('Deleted nodes:', deleted);
    },
    []
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      console.log('Deleted edges:', deleted);
    },
    []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeId++}`,
        type,
        position,
        data: {
          label: `${type} ${nodeId - 1}`,
          onLabelChange: updateNodeLabel,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    const flowData = {
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `process-model-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mr-6"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Process Model Creator
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Design and visualize your business process flows
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]"
            >
              <Save className="-ml-1 mr-2 h-5 w-5" />
              Save Model
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="-ml-1 mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Palette Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Process Elements
          </h3>
          <div className="space-y-3">
            {/* Start Event */}
            <div
              className="p-3 bg-green-50 border border-green-200 rounded-md cursor-move hover:bg-green-100"
              onDragStart={(event) => onDragStart(event, 'startEvent')}
              draggable
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Start Event</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Beginning of process</p>
            </div>

            {/* Task */}
            <div
              className="p-3 bg-blue-50 border border-blue-200 rounded-md cursor-move hover:bg-blue-100"
              onDragStart={(event) => onDragStart(event, 'task')}
              draggable
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Task</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Activity or action</p>
            </div>

            {/* Gateway */}
            <div
              className="p-3 bg-yellow-50 border border-yellow-200 rounded-md cursor-move hover:bg-yellow-100"
              onDragStart={(event) => onDragStart(event, 'gateway')}
              draggable
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 transform rotate-45 mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Gateway</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Decision point</p>
            </div>

            {/* Subprocess */}
            <div
              className="p-3 bg-purple-50 border border-purple-200 rounded-md cursor-move hover:bg-purple-100"
              onDragStart={(event) => onDragStart(event, 'subprocess')}
              draggable
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Subprocess</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Nested process</p>
            </div>

            {/* End Event */}
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-md cursor-move hover:bg-red-100"
              onDragStart={(event) => onDragStart(event, 'endEvent')}
              draggable
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-red-700 mr-3"></div>
                <span className="text-sm font-medium text-gray-900">End Event</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">End of process</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Instructions</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag elements onto canvas</li>
              <li>• Double-click nodes to edit names</li>
              <li>• Connect nodes by dragging handles</li>
              <li>• Delete: Select and press Delete</li>
              <li>• Pan: Click and drag canvas</li>
              <li>• Zoom: Mouse wheel or controls</li>
            </ul>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
            deleteKeyCode="Delete"
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

const ProcessModelCreator = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default ProcessModelCreator;
