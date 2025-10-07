import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background, BackgroundVariant, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle,
  Star,
  Users,
  BookOpen,
  PlayCircle,
  Download,
  Share2,
  ExternalLink,
  Maximize,
  Minimize,
  CheckCircle2,
  Zap
} from "lucide-react";

interface RoadmapStep {
  title: string;
  description: string;
  resources: string[];
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  technologies: string[];
  steps: RoadmapStep[];
  rating: number;
  enrolledCount: number;
  createdAt: string;
  image?: string;
  flowchartData?: {
    nodes: any[];
    edges: any[];
  };
}

const CustomFlowNode = ({ data, id }: any) => {
  const [showContent, setShowContent] = useState(false);

  const handleNodeClick = () => {
    setShowContent(true);
  };

  const handleRedirectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.redirectUrl) {
      window.open(data.redirectUrl, '_blank');
    }
  };

  // Status-based pastel colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return { bg: '#d4f4dd', border: '#86e8ab', text: '#1d7a3e' };
      case 'in-progress': return { bg: '#fff3cd', border: '#ffd966', text: '#b8860b' };
      case 'todo': return { bg: '#e3f2fd', border: '#90caf9', text: '#1976d2' };
      default: return { bg: '#f5f5f5', border: '#bdbdbd', text: '#616161' };
    }
  };

  const statusColor = getStatusColor(data.status || 'todo');
  const completion = data.completion || 0;
  const difficulty = data.difficulty || 'medium';
  const timeSpent = data.timeSpent || '0h';

  return (
    <>
      <div
        onClick={handleNodeClick}
        className={`rounded-2xl border-2 shadow-xl transition-all hover:shadow-2xl cursor-pointer hover:scale-105 relative group overflow-hidden`}
        style={{
          backgroundColor: statusColor.bg,
          borderColor: statusColor.border,
          minWidth: '240px',
          minHeight: '140px',
        }}
        title="Click to view details"
        data-testid={`flowchart-node-${id}`}
      >
        {/* Status Badge */}
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
          style={{
            backgroundColor: statusColor.border,
            color: statusColor.text,
          }}
        >
          {data.status === 'done' ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>Done</span>
            </>
          ) : data.status === 'in-progress' ? (
            <>
              <Zap className="w-3 h-3" />
              <span>In Progress</span>
            </>
          ) : (
            <>
              <Circle className="w-3 h-3" />
              <span>To Do</span>
            </>
          )}
        </div>

        {/* Node Number */}
        <div
          className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
          style={{ backgroundColor: statusColor.border }}
        >
          {id.split('-')[1] || '1'}
        </div>

        {/* Main Content */}
        <div className="p-4 pt-6">
          <div className="font-bold text-base mb-2" style={{ color: statusColor.text }}>
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-gray-600 line-clamp-2 mb-3">{data.description}</div>
          )}

          {/* Metrics Row */}
          <div className="flex items-center gap-3 text-xs mb-2">
            <div className="flex items-center gap-1" title="Completion">
              <span className="font-semibold" style={{ color: statusColor.text }}>
                {completion}%
              </span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1" title="Time Spent">
              <Clock className="w-3 h-3" style={{ color: statusColor.text }} />
              <span>{timeSpent}</span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1" title="Difficulty">
              <Star className="w-3 h-3" style={{ color: statusColor.text }} />
              <span className="capitalize">{difficulty}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${completion}%`,
                backgroundColor: statusColor.border,
              }}
            />
          </div>
        </div>

        {/* External Link Indicator */}
        {data.redirectUrl && (
          <div
            onClick={handleRedirectClick}
            className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: statusColor.border }}
            title="Click to open resource"
          >
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
              style={{ backgroundColor: `${statusColor.border}20` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: statusColor.border }}
                >
                  {id.split('-')[1] || '1'}
                </div>
                <h3 className="text-xl font-bold" style={{ color: statusColor.text }}>{data.label}</h3>
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
                Click nodes directly to visit resources
              </div>
              {data.redirectUrl && (
                <a
                  href={data.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: statusColor.border }}
                  data-testid={`redirect-link-${id}`}
                >
                  <span>Visit Resource</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
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

export default function RoadmapDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [learningMode, setLearningMode] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flowchartRef = useRef<HTMLDivElement>(null);

  const { data: roadmap, isLoading, error } = useQuery<Roadmap>({
    queryKey: [`/api/roadmaps/${id}`],
    enabled: !!id,
    retry: 3,
  });

  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [learningProgress, setLearningProgress] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { toast } = useToast();

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: [`/api/roadmaps/${id}/reviews`],
    enabled: !!id,
  });

  // Calculate progress based on completed nodes
  useEffect(() => {
    if (roadmap?.flowchartData?.nodes) {
      const totalNodes = roadmap.flowchartData.nodes.length;
      const progress = totalNodes > 0 ? (completedNodes.length / totalNodes) * 100 : 0;
      setLearningProgress(Math.round(progress));
    }
  }, [completedNodes, roadmap]);

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/roadmaps/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, review: reviewText }),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
      setReviewText('');
      queryClient.invalidateQueries({ queryKey: [`/api/roadmaps/${id}`] });
      refetchReviews();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message === 'Unauthorized' ? 'Please login to submit a review' : 'Failed to submit review',
        variant: 'destructive',
      });
    },
  });

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }
    submitReviewMutation.mutate();
  };

  const toggleNodeCompletion = (nodeId: string) => {
    setCompletedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const progress = roadmap ? (completedSteps.size / roadmap.steps.length) * 100 : 0;

  const downloadFlowchart = async () => {
    if (!flowchartRef.current) return;

    try {
      const dataUrl = await toPng(flowchartRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${roadmap?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flowchart.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Roadmap not found</h2>
          <p className="text-muted-foreground mb-6">The roadmap you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/roadmaps')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmaps
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/roadmaps')}
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roadmaps
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                {/* Featured Image */}
                {roadmap.image ? (
                  <div className="w-full h-48 mb-6">
                    <img 
                      src={roadmap.image} 
                      alt={roadmap.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center">
                    <Target className="h-16 w-16 text-primary" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="secondary" 
                    className={getDifficultyColor(roadmap.difficulty)}
                    data-testid="roadmap-difficulty"
                  >
                    {roadmap.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">{roadmap.estimatedTime}</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4" data-testid="roadmap-title">
                  {roadmap.title}
                </h1>

                <p className="text-muted-foreground mb-6" data-testid="roadmap-description">
                  {roadmap.description}
                </p>

                {/* Technologies */}
                {roadmap.technologies && roadmap.technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          data-testid={`technology-${index}`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < (roadmap.rating || 0) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span>{roadmap.rating || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{roadmap.enrolledCount || 0} enrolled</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Progress */}
            {isEnrolled && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completed Steps</span>
                      <span>{completedSteps.size} / {roadmap.steps.length}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>About This Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {roadmap.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Flowchart */}
            {roadmap.flowchartData && roadmap.flowchartData.nodes && roadmap.flowchartData.nodes.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Interactive Learning Flowchart</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFlowchart(!showFlowchart)}
                      data-testid="button-toggle-flowchart"
                    >
                      {showFlowchart ? 'Hide' : 'Show'} Flowchart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      disabled={!showFlowchart}
                      data-testid="button-fullscreen-flowchart"
                    >
                      <Maximize className="mr-2 h-4 w-4" />
                      Fullscreen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadFlowchart}
                      disabled={!showFlowchart}
                      data-testid="button-download-flowchart"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                {showFlowchart && (
                  <CardContent>
                    <div
                      ref={flowchartRef}
                      className="border rounded-lg"
                      style={{ height: '500px', backgroundColor: '#fafafa' }}
                    >
                      <ReactFlow
                        nodes={roadmap.flowchartData.nodes}
                        edges={roadmap.flowchartData.edges || []}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={true}
                        defaultEdgeOptions={{
                          type: 'smoothstep',
                          animated: true,
                          style: { 
                            stroke: '#94a3b8', 
                            strokeWidth: 3,
                            strokeDasharray: '5 5'
                          },
                          markerEnd: {
                            type: 'arrowclosed',
                            color: '#94a3b8',
                          }
                        }}
                      >
                        <Controls showInteractive={false} />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                      </ReactFlow>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click on nodes to access external resources • {roadmap.flowchartData.nodes.length} nodes • {roadmap.flowchartData.edges?.length || 0} connections
                    </p>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Fullscreen Flowchart Modal */}
            {isFullscreen && roadmap.flowchartData && (
              <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur">
                  <h2 className="text-white text-xl font-semibold">{roadmap.title} - Interactive Flowchart</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadFlowchart}
                      data-testid="button-download-fullscreen"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      data-testid="button-close-fullscreen"
                    >
                      <Minimize className="mr-2 h-4 w-4" />
                      Exit Fullscreen
                    </Button>
                  </div>
                </div>
                <div className="flex-1" style={{ backgroundColor: '#fafafa' }}>
                  <ReactFlow
                    nodes={roadmap.flowchartData.nodes}
                    edges={roadmap.flowchartData.edges || []}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    defaultEdgeOptions={{
                      type: 'smoothstep',
                      animated: true,
                      style: { 
                        stroke: '#94a3b8', 
                        strokeWidth: 3,
                        strokeDasharray: '5 5'
                      },
                      markerEnd: {
                        type: 'arrowclosed',
                        color: '#94a3b8',
                      }
                    }}
                  >
                    <Controls showInteractive={false} />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                  </ReactFlow>
                </div>
                <div className="p-4 bg-black/50 backdrop-blur text-white text-center">
                  <p className="text-sm">
                    Click on nodes to access external resources • {roadmap.flowchartData.nodes.length} nodes • {roadmap.flowchartData.edges?.length || 0} connections
                  </p>
                </div>
              </div>
            )}

            {/* Learning Steps */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Learning Path</CardTitle>
                {isEnrolled && !learningMode && (
                  <Button 
                    onClick={() => setLearningMode(true)}
                    variant="outline"
                    size="sm"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Enter Learning Mode
                  </Button>
                )}
                {learningMode && (
                  <Button 
                    onClick={() => setLearningMode(false)}
                    variant="outline"
                    size="sm"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Exit Learning Mode
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {learningMode && isEnrolled ? (
                  // Interactive Learning Mode
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Step {currentStep + 1} of {roadmap.steps.length}
                      </h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentStep(Math.min(roadmap.steps.length - 1, currentStep + 1))}
                          disabled={currentStep === roadmap.steps.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>

                    {roadmap.steps[currentStep] && (
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={completedSteps.has(currentStep)}
                              onCheckedChange={() => toggleStepCompletion(currentStep)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold mb-3">
                                {roadmap.steps[currentStep].title}
                              </h4>
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {roadmap.steps[currentStep].description}
                              </p>

                              {roadmap.steps[currentStep].resources && roadmap.steps[currentStep].resources.length > 0 && (
                                <div className="bg-card p-4 rounded-lg">
                                  <h5 className="font-medium mb-3 flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Learning Resources
                                  </h5>
                                  <ul className="space-y-2">
                                    {roadmap.steps[currentStep].resources.map((resource, resourceIndex) => (
                                      <li key={resourceIndex} className="flex items-center p-2 bg-muted/50 rounded">
                                        <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                                        <span className="text-sm">{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Badge variant={completedSteps.has(currentStep) ? "default" : "secondary"}>
                                    {completedSteps.has(currentStep) ? "Completed" : "In Progress"}
                                  </Badge>
                                </div>

                                {currentStep < roadmap.steps.length - 1 && (
                                  <Button
                                    onClick={() => {
                                      if (!completedSteps.has(currentStep)) {
                                        toggleStepCompletion(currentStep);
                                      }
                                      setCurrentStep(currentStep + 1);
                                    }}
                                  >
                                    Complete & Continue
                                  </Button>
                                )}

                                {currentStep === roadmap.steps.length - 1 && completedSteps.size === roadmap.steps.length && (
                                  <Badge variant="default" className="bg-green-600">
                                    🎉 Roadmap Completed!
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  // Default View
                  <div className="space-y-6">
                    {roadmap.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-4 p-4 border rounded-lg transition-all ${
                          learningMode && index === currentStep ? 'border-primary bg-primary/5' : ''
                        }`}
                        data-testid={`step-${index}`}
                      >
                        {isEnrolled ? (
                          <Checkbox
                            checked={completedSteps.has(index)}
                            onCheckedChange={() => toggleStepCompletion(index)}
                            className="mt-1"
                            data-testid={`step-checkbox-${index}`}
                          />
                        ) : (
                          <Circle className="h-5 w-5 mt-1 text-muted-foreground" />
                        )}

                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">
                            Step {index + 1}: {step.title}
                          </h4>
                          <p className="text-muted-foreground mb-3">
                            {step.description}
                          </p>

                          {step.resources && step.resources.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Resources:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.resources.map((resource, resourceIndex) => (
                                  <li key={resourceIndex} className="flex items-center">
                                    <BookOpen className="h-3 w-3 mr-2" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="pt-6">
                {!isEnrolled ? (
                  <div className="text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Start Your Journey</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enroll in this roadmap to track your progress and access interactive features.
                    </p>
                    <Button 
                      className="w-full mb-3"
                      onClick={() => {
                        setIsEnrolled(true);
                        setLearningMode(true);
                        setCurrentStep(0);
                      }}
                      data-testid="enroll-button"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">You're Enrolled!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Continue your learning journey.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full mb-3"
                      onClick={() => setLearningMode(true)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={async () => {
                      try {
                        // Create comprehensive roadmap content
                        const content = `${roadmap.title}\n${'='.repeat(roadmap.title.length)}\n\n${roadmap.description}\n\nDifficulty: ${roadmap.difficulty}\nEstimated Time: ${roadmap.estimatedTime}\n\nTechnologies:\n${roadmap.technologies?.map(tech => `- ${tech}`).join('\n') || 'None specified'}\n\nLearning Steps:\n${roadmap.steps.map((step, i) => `\n${i + 1}. ${step.title}\n   ${step.description}${step.resources ? `\n   Resources: ${step.resources.join(', ')}` : ''}`).join('\n')}\n\n---\nGenerated from TalentFresh Roadmaps\n${window.location.href}`;

                        // Create different file formats
                        const textBlob = new Blob([content], { type: 'text/plain' });

                        // Enhanced HTML version
                        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${roadmap.title} - TalentFresh Roadmap</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; }
        h2 { color: #1f2937; margin-top: 30px; }
        .step { background: #f9fafb; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
        .badge { background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .difficulty-${roadmap.difficulty} { background: ${roadmap.difficulty === 'beginner' ? '#dcfce7' : roadmap.difficulty === 'intermediate' ? '#fef3c7' : '#fecaca'}; }
    </style>
</head>
<body>
    <h1>${roadmap.title}</h1>
    <p><span class="badge difficulty-${roadmap.difficulty}">${roadmap.difficulty}</span> • ${roadmap.estimatedTime}</p>
    <p>${roadmap.description}</p>

    <h2>Technologies</h2>
    <p>${roadmap.technologies?.map(tech => `<span class="badge">${tech}</span>`).join(' ') || 'None specified'}</p>

    <h2>Learning Path</h2>
    ${roadmap.steps.map((step, i) => `
        <div class="step">
            <h3>Step ${i + 1}: ${step.title}</h3>
            <p>${step.description}</p>
            ${step.resources ? `<p><strong>Resources:</strong> ${step.resources.join(', ')}</p>` : ''}
        </div>
    `).join('')}

    <footer>
        <p>Generated from <a href="${window.location.href}">TalentFresh Roadmaps</a></p>
    </footer>
</body>
</html>`;

                        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

                        // Let user choose format
                        const format = confirm('Download as HTML (OK) or Text (Cancel)?');
                        const blob = format ? htmlBlob : textBlob;
                        const extension = format ? 'html' : 'txt';

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${roadmap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roadmap.${extension}`;
                        a.click();
                        URL.revokeObjectURL(url);

                        // Track download
                        fetch(`/api/roadmaps/${roadmap.id}/download`, { method: 'POST' }).catch(() => {});
                      } catch (error) {
                        console.error('Download failed:', error);
                        alert('Download failed. Please try again.');
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={async () => {
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: roadmap.title,
                            text: `Check out this amazing ${roadmap.difficulty} level roadmap: ${roadmap.description}`,
                            url: window.location.href,
                          });
                        } else {
                          await navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }

                        // Track share
                        fetch(`/api/roadmaps/${roadmap.id}/share`, { method: 'POST' }).catch(() => {});
                      } catch (error) {
                        console.error('Share failed:', error);
                        // Fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Steps</span>
                  <span className="font-medium">{roadmap.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge 
                    variant="secondary" 
                    className={getDifficultyColor(roadmap.difficulty)}
                  >
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{roadmap.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{roadmap.rating || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating and Review Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rate & Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You rated this {userRating} star{userRating !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {userRating > 0 && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write your review (optional)"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleSubmitReview}
                      className="w-full"
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Reviews ({reviews?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {review.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{review.username}</p>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {review.review}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}