import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { AnimatedFormLabel } from './AnimatedFormLabel';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MagicCard } from '@/components/ui/magic-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  configSchema,
  cppTypes,
  defaultValues,
  type RplcConfig,
} from '@/lib/schema';

interface ConfigFormProps {
  onConfigChange: (config: RplcConfig) => void;
}

export function ConfigForm({ onConfigChange }: ConfigFormProps) {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  const form = useForm<RplcConfig>({
    resolver: zodResolver(configSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  // Detect actual theme (resolve 'system' to actual dark/light)
  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  // Watch all fields to update preview
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        onConfigChange(value as RplcConfig);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onConfigChange]);

  // MagicCard configuration based on theme
  const magicCardConfig = isDark
    ? {
        gradientColor: '#404040',
        gradientOpacity: 0.5,
      }
    : {
        gradientColor: '#f5f5f5',
        gradientOpacity: 0.5,
      };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Basic Info */}
        <MagicCard
          className="border-border/50 shadow-sm transition-shadow hover:shadow-md rounded-xl"
          gradientSize={200}
          gradientColor={magicCardConfig.gradientColor}
          gradientOpacity={magicCardConfig.gradientOpacity}
          gradientFrom="#9E7AFF"
          gradientTo="#FE8BBB"
        >
          <Card className="border-0 shadow-none bg-transparent rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packet_name"
                  render={({ field }) => (
                    <FormItem>
                      <AnimatedFormLabel>
                        数据包名称 (Packet Name)
                      </AnimatedFormLabel>
                      <FormControl>
                        <Input placeholder="SensorData" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="command_id"
                  render={({ field }) => (
                    <FormItem>
                      <AnimatedFormLabel>命令 ID (Command ID)</AnimatedFormLabel>
                      <FormControl>
                        <Input placeholder="0x0104" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="namespace"
                render={({ field }) => (
                  <FormItem>
                    <AnimatedFormLabel>
                      命名空间 (Namespace) - 可选
                    </AnimatedFormLabel>
                    <FormControl>
                      <Input
                        placeholder="Robot::Sensors"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="header_guard"
                render={({ field }) => (
                  <FormItem>
                    <AnimatedFormLabel>
                      头文件保护 (Header Guard) - 可选
                    </AnimatedFormLabel>
                    <FormControl>
                      <Input
                        placeholder="留空自动生成，如: RPL_SENSORDATA_HPP"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormDescription>
                      如果留空，将根据数据包名称自动生成
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </MagicCard>

        {/* Advanced Settings */}
        <MagicCard
          className="border-border/50 shadow-sm transition-shadow hover:shadow-md rounded-xl"
          gradientSize={200}
          gradientColor={magicCardConfig.gradientColor}
          gradientOpacity={magicCardConfig.gradientOpacity}
          gradientFrom="#9E7AFF"
          gradientTo="#FE8BBB"
        >
          <Card className="border-0 shadow-none bg-transparent rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                高级设置
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="packed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <AnimatedFormLabel>紧凑结构 (Packed)</AnimatedFormLabel>
                      <FormDescription>
                        添加 __attribute__((packed)) 属性
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </MagicCard>

        {/* Fields */}
        <MagicCard
          className="border-border/50 shadow-sm transition-shadow hover:shadow-md rounded-xl"
          gradientSize={200}
          gradientColor={magicCardConfig.gradientColor}
          gradientOpacity={magicCardConfig.gradientOpacity}
          gradientFrom="#9E7AFF"
          gradientTo="#FE8BBB"
        >
          <Card className="border-0 shadow-none bg-transparent rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                字段定义
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ name: 'new_field', type: 'uint8_t', comment: '' })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                添加字段
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 border rounded-md bg-muted/20"
                >
                  <div className="grid gap-3 flex-1 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <AnimatedFormLabel className="text-xs">
                            名称
                          </AnimatedFormLabel>
                          <FormControl>
                            <Input {...field} className="h-8" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <AnimatedFormLabel className="text-xs">
                            类型
                          </AnimatedFormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 w-full min-w-[120px]">
                                <SelectValue placeholder="选择类型" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cppTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.comment`}
                      render={({ field }) => (
                        <FormItem>
                          <AnimatedFormLabel className="text-xs">
                            注释
                          </AnimatedFormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-8"
                              placeholder="描述"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无字段定义。请点击上方按钮添加。
                </div>
              )}
            </CardContent>
          </Card>
        </MagicCard>
      </form>
    </Form>
  );
}
