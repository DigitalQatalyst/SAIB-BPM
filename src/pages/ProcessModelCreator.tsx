import React, { useCallback, useState, DragEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Save, Download, Upload, ChevronDown, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { useUser } from '../context/UserContext';
import { addRequest, submitForApproval } from '../services/requestTracking';
import { v4 as uuidv4 } from 'uuid';
import { saveProcessModel, linkProcessModelToDocument } from '../utils/processModelUtils';
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
  const { documentId } = useParams<{ documentId?: string }>();
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const user = useUser();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [processName, setProcessName] = useState('');

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

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // Nodes successfully deleted
    },
    []
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      // Edges successfully deleted
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

  const handleExportPNG = async () => {
    const imageWidth = 1024;
    const imageHeight = 768;

    try {
      // Get all nodes to calculate bounds
      const nodesBounds = getNodesBounds(getNodes());

      // Calculate viewport to fit all nodes with padding for edges
      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,  // minZoom
        2,    // maxZoom
        0.2   // padding - captures edges extending beyond nodes
      );

      // Target the viewport element with proper transform
      const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) {
        console.error('Viewport element not found');
        return;
      }

      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      const link = document.createElement('a');
      link.download = `process-model-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setShowExportMenu(false);
    } catch (err) {
      console.error('Error exporting PNG:', err);
      alert('Failed to export PNG. Please try again.');
    }
  };

  const handleExportJPG = async () => {
    const imageWidth = 1024;
    const imageHeight = 768;

    try {
      // Get all nodes to calculate bounds
      const nodesBounds = getNodesBounds(getNodes());

      // Calculate viewport to fit all nodes with padding for edges
      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,  // minZoom
        2,    // maxZoom
        0.2   // padding - captures edges extending beyond nodes
      );

      // Target the viewport element with proper transform
      const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) {
        console.error('Viewport element not found');
        return;
      }

      const dataUrl = await toJpeg(viewportElement, {
        backgroundColor: '#ffffff',
        quality: 0.95,
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      const link = document.createElement('a');
      link.download = `process-model-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      setShowExportMenu(false);
    } catch (err) {
      console.error('Error exporting JPG:', err);
      alert('Failed to export JPG. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    const imageWidth = 1024;
    const imageHeight = 768;

    try {
      // Get all nodes to calculate bounds
      const nodesBounds = getNodesBounds(getNodes());

      // Calculate viewport to fit all nodes with padding for edges
      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,  // minZoom
        2,    // maxZoom
        0.2   // padding - captures edges extending beyond nodes
      );

      // Target the viewport element with proper transform
      const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) {
        console.error('Viewport element not found');
        return;
      }

      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      const pdf = new jsPDF({
        orientation: imageWidth > imageHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imageWidth, imageHeight],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight);
      pdf.save(`process-model-${Date.now()}.pdf`);
      setShowExportMenu(false);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportJSON = () => {
    handleSave();
    setShowExportMenu(false);
  };

  const handleSaveAndLinkToDocument = async () => {
    if (nodes.length === 0) {
      alert('Please create a process model before saving.');
      return;
    }

    const name = processName || prompt('Enter a name for this process model:');
    if (!name) return;

    setProcessName(name);

    try {
      // Export process model as image
      const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) {
        throw new Error('Could not find process model canvas');
      }

      const imageDataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff',
        width: 1024,
        height: 768,
      });

      // Generate process model ID
      const processModelId = uuidv4();

      // Create process model data with image
      const processModelData = {
        id: processModelId,
        title: name,
        nodes,
        edges,
        imageDataUrl,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown',
      };

      // Save process model
      saveProcessModel(processModelData);

      // Link to document
      if (documentId) {
        linkProcessModelToDocument(documentId, processModelId);
        alert(`Process model "${name}" has been saved and linked to your document!`);
        navigate(`/docwriter/${documentId}?processModelAdded=true`);
      }
    } catch (err) {
      console.error('Error saving process model:', err);
      alert('Failed to save process model. Please try again.');
    }
  };

  const handleSubmitForApproval = () => {
    if (nodes.length === 0) {
      alert('Please create a process model before submitting for approval.');
      return;
    }

    const name = processName || prompt('Enter a name for this process model:');
    if (!name) return;

    setProcessName(name);

    try {
      // Generate a unique document ID
      const documentId = uuidv4();

      // Create process model data
      const processModelData = {
        id: documentId,
        title: name,
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown',
      };

      // Store the process model in localStorage
      const processModelsKey = 'processModels';
      const existingModels = localStorage.getItem(processModelsKey);
      const models = existingModels ? JSON.parse(existingModels) : [];
      models.push(processModelData);
      localStorage.setItem(processModelsKey, JSON.stringify(models));

      // Create a request for approval
      const newRequest = addRequest({
        requestType: 'Process Model Request',
        requestDetail: `Process Model: ${name}`,
        serviceName: `Process Model: ${name}`,
        serviceCategory: 'Process Modeling',
        priority: 'Medium',
        latestNote: 'Process model created and submitted for approval',
        requester: user?.name || 'Unknown',
        requesterEmail: user?.email || '',
        department: 'Operations',
        fullDescription: `A new process model "${name}" has been created and submitted for approval. This model contains ${nodes.length} nodes and ${edges.length} connections.`,
      });

      // Link the document to the request
      submitForApproval(newRequest.id, documentId);

      alert(`Process model "${name}" has been submitted for approval!\n\nTicket Number: ${newRequest.ticketNumber}`);

      // Optionally navigate to track requests
      const shouldNavigate = confirm('Would you like to view your request?');
      if (shouldNavigate) {
        navigate('/track-requests');
      }
    } catch (err) {
      console.error('Error submitting for approval:', err);
      alert('Failed to submit process model for approval. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 -mt-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
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

            {/* Export Dropdown */}
            <div className="relative export-dropdown">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]"
              >
                <Download className="-ml-1 mr-2 h-5 w-5" />
                Export
                <ChevronDown className="ml-2 -mr-1 h-4 w-4" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu">
                    <button
                      onClick={handleExportPNG}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export as PNG
                    </button>
                    <button
                      onClick={handleExportJPG}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export as JPG
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save & Link to Document button - appears only when coming from DocWriter */}
            {documentId && (
              <button
                onClick={handleSaveAndLinkToDocument}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save & Return to Document
              </button>
            )}

            {!documentId && (
              <button
                onClick={handleSubmitForApproval}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Send className="-ml-1 mr-2 h-5 w-5" />
                Submit for Approval
              </button>
            )}
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
            deleteKeyCode={['Backspace', 'Delete']}
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
