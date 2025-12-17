import { useState } from 'react';
import { Header } from '@/components/rplc/Header';
import { ConfigForm } from '@/components/rplc/ConfigForm';
import { PreviewPanel } from '@/components/rplc/PreviewPanel';
import { defaultValues, RplcConfig } from '@/lib/schema';
import { ThemeProvider } from '@/components/theme-provider';

const App = () => {
  const [config, setConfig] = useState<RplcConfig>(defaultValues);

  return (
    <ThemeProvider defaultTheme="system" storageKey="rplc-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 gap-6 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-3.5rem)]">
          <div className="h-full overflow-y-auto pr-2 lg:col-span-5 xl:col-span-4">
            <ConfigForm onConfigChange={setConfig} />
          </div>
          <div className="h-full lg:sticky lg:top-8 lg:col-span-7 xl:col-span-8 lg:order-last">
            <PreviewPanel config={config} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
