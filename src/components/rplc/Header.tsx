import { AuroraText } from '@/components/ui/aurora-text';
import { useTheme } from '@/components/theme-provider';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';

export function Header() {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[1800px] mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2 group" href="/">
            <img src="/favicon.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-2xl tracking-tight pt-1">
              RPLC{' '}
              <AuroraText
                className="font-bold text-2xl tracking-tight"
                colors={['#FF0080', '#7928CA', '#0070F3', '#38bdf8']}
                speed={4}
              >
                UI
              </AuroraText>
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <nav className="flex items-center space-x-2">
            <ThemeToggleButton
              theme={actualTheme}
              variant="circle-blur"
              start="top-right"
              onClick={toggleTheme}
              className="transition-colors hover:bg-accent/50"
            />
          </nav>
        </div>
      </div>
    </header>
  );
}
