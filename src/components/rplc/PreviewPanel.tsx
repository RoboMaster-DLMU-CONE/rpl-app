import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RplcConfig } from "@/lib/schema";

interface PreviewPanelProps {
  config: RplcConfig;
}

export function PreviewPanel({ config }: PreviewPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1 flex flex-col overflow-hidden py-0 gap-0">
        <CardContent className="p-0 flex-1 overflow-hidden">
          <Tabs defaultValue="json" className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
              <span className="text-sm font-medium">实时预览</span>
              <TabsList className="h-8">
                <TabsTrigger value="json" className="text-xs h-7">JSON 配置</TabsTrigger>
                <TabsTrigger value="cpp" className="text-xs h-7">C++ 头文件</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="json" className="flex-1 p-0 m-0 relative">
              <ScrollArea className="h-full">
                <pre className="p-4 text-xs font-mono">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="cpp" className="flex-1 p-0 m-0 relative">
              <ScrollArea className="h-full">
                <div className="p-4 text-xs font-mono text-muted-foreground">
                  // C++ 生成功能稍后将通过 WASM 实现。
                  <br />
                  // 当前配置: {config.packet_name}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
