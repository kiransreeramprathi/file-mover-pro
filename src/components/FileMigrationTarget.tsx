import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Server, Play, AlertTriangle } from 'lucide-react';

interface FileMigrationTargetProps {
  selectedFiles: string[];
  selectedObject: string;
  onMigrationStart: () => void;
}

// Mock destination organizations
const destinationOrgs = [
  { 
    id: 'prod-org-1', 
    name: 'Production Org', 
    url: 'company.salesforce.com',
    status: 'active',
    type: 'Production'
  },
  { 
    id: 'sandbox-org-1', 
    name: 'Development Sandbox', 
    url: 'company--dev.sandbox.salesforce.com',
    status: 'active',
    type: 'Sandbox'
  },
  { 
    id: 'sandbox-org-2', 
    name: 'UAT Sandbox', 
    url: 'company--uat.sandbox.salesforce.com',
    status: 'active',
    type: 'Sandbox'
  },
  { 
    id: 'sandbox-org-3', 
    name: 'QA Sandbox', 
    url: 'company--qa.sandbox.salesforce.com',
    status: 'maintenance',
    type: 'Sandbox'
  },
];

export const FileMigrationTarget = ({ 
  selectedFiles, 
  selectedObject, 
  onMigrationStart 
}: FileMigrationTargetProps) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartMigration = async () => {
    if (!selectedOrg) return;
    
    setIsStarting(true);
    // Simulate migration start delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsStarting(false);
    
    onMigrationStart();
  };

  const selectedOrgData = destinationOrgs.find(org => org.id === selectedOrg);

  const getOrgStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'maintenance': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOrgTypeColor = (type: string) => {
    switch (type) {
      case 'Production': return 'bg-red-100 text-red-800';
      case 'Sandbox': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Migration Target
        </CardTitle>
        <CardDescription>
          Select the destination organization and start the file migration process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Migration Summary */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h4 className="font-medium text-sm mb-3">Migration Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Source Object:</span>
              <p className="font-medium">{selectedObject}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Files to Migrate:</span>
              <p className="font-medium">{selectedFiles.length} files</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Destination Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Organization</label>
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger>
              <SelectValue placeholder="Choose destination org..." />
            </SelectTrigger>
            <SelectContent>
              {destinationOrgs.map((org) => (
                <SelectItem 
                  key={org.id} 
                  value={org.id}
                  disabled={org.status !== 'active'}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <Server className="h-3 w-3" />
                        <span className="font-medium">{org.name}</span>
                        <Badge variant="outline" className={getOrgTypeColor(org.type)}>
                          {org.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{org.url}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getOrgStatusColor(org.status)} ml-2`}
                    >
                      {org.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Org Details */}
        {selectedOrgData && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="font-medium text-sm mb-3">Destination Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Organization:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedOrgData.name}</span>
                  <Badge variant="outline" className={getOrgTypeColor(selectedOrgData.type)}>
                    {selectedOrgData.type}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-mono text-xs">{selectedOrgData.url}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge 
                  variant="outline" 
                  className={getOrgStatusColor(selectedOrgData.status)}
                >
                  {selectedOrgData.status}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Warning for Production */}
        {selectedOrgData?.type === 'Production' && (
          <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
            <div className="flex items-center gap-2 text-warning mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">Production Environment Warning</span>
            </div>
            <p className="text-sm text-warning/80">
              You are about to migrate files to a production environment. Please ensure you have proper approval and backup procedures in place.
            </p>
          </div>
        )}

        {/* Migration Button */}
        <Button 
          onClick={handleStartMigration}
          disabled={!selectedOrg || selectedOrgData?.status !== 'active' || isStarting}
          className="w-full"
          size="lg"
        >
          <Play className="mr-2 h-4 w-4" />
          {isStarting ? 'Starting Migration...' : 'Start Migration'}
        </Button>

        {/* Connection Info */}
        <div className="text-xs text-muted-foreground text-center">
          <p>Migration will use JWT-based authentication via Named Credentials</p>
          <p>All file transfers are encrypted and logged for audit purposes</p>
        </div>
      </CardContent>
    </Card>
  );
};