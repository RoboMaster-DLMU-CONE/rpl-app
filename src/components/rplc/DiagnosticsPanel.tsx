import { Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JsDiagnostic } from '@/lib/schema';

interface DiagnosticsPanelProps {
  diagnostics: JsDiagnostic[];
  isLoading?: boolean;
  wasmInitialized: boolean;
}

export function DiagnosticsPanel({
  diagnostics,
  isLoading,
  wasmInitialized,
}: DiagnosticsPanelProps) {
  const errors = diagnostics.filter((d) => d.severity === 'Error');
  const warnings = diagnostics.filter((d) => d.severity === 'Warning');

  return (
    <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            诊断信息
          </CardTitle>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-48">
          {!wasmInitialized ? (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">正在初始化 WASM 模块...</span>
            </div>
          ) : diagnostics.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2">
              暂无诊断信息
            </div>
          ) : (
            <div className="space-y-3">
              {/* 错误信息 */}
              {errors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">错误</Badge>
                    <span className="text-sm text-muted-foreground">
                      {errors.length} 个
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-destructive list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={`error-${index}`}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 警告信息（可折叠） */}
              {warnings.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="warnings" className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20"
                        >
                          警告
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {warnings.length} 个
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1 text-sm text-yellow-600 dark:text-yellow-500 list-disc pl-5 pt-2">
                        {warnings.map((warning, index) => (
                          <li key={`warning-${index}`}>{warning.message}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
