import { useEffect, useMemo, useState } from 'react';
import type { JsDiagnostic, RplcConfig } from '@/lib/schema';
import { CodePreview } from './CodePreview';
import { DiagnosticsPanel } from './DiagnosticsPanel';

interface PreviewPanelProps {
  config: RplcConfig;
  wasmFunctions: { check_json?: any; compile_cpp?: any };
  wasmInitialized: boolean;
}

export function PreviewPanel({
  config,
  wasmFunctions,
  wasmInitialized,
}: PreviewPanelProps) {
  const [diagnostics, setDiagnostics] = useState<JsDiagnostic[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 防抖生成函数
  const debouncedGenerate = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return (cfg: RplcConfig) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (!wasmFunctions.check_json || !wasmFunctions.compile_cpp) return;

        setIsGenerating(true);
        try {
          // Transform the config to match rplc-wasm schema requirements
          const transformedConfig = {
            ...cfg,
            fields: cfg.fields.map((field) => {
              const transformedField: {
                name: string;
                type: string;
                comment?: string;
                bit_field?: number;
              } = {
                name: field.name,
                type: field.type,
              };

              if (field.comment) {
                transformedField.comment = field.comment;
              }

              if (field.isArray && field.arrayLength) {
                transformedField.type = `${field.type}[${field.arrayLength}]`;
              } else if (field.isBitfield && field.bitfieldLength) {
                const bitLen = parseInt(field.bitfieldLength, 10);
                if (!Number.isNaN(bitLen)) {
                  transformedField.bit_field = bitLen;
                }
              }

              return transformedField;
            }),
          };

          const jsonString = JSON.stringify(transformedConfig);

          // 调用 WASM 验证
          const diags = wasmFunctions.check_json(jsonString);
          setDiagnostics(diags);

          // 检查是否有错误
          const hasErrors = diags.some(
            (d: JsDiagnostic) => d.severity === 'Error',
          );

          if (!hasErrors) {
            // 如果没有错误，生成 C++ 代码
            const code = wasmFunctions.compile_cpp(jsonString);
            setGeneratedCode(code);
          } else {
            // 有错误时清空代码
            setGeneratedCode('');
          }
        } catch (error) {
          console.error('生成失败:', error);
          setDiagnostics([
            {
              severity: 'Error',
              message: `生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
            },
          ]);
          setGeneratedCode('');
        } finally {
          setIsGenerating(false);
        }
      }, 500);
    };
  }, [wasmFunctions]);

  // 监听配置变化，自动触发生成
  useEffect(() => {
    if (wasmInitialized && config) {
      debouncedGenerate(config);
    }
  }, [config, wasmInitialized, debouncedGenerate]);

  const hasErrors = diagnostics.some((d) => d.severity === 'Error');

  return (
    <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem-3rem)] flex flex-col gap-4">
      <DiagnosticsPanel
        diagnostics={diagnostics}
        isLoading={isGenerating}
        wasmInitialized={wasmInitialized}
      />
      <CodePreview
        code={generatedCode}
        hasErrors={hasErrors}
        isLoading={isGenerating}
        wasmInitialized={wasmInitialized}
        packetName={config.packet_name}
      />
    </div>
  );
}
