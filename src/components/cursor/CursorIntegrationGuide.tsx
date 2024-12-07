import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export function CursorIntegrationGuide() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Cursor.ai Integration Guide</h1>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Best Practices</AlertTitle>
        <AlertDescription>
          Follow these guidelines to get the most out of Cursor.ai in your project.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Initial Setup</TabsTrigger>
          <TabsTrigger value="patterns">Integration Patterns</TabsTrigger>
          <TabsTrigger value="rules">Cursor Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Cursor.ai</CardTitle>
              <CardDescription>Essential steps to integrate Cursor.ai into your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Installation</h3>
                <p className="text-muted-foreground">Install Cursor.ai from the official website and configure your IDE settings.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">2. Project Configuration</h3>
                <p className="text-muted-foreground">Create a .cursorrules file in your project root to define project-specific settings.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">3. API Setup</h3>
                <p className="text-muted-foreground">Configure your API keys and authentication settings for Cursor.ai integration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Integration Patterns</CardTitle>
              <CardDescription>Best practices for using Cursor.ai in your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Code Generation</h3>
                <p className="text-muted-foreground">Learn how to effectively use Cursor.ai for generating boilerplate code and common patterns.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Code Review</h3>
                <p className="text-muted-foreground">Utilize Cursor.ai's code review capabilities to improve code quality.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Refactoring</h3>
                <p className="text-muted-foreground">Best practices for using Cursor.ai in code refactoring tasks.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Cursor Rules Configuration</CardTitle>
              <CardDescription>Customize Cursor.ai behavior for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Rule Types</h3>
                <p className="text-muted-foreground">Understanding different types of rules and their applications.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Custom Rules</h3>
                <p className="text-muted-foreground">Creating and managing project-specific Cursor.ai rules.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Rule Examples</h3>
                <p className="text-muted-foreground">Common rule configurations and their use cases.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}