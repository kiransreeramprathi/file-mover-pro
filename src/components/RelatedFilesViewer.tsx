import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Files, ExternalLink, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { FileRecord } from './FileMigrationApp';

interface RelatedFilesViewerProps {
  selectedObject: string;
  onFilesSelected: (fileIds: string[]) => void;
}

// Mock file data
const generateMockFiles = (objectName: string): FileRecord[] => {
  const fileTypes = ['PDF', 'DOCX', 'XLSX', 'PNG', 'JPG', 'TXT'];
  const owners = ['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Lisa Brown', 'David Lee'];
  
  return Array.from({ length: 47 }, (_, i) => ({
    id: `file_${i + 1}`,
    name: `${objectName}_Document_${String(i + 1).padStart(3, '0')}.${fileTypes[i % fileTypes.length].toLowerCase()}`,
    size: `${Math.floor(Math.random() * 5000) + 100} KB`,
    lastModified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    type: fileTypes[i % fileTypes.length],
    owner: owners[i % owners.length],
  }));
};

export const RelatedFilesViewer = ({ selectedObject, onFilesSelected }: RelatedFilesViewerProps) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const filesPerPage = 25;
  const totalPages = Math.ceil(files.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const currentFiles = files.slice(startIndex, endIndex);

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setFiles(generateMockFiles(selectedObject));
      setIsLoading(false);
    };
    
    loadFiles();
  }, [selectedObject]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFileIds(currentFiles.map(file => file.id));
    } else {
      setSelectedFileIds([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFileIds(prev => [...prev, fileId]);
    } else {
      setSelectedFileIds(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleContinue = () => {
    onFilesSelected(selectedFileIds);
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'DOCX': return 'bg-blue-100 text-blue-800';
      case 'XLSX': return 'bg-green-100 text-green-800';
      case 'PNG': case 'JPG': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Files className="h-5 w-5 text-primary animate-pulse" />
            Loading Files...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Files className="h-5 w-5 text-primary" />
          Related Files for {selectedObject}
        </CardTitle>
        <CardDescription>
          Found {files.length} files. Select the files you want to migrate (showing {startIndex + 1}-{Math.min(endIndex, files.length)} of {files.length})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={currentFiles.length > 0 && currentFiles.every(file => selectedFileIds.includes(file.id))}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select all on this page
            </label>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedFileIds.length} files selected
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFileIds.includes(file.id)}
                      onCheckedChange={(checked) => handleSelectFile(file.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-xs">{file.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getFileTypeColor(file.type)}>
                      {file.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.size}</TableCell>
                  <TableCell className="text-muted-foreground">{file.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{file.lastModified}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleContinue}
          disabled={selectedFileIds.length === 0}
          className="w-full"
          size="lg"
        >
          Continue with {selectedFileIds.length} Selected Files
        </Button>
      </CardContent>
    </Card>
  );
};