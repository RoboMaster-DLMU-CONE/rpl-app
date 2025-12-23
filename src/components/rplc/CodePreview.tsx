import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeHighlight } from '@/components/ui/code-highlight';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodePreviewProps {
  code: string;
  hasErrors: boolean;
  isLoading?: boolean;
  packetName: string;
}

export function CodePreview({
  code,
  hasErrors,
  isLoading,
  packetName,
}: CodePreviewProps) {
  const handleDownload = () => {
    if (!code) return;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${packetName}.hpp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>C++ 代码预览</CardTitle>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {code && !hasErrors && (
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {code && !hasErrors ? (
            <div className="border rounded-md overflow-hidden">
              <CodeHighlight code={code} lang="cpp" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border border-dashed rounded-md">
              {hasErrors
                ? '请修复错误后查看代码'
                : isLoading
                  ? '正在生成...'
                  : '等待生成代码...'}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
