import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ObjectSelector } from './ObjectSelector';
import { RelatedFilesViewer } from './RelatedFilesViewer';
import { FileMigrationTarget } from './FileMigrationTarget';
import { Database, Files, Target, CheckCircle } from 'lucide-react';

export type MigrationStep = 'object' | 'files' | 'migration' | 'complete';

export interface FileRecord {
  id: string;
  name: string;
  size: string;
  lastModified: string;
  type: string;
  owner: string;
}

export const FileMigrationApp = () => {
  const [currentStep, setCurrentStep] = useState<MigrationStep>('object');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [migrationProgress, setMigrationProgress] = useState(0);

  const steps = [
    { key: 'object', label: 'Select Object', icon: Database },
    { key: 'files', label: 'Choose Files', icon: Files },
    { key: 'migration', label: 'Migration Target', icon: Target },
    { key: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const getStepIndex = (step: MigrationStep) => steps.findIndex(s => s.key === step);
  const currentStepIndex = getStepIndex(currentStep);

  const handleObjectSelected = (objectName: string) => {
    setSelectedObject(objectName);
    setCurrentStep('files');
  };

  const handleFilesSelected = (fileIds: string[]) => {
    setSelectedFiles(fileIds);
    if (fileIds.length > 0) {
      setCurrentStep('migration');
    }
  };

  const handleMigrationStart = () => {
    setCurrentStep('complete');
    // Simulate migration progress
    const interval = setInterval(() => {
      setMigrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'object':
        return <ObjectSelector onObjectSelected={handleObjectSelected} />;
      case 'files':
        return (
          <RelatedFilesViewer 
            selectedObject={selectedObject}
            onFilesSelected={handleFilesSelected}
          />
        );
      case 'migration':
        return (
          <FileMigrationTarget 
            selectedFiles={selectedFiles}
            selectedObject={selectedObject}
            onMigrationStart={handleMigrationStart}
          />
        );
      case 'complete':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Migration Complete
              </CardTitle>
              <CardDescription>
                Successfully migrated {selectedFiles.length} files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={migrationProgress} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                All files have been transferred to the destination org successfully.
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">File Migration Pro</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Seamlessly migrate files between Salesforce organizations
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                      ${isCompleted 
                        ? 'bg-success border-success text-success-foreground' 
                        : isCurrent 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'bg-background border-border text-muted-foreground'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <Separator className="mx-8 w-16" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Summary Card */}
        {selectedObject && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Migration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selected Object:</span>
                <span className="font-medium">{selectedObject}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Files Selected:</span>
                <span className="font-medium">{selectedFiles.length}</span>
              </div>
              {currentStep === 'complete' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-success">Complete</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};