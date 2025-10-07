import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import dagre from 'dagre';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Download,
  Plus,
  Trash2,
  Wand2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlowchartEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  roadmapData?: {
    title: string;
    description: string;
    technologies: string[];
    difficulty: string;
  };
  onSave: (nodes: Node[], edges: Edge[]) => void;
}

const nodeColor = (type: string) => {
  switch (type) {
    case 'input':
      return '#10b981';
    case 'output':
      return '#f59e0b';
    default:
      return '#3b82f6';
  }
};

const CustomFlowNode = ({ data, id }: any) => {
  const [showContent, setShowContent] = useState(false);

  const handleClick = () => {
    setShowContent(true);
  };

  const handleRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.redirectUrl) {
      window.open(data.redirectUrl, '_blank');
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`px-4 py-3 rounded-xl border-2 shadow-lg transition-all hover:shadow-2xl cursor-pointer hover:scale-105 relative group`}
        style={{
          backgroundColor: data.color || '#ffffff',
          borderColor: data.color || '#3b82f6',
          minWidth: '200px',
          minHeight: '90px',
        }}
      >
        {/* Node Icon/Number */}
        <div
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: data.color || '#3b82f6' }}
        >
          {id.split('-')[1] || '1'}
        </div>

        {/* Content */}
        <div className="font-semibold text-sm text-center mb-1">{data.label}</div>
        {data.description && (
          <div className="text-xs text-gray-600 text-center line-clamp-2">{data.description}</div>
        )}

        {/* Status Indicator */}
        {data.redirectUrl && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Has external link" />
        )}

        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: data.color || '#3b82f6' }} />
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: data.color || '#3b82f6' }} />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Modal */}
      {showContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowContent(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ backgroundColor: `${data.color || '#3b82f6'}15` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: data.color || '#3b82f6' }}
                >
                  {id.split('-')[1] || '1'}
                </div>
                <h3 className="text-xl font-bold">{data.label}</h3>
              </div>
              <button
                onClick={() => setShowContent(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              {data.content ? (
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">{data.content}</div>
                </div>
              ) : data.description ? (
                <div className="text-gray-700">{data.description}</div>
              ) : (
                <div className="text-gray-500 italic">No content available for this node.</div>
              )}

              {data.resources && data.resources.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-3">Resources:</h4>
                  <ul className="space-y-2">
                    {data.resources.map((resource: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Click to learn more about this step
              </div>
              {data.redirectUrl && (
                <button
                  onClick={handleRedirect}
                  className="px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
                  style={{ backgroundColor: data.color || '#3b82f6' }}
                >
                  <span>Open Resource</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const nodeTypes = {
  default: CustomFlowNode,
  input: CustomFlowNode,
  output: CustomFlowNode,
};

export function FlowchartEditor({
  initialNodes = [],
  initialEdges = [],
  roadmapData,
  onSave,
}: FlowchartEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nodeForm, setNodeForm] = useState({
    label: '',
    description: '',
    content: '',
    redirectUrl: '',
    resources: [] as string[],
    color: '#3b82f6',
  });
  const [resourceInput, setResourceInput] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const autoLayout = useCallback(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 200, height: 100 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 100,
          y: nodeWithPosition.y - 50,
        },
      };
    });

    setNodes(layoutedNodes);
  }, [nodes, edges, setNodes]);

  const generateFlowchart = async () => {
    if (!roadmapData) {
      toast({
        title: 'Error',
        description: 'Roadmap data is required to generate flowchart',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/roadmaps/generate-flowchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapData),
      });

      if (!response.ok) throw new Error('Failed to generate flowchart');

      const data = await response.json();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);

      toast({
        title: 'Success',
        description: 'Flowchart generated successfully',
      });

      setTimeout(() => autoLayout(), 100);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate flowchart',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { ...nodeForm },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeForm({ label: '', description: '', content: '', redirectUrl: '', resources: [], color: '#3b82f6' });
    setResourceInput('');
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const downloadImage = async (format: 'png' | 'svg') => {
    if (!reactFlowWrapper.current) return;

    const downloadFunction = format === 'png' ? toPng : toSvg;

    try {
      const dataUrl = await downloadFunction(reactFlowWrapper.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `roadmap-flowchart.${format}`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'Success',
        description: `Flowchart downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download flowchart',
        variant: 'destructive',
      });
    }
  };

  const downloadWorkflow = () => {
    const workflow = {
      nodes: nodes,
      edges: edges,
      metadata: {
        title: roadmapData?.title || 'Learning Workflow',
        createdAt: new Date().toISOString(),
      }
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${roadmapData?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'roadmap'}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Workflow downloaded successfully',
    });
  };

  const handleSave = () => {
    onSave(nodes, edges);
    toast({
      title: 'Flowchart Saved',
      description: 'Flowchart has been saved to the roadmap',
    });
  };

  // Auto-save when nodes or edges change
  useCallback(() => {
    if (nodes.length > 0) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  return (
    <>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold">Workflow Fullscreen View</h3>
              <Button onClick={() => setIsFullscreen(false)} variant="outline" size="sm">
                Close Fullscreen
              </Button>
            </div>
            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#94a3b8', strokeWidth: 2 }
                }}
              >
                <Controls />
                <MiniMap nodeColor={nodeColor} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-lg">
                  <div className="text-xs space-y-1">
                    <div>Click nodes to view content</div>
                    <div>Drag to move nodes</div>
                    <div>Connect nodes for workflow</div>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </div>
        </div>
      )}

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={generateFlowchart} disabled={isGenerating}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </Button>

          <Button onClick={autoLayout} variant="outline">
            <Maximize2 className="mr-2 h-4 w-4" />
            Auto Layout
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Workflow Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Node Title *</Label>
                  <Input
                    value={nodeForm.label}
                    onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
                    placeholder="e.g., Learn React Basics"
                  />
                </div>
                <div>
                  <Label>Short Description</Label>
                  <Textarea
                    value={nodeForm.description}
                    onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                    placeholder="Brief description shown on node"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Full Content *</Label>
                  <Textarea
                    value={nodeForm.content}
                    onChange={(e) => setNodeForm({ ...nodeForm, content: e.target.value })}
                    placeholder="Detailed content that appears when node is clicked..."
                    rows={6}
                  />
                </div>
                <div>
                  <Label>Learning Resources</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={resourceInput}
                      onChange={(e) => setResourceInput(e.target.value)}
                      placeholder="Add a resource link or text"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (resourceInput.trim()) {
                            setNodeForm({
                              ...nodeForm,
                              resources: [...nodeForm.resources, resourceInput.trim()]
                            });
                            setResourceInput('');
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (resourceInput.trim()) {
                          setNodeForm({
                            ...nodeForm,
                            resources: [...nodeForm.resources, resourceInput.trim()]
                          });
                          setResourceInput('');
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {nodeForm.resources.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {nodeForm.resources.map((resource, idx) => (
                        <div key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {resource}
                          <button
                            onClick={() => {
                              setNodeForm({
                                ...nodeForm,
                                resources: nodeForm.resources.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label>External Link (optional)</Label>
                  <Input
                    value={nodeForm.redirectUrl}
                    onChange={(e) => setNodeForm({ ...nodeForm, redirectUrl: e.target.value })}
                    placeholder="https://example.com/tutorial"
                  />
                </div>
                <div>
                  <Label>Node Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={nodeForm.color}
                      onChange={(e) => setNodeForm({ ...nodeForm, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <span className="text-sm text-gray-600">{nodeForm.color}</span>
                  </div>
                </div>
                <Button onClick={addNode} className="w-full" disabled={!nodeForm.label || !nodeForm.content}>
                  Add Node to Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsFullscreen(true)} variant="outline">
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullscreen
          </Button>
          <Button onClick={() => downloadImage('png')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PNG
          </Button>
          <Button onClick={() => downloadImage('svg')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            SVG
          </Button>
          <Button onClick={downloadWorkflow} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Workflow
          </Button>
          {onSave && (
            <Button onClick={handleSave}>Save Flowchart</Button>
          )}
        </div>
      </div>

      <div
        ref={reactFlowWrapper}
        className="border rounded-lg"
        style={{ height: '600px', backgroundColor: '#fafafa' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          }}
        >
          <Controls />
          <MiniMap nodeColor={nodeColor} />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-lg">
            <div className="text-xs space-y-1">
              <div>Click nodes to view content</div>
              <div>Drag to move nodes</div>
              <div>Connect nodes for workflow</div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {nodes.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Nodes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{node.data.label}</div>
                  {node.data.redirectUrl && (
                    <div className="text-xs text-blue-600 truncate">
                      {node.data.redirectUrl}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNode(node.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}