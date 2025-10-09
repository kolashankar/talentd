import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Save, X, Wand2, Loader2 } from "lucide-react";
import { AiGenerator } from "@/components/admin/ai-generator";

interface DsaTopic {
  id: number;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problemCount?: number;
  isPublished: boolean;
  createdAt: string;
}

interface DsaCompany {
  id: number;
  name: string;
  logo?: string;
  problemCount?: number;
  isPublished: boolean;
  createdAt: string;
}

interface DsaSheet {
  id: number;
  name: string;
  description?: string;
  creator: string;
  type: 'official' | 'public' | 'community';
  problemCount?: number;
  followerCount?: number;
  isPublished: boolean;
  createdAt: string;
}

interface DsaProblem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solution?: string;
  hints?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  tags?: string[];
  companies?: string[];
  topicId?: number;
  companyId?: number;
  leetcodeUrl?: string;
  status?: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminDSA() {
  const [activeTab, setActiveTab] = useState("problems");
  const [editingTopic, setEditingTopic] = useState<DsaTopic | null>(null);
  const [editingCompany, setEditingCompany] = useState<DsaCompany | null>(null);
  const [editingSheet, setEditingSheet] = useState<DsaSheet | null>(null);
  const [editingProblem, setEditingProblem] = useState<DsaProblem | null>(null);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const { toast } = useToast();

  const handleAiContentGenerated = (content: any) => {
    // Map AI generated content to the appropriate form based on active tab
    switch (activeTab) {
      case 'problems':
        setEditingProblem({
          id: 0,
          title: content.title || '',
          description: content.description || '',
          difficulty: content.difficulty || 'easy',
          category: content.category || '',
          solution: content.solution || '',
          hints: content.hints || [],
          timeComplexity: content.timeComplexity || '',
          spaceComplexity: content.spaceComplexity || '',
          tags: content.tags || [],
          companies: content.companies || [],
          leetcodeUrl: content.leetcodeUrl || '',
          status: 'unsolved',
          isPublished: true,
          createdAt: new Date().toISOString(),
        });
        break;
      case 'topics':
        setEditingTopic({
          id: 0,
          name: content.name || content.title || '',
          description: content.description || '',
          difficulty: content.difficulty || 'beginner',
          problemCount: content.problemCount || 0,
          isPublished: true,
          createdAt: new Date().toISOString(),
        });
        break;
      case 'companies':
        setEditingCompany({
          id: 0,
          name: content.name || content.title || '',
          logo: content.logo || content.companyLogo || '',
          problemCount: content.problemCount || 0,
          isPublished: true,
          createdAt: new Date().toISOString(),
        });
        break;
      case 'sheets':
        setEditingSheet({
          id: 0,
          name: content.name || content.title || '',
          description: content.description || '',
          creator: content.creator || 'AI Generated',
          type: content.type || 'public',
          problemCount: content.problemCount || 0,
          followerCount: 0,
          isPublished: true,
          createdAt: new Date().toISOString(),
        });
        break;
    }
    setShowAiGenerator(false);
  };

  // Queries
  const { data: topics = [] } = useQuery<DsaTopic[]>({ queryKey: ['/api/dsa-topics'] });
  const { data: companies = [] } = useQuery<DsaCompany[]>({ queryKey: ['/api/dsa-companies'] });
  const { data: sheets = [] } = useQuery<DsaSheet[]>({ queryKey: ['/api/dsa-sheets'] });
  const { data: problems = [] } = useQuery<DsaProblem[]>({ queryKey: ['/api/dsa-problems'] });

  // Problem Mutations
  const createProblemMutation = useMutation({
    mutationFn: async (data: Partial<DsaProblem>) => {
      const response = await fetch('/api/dsa-problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create problem');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-problems'] });
      setEditingProblem(null);
      toast({ title: "Success", description: "Problem created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create problem", variant: "destructive" });
    },
  });

  const updateProblemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DsaProblem> }) => {
      const response = await fetch(`/api/dsa-problems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update problem');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-problems'] });
      setEditingProblem(null);
      toast({ title: "Success", description: "Problem updated successfully" });
    },
  });

  const deleteProblemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/dsa-problems/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete problem');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-problems'] });
      toast({ title: "Success", description: "Problem deleted successfully" });
    },
  });

  // Topic Mutations
  const createTopicMutation = useMutation({
    mutationFn: async (data: Partial<DsaTopic>) => {
      const response = await fetch('/api/dsa-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create topic');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-topics'] });
      setEditingTopic(null);
      toast({ title: "Success", description: "Topic created successfully" });
    },
  });

  const updateTopicMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DsaTopic> }) => {
      const response = await fetch(`/api/dsa-topics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update topic');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-topics'] });
      setEditingTopic(null);
      toast({ title: "Success", description: "Topic updated successfully" });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/dsa-topics/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete topic');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-topics'] });
      toast({ title: "Success", description: "Topic deleted successfully" });
    },
  });

  // Company Mutations
  const createCompanyMutation = useMutation({
    mutationFn: async (data: Partial<DsaCompany>) => {
      const response = await fetch('/api/dsa-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create company');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-companies'] });
      setEditingCompany(null);
      toast({ title: "Success", description: "Company created successfully" });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DsaCompany> }) => {
      const response = await fetch(`/api/dsa-companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update company');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-companies'] });
      setEditingCompany(null);
      toast({ title: "Success", description: "Company updated successfully" });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/dsa-companies/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete company');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-companies'] });
      toast({ title: "Success", description: "Company deleted successfully" });
    },
  });

  // Sheet Mutations
  const createSheetMutation = useMutation({
    mutationFn: async (data: Partial<DsaSheet>) => {
      const response = await fetch('/api/dsa-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create sheet');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-sheets'] });
      setEditingSheet(null);
      toast({ title: "Success", description: "Sheet created successfully" });
    },
  });

  const updateSheetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DsaSheet> }) => {
      const response = await fetch(`/api/dsa-sheets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update sheet');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-sheets'] });
      setEditingSheet(null);
      toast({ title: "Success", description: "Sheet updated successfully" });
    },
  });

  const deleteSheetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/dsa-sheets/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete sheet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dsa-sheets'] });
      toast({ title: "Success", description: "Sheet deleted successfully" });
    },
  });

  const handleProblemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const tagsStr = formData.get('tags') as string;
    const hintsStr = formData.get('hints') as string;
    
    // Get selected topic IDs
    const topicIds = Array.from(formData.getAll('topicIds')).map(id => parseInt(id as string));
    
    // Get selected company IDs
    const companyIds = Array.from(formData.getAll('companyIds')).map(id => parseInt(id as string));
    
    // Get selected sheet IDs
    const sheetIds = Array.from(formData.getAll('sheetIds')).map(id => parseInt(id as string));
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      difficulty: formData.get('difficulty') as 'easy' | 'medium' | 'hard',
      category: formData.get('category') as string,
      solution: formData.get('solution') as string || undefined,
      hints: hintsStr ? hintsStr.split(',').map(h => h.trim()) : [],
      timeComplexity: formData.get('timeComplexity') as string || undefined,
      spaceComplexity: formData.get('spaceComplexity') as string || undefined,
      tags: tagsStr ? tagsStr.split(',').map(t => t.trim()) : [],
      topicIds,
      companyIds,
      sheetIds,
      leetcodeUrl: formData.get('leetcodeUrl') as string || undefined,
      isPublished: formData.get('isPublished') === 'true',
    };

    if (editingProblem?.id) {
      updateProblemMutation.mutate({ id: editingProblem.id, data });
    } else {
      createProblemMutation.mutate(data);
    }
  };

  const handleTopicSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced',
      problemCount: parseInt(formData.get('problemCount') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
    };

    if (editingTopic?.id) {
      updateTopicMutation.mutate({ id: editingTopic.id, data });
    } else {
      createTopicMutation.mutate(data);
    }
  };

  const handleCompanySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      logo: formData.get('logo') as string || undefined,
      problemCount: parseInt(formData.get('problemCount') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
    };

    if (editingCompany?.id) {
      updateCompanyMutation.mutate({ id: editingCompany.id, data });
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  const handleSheetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      creator: formData.get('creator') as string,
      type: formData.get('type') as 'official' | 'public' | 'community',
      problemCount: parseInt(formData.get('problemCount') as string) || 0,
      followerCount: parseInt(formData.get('followerCount') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
    };

    if (editingSheet?.id) {
      updateSheetMutation.mutate({ id: editingSheet.id, data });
    } else {
      createSheetMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">DSA Management</h1>
          <Button onClick={() => setShowAiGenerator(!showAiGenerator)} className="gap-2">
            <Wand2 className="h-4 w-4" />
            {showAiGenerator ? 'Hide AI Generator' : 'AI Generator'}
          </Button>
        </div>

        {showAiGenerator && (
          <div className="mb-6">
            <AiGenerator 
              onContentGenerated={handleAiContentGenerated}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="problems">Problems ({problems.length})</TabsTrigger>
            <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
            <TabsTrigger value="sheets">Sheets ({sheets.length})</TabsTrigger>
          </TabsList>

          {/* Problems Tab */}
          <TabsContent value="problems" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>{editingProblem?.id ? 'Edit Problem' : 'Create Problem'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProblemSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="problem-title">Title *</Label>
                      <Input id="problem-title" name="title" defaultValue={editingProblem?.title || ''} required />
                    </div>
                    <div>
                      <Label htmlFor="problem-description">Description *</Label>
                      <Textarea id="problem-description" name="description" defaultValue={editingProblem?.description || ''} required rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="problem-difficulty">Difficulty *</Label>
                        <Select name="difficulty" defaultValue={editingProblem?.difficulty || 'easy'}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="problem-category">Category *</Label>
                        <Input id="problem-category" name="category" defaultValue={editingProblem?.category || ''} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="problem-solution">Solution</Label>
                      <Textarea id="problem-solution" name="solution" defaultValue={editingProblem?.solution || ''} rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="problem-hints">Hints (comma-separated)</Label>
                      <Input id="problem-hints" name="hints" defaultValue={editingProblem?.hints?.join(', ') || ''} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="problem-time">Time Complexity</Label>
                        <Input id="problem-time" name="timeComplexity" defaultValue={editingProblem?.timeComplexity || ''} placeholder="O(n)" />
                      </div>
                      <div>
                        <Label htmlFor="problem-space">Space Complexity</Label>
                        <Input id="problem-space" name="spaceComplexity" defaultValue={editingProblem?.spaceComplexity || ''} placeholder="O(1)" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="problem-tags">Tags (comma-separated)</Label>
                      <Input id="problem-tags" name="tags" defaultValue={editingProblem?.tags?.join(', ') || ''} placeholder="array, sorting" />
                    </div>
                    <div>
                      <Label htmlFor="problem-companies">Companies (comma-separated)</Label>
                      <Input id="problem-companies" name="companies" defaultValue={editingProblem?.companies?.join(', ') || ''} placeholder="Google, Amazon" />
                    </div>
                    <div>
                      <Label>Topics (Select Multiple)</Label>
                      <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                        {topics.map((topic) => (
                          <div key={topic.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`topic-${topic.id}`}
                              name="topicIds"
                              value={topic.id}
                              defaultChecked={editingProblem?.topicIds?.includes(topic.id)}
                              className="rounded"
                            />
                            <label htmlFor={`topic-${topic.id}`} className="text-sm">{topic.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Companies (Select Multiple)</Label>
                      <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                        {companies.map((company) => (
                          <div key={company.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`company-${company.id}`}
                              name="companyIds"
                              value={company.id}
                              defaultChecked={editingProblem?.companyIds?.includes(company.id)}
                              className="rounded"
                            />
                            <label htmlFor={`company-${company.id}`} className="text-sm">{company.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Sheets (Select Multiple)</Label>
                      <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                        {sheets.map((sheet) => (
                          <div key={sheet.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`sheet-${sheet.id}`}
                              name="sheetIds"
                              value={sheet.id}
                              defaultChecked={editingProblem?.sheetIds?.includes(sheet.id)}
                              className="rounded"
                            />
                            <label htmlFor={`sheet-${sheet.id}`} className="text-sm">{sheet.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="problem-leetcode">LeetCode URL</Label>
                      <Input id="problem-leetcode" name="leetcodeUrl" defaultValue={editingProblem?.leetcodeUrl || ''} placeholder="https://leetcode.com/problems/..." />
                    </div>
                    <div>
                      <Label htmlFor="problem-isPublished">Published</Label>
                      <Select name="isPublished" defaultValue={editingProblem?.isPublished ? 'true' : 'true'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingProblem?.id ? 'Update' : 'Create'}
                      </Button>
                      {editingProblem && (
                        <Button type="button" variant="outline" onClick={() => setEditingProblem(null)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Problems List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[800px] overflow-y-auto">
                    {problems.map((problem) => (
                      <div key={problem.id} className="flex items-start justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="font-semibold">{problem.title}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={problem.difficulty === 'easy' ? 'default' : problem.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline">{problem.category}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProblem(problem)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProblemMutation.mutate(problem.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingTopic?.id ? 'Edit Topic' : 'Create Topic'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTopicSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="topic-name">Name *</Label>
                      <Input id="topic-name" name="name" defaultValue={editingTopic?.name || ''} required />
                    </div>
                    <div>
                      <Label htmlFor="topic-description">Description</Label>
                      <Textarea id="topic-description" name="description" defaultValue={editingTopic?.description || ''} />
                    </div>
                    <div>
                      <Label htmlFor="topic-difficulty">Difficulty *</Label>
                      <Select name="difficulty" defaultValue={editingTopic?.difficulty || 'beginner'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="topic-problemCount">Problem Count</Label>
                      <Input id="topic-problemCount" name="problemCount" type="number" defaultValue={editingTopic?.problemCount || 0} />
                    </div>
                    <div>
                      <Label htmlFor="topic-isPublished">Published</Label>
                      <Select name="isPublished" defaultValue={editingTopic?.isPublished ? 'true' : 'true'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingTopic?.id ? 'Update' : 'Create'}
                      </Button>
                      {editingTopic && (
                        <Button type="button" variant="outline" onClick={() => setEditingTopic(null)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topics List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-semibold">{topic.name}</div>
                          <Badge variant="outline">{topic.difficulty}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingTopic(topic)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTopicMutation.mutate(topic.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingCompany?.id ? 'Edit Company' : 'Create Company'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Name *</Label>
                      <Input id="company-name" name="name" defaultValue={editingCompany?.name || ''} required />
                    </div>
                    <div>
                      <Label htmlFor="company-logo">Logo URL</Label>
                      <Input id="company-logo" name="logo" defaultValue={editingCompany?.logo || ''} />
                    </div>
                    <div>
                      <Label htmlFor="company-problemCount">Problem Count</Label>
                      <Input id="company-problemCount" name="problemCount" type="number" defaultValue={editingCompany?.problemCount || 0} />
                    </div>
                    <div>
                      <Label htmlFor="company-isPublished">Published</Label>
                      <Select name="isPublished" defaultValue={editingCompany?.isPublished ? 'true' : 'true'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingCompany?.id ? 'Update' : 'Create'}
                      </Button>
                      {editingCompany && (
                        <Button type="button" variant="outline" onClick={() => setEditingCompany(null)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Companies List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="font-semibold">{company.name}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingCompany(company)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteCompanyMutation.mutate(company.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sheets Tab */}
          <TabsContent value="sheets" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingSheet?.id ? 'Edit Sheet' : 'Create Sheet'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSheetSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="sheet-name">Name *</Label>
                      <Input id="sheet-name" name="name" defaultValue={editingSheet?.name || ''} required />
                    </div>
                    <div>
                      <Label htmlFor="sheet-description">Description</Label>
                      <Textarea id="sheet-description" name="description" defaultValue={editingSheet?.description || ''} />
                    </div>
                    <div>
                      <Label htmlFor="sheet-creator">Creator *</Label>
                      <Input id="sheet-creator" name="creator" defaultValue={editingSheet?.creator || ''} required />
                    </div>
                    <div>
                      <Label htmlFor="sheet-type">Type</Label>
                      <Select name="type" defaultValue={editingSheet?.type || 'public'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="official">Official</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sheet-problemCount">Problem Count</Label>
                      <Input id="sheet-problemCount" name="problemCount" type="number" defaultValue={editingSheet?.problemCount || 0} />
                    </div>
                    <div>
                      <Label htmlFor="sheet-followerCount">Follower Count</Label>
                      <Input id="sheet-followerCount" name="followerCount" type="number" defaultValue={editingSheet?.followerCount || 0} />
                    </div>
                    <div>
                      <Label htmlFor="sheet-isPublished">Published</Label>
                      <Select name="isPublished" defaultValue={editingSheet?.isPublished ? 'true' : 'true'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingSheet?.id ? 'Update' : 'Create'}
                      </Button>
                      {editingSheet && (
                        <Button type="button" variant="outline" onClick={() => setEditingSheet(null)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sheets List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sheets.map((sheet) => (
                      <div key={sheet.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-semibold">{sheet.name}</div>
                          <div className="text-sm text-muted-foreground">by {sheet.creator}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingSheet(sheet)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSheetMutation.mutate(sheet.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
