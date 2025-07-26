import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Search } from 'lucide-react';

interface ObjectSelectorProps {
  onObjectSelected: (objectName: string) => void;
}

// Mock data for Salesforce objects
const salesforceObjects = [
  { apiName: 'Account', label: 'Account', description: 'Business accounts and organizations' },
  { apiName: 'Contact', label: 'Contact', description: 'Individual people and contacts' },
  { apiName: 'Opportunity', label: 'Opportunity', description: 'Sales opportunities and deals' },
  { apiName: 'Case', label: 'Case', description: 'Customer service cases' },
  { apiName: 'Lead', label: 'Lead', description: 'Potential customers and prospects' },
  { apiName: 'Task', label: 'Task', description: 'Activities and tasks' },
  { apiName: 'Event', label: 'Event', description: 'Calendar events and meetings' },
  { apiName: 'CustomObject__c', label: 'Custom Object', description: 'Custom business objects' },
];

export const ObjectSelector = ({ onObjectSelected }: ObjectSelectorProps) => {
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetFiles = async () => {
    if (!selectedObject) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    onObjectSelected(selectedObject);
  };

  const selectedObjectData = salesforceObjects.find(obj => obj.apiName === selectedObject);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Select Salesforce Object
        </CardTitle>
        <CardDescription>
          Choose the Salesforce object that contains the files you want to migrate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Object Type</label>
          <Select value={selectedObject} onValueChange={setSelectedObject}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Salesforce object..." />
            </SelectTrigger>
            <SelectContent>
              {salesforceObjects.map((object) => (
                <SelectItem key={object.apiName} value={object.apiName}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{object.label}</span>
                    <span className="text-xs text-muted-foreground">{object.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedObjectData && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="font-medium text-sm mb-2">Selected Object Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Name:</span>
                <span className="font-mono">{selectedObjectData.apiName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Label:</span>
                <span>{selectedObjectData.label}</span>
              </div>
              <p className="text-muted-foreground mt-2">{selectedObjectData.description}</p>
            </div>
          </div>
        )}

        <Button 
          onClick={handleGetFiles}
          disabled={!selectedObject || isLoading}
          className="w-full"
          size="lg"
        >
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Loading Files...' : 'Get Related Files'}
        </Button>
      </CardContent>
    </Card>
  );
};