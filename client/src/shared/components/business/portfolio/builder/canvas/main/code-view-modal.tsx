import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeViewModalProps {
  open: boolean;
  onClose: () => void;
  portfolioData: any;
  templateId: string;
}

export function CodeViewModal({ open, onClose, portfolioData, templateId }: CodeViewModalProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string>('package.json');
  const { toast } = useToast();

  const { data: codeData, isLoading } = useQuery({
    queryKey: ['/api/portfolio/code-view', templateId, portfolioData],
    queryFn: async () => {
      const response = await fetch('/api/portfolio/code-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ portfolioData, templateId }),
      });
      if (!response.ok) throw new Error('Failed to load code view');
      return response.json();
    },
    enabled: open,
  });

  const { data: downloadData, isLoading: isDownloading, refetch: downloadCode } = useQuery({
    queryKey: ['/api/portfolio/generate-code', templateId, portfolioData],
    queryFn: async () => {
      const response = await fetch('/api/portfolio/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ portfolioData, templateId }),
      });
      if (!response.ok) throw new Error('Failed to generate download');
      return response.json();
    },
    enabled: false,
  });

  const handleCopyCode = async (fileName: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    toast({
      title: 'Copied!',
      description: `${fileName} copied to clipboard`,
    });
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = async () => {
    const result = await downloadCode();
    if (result.data?.downloadUrl) {
      window.location.href = result.data.downloadUrl;
      toast({
        title: 'Download Started',
        description: 'Your portfolio code is being downloaded',
      });
    }
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const fileStructure = codeData?.structure || {};
  const folders = codeData?.folders || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Portfolio Code Structure
            </DialogTitle>
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading}
              data-testid="button-download-code"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Generating...' : 'Download ZIP'}
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 h-[600px]">
            {/* File Tree */}
            <div className="col-span-1 border rounded-lg p-4">
              <h3 className="font-semibold mb-3">File Structure</h3>
              <ScrollArea className="h-[520px]">
                <div className="space-y-1">
                  {/* Root files */}
                  {Object.keys(fileStructure)
                    .filter(file => !file.includes('/'))
                    .map(file => (
                      <button
                        key={file}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded hover-elevate active-elevate-2 ${
                          selectedFile === file ? 'bg-accent' : ''
                        }`}
                        data-testid={`file-tree-${file}`}
                      >
                        <File className="h-4 w-4" />
                        <span className="text-sm">{file}</span>
                      </button>
                    ))}

                  {/* Folders */}
                  {folders.map(folder => {
                    const isExpanded = expandedFolders.has(folder);
                    const filesInFolder = Object.keys(fileStructure)
                      .filter(file => file.startsWith(folder) && file !== folder);

                    return (
                      <div key={folder}>
                        <button
                          onClick={() => toggleFolder(folder)}
                          className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover-elevate active-elevate-2"
                          data-testid={`folder-${folder}`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <Folder className="h-4 w-4" />
                          <span className="text-sm font-medium">{folder}</span>
                        </button>

                        {isExpanded && filesInFolder.length > 0 && (
                          <div className="ml-6 space-y-1 mt-1">
                            {filesInFolder.map(file => (
                              <button
                                key={file}
                                onClick={() => setSelectedFile(file)}
                                className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded hover-elevate active-elevate-2 ${
                                  selectedFile === file ? 'bg-accent' : ''
                                }`}
                                data-testid={`file-tree-${file}`}
                              >
                                <File className="h-4 w-4" />
                                <span className="text-sm">{file.replace(folder, '')}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Code Viewer */}
            <div className="col-span-2 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <h3 className="font-semibold">{selectedFile}</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCode(selectedFile, fileStructure[selectedFile])}
                  data-testid="button-copy-code"
                >
                  {copiedFile === selectedFile ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <ScrollArea className="h-[520px]">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{fileStructure[selectedFile] || '// File content not available'}</code>
                </pre>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
