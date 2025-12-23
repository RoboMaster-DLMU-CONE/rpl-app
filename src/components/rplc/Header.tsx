import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[1800px] mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2 group" href="/">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent transition-all group-hover:from-foreground group-hover:to-foreground/60">
              RoboMaster Packet Library Compiler UI
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-colors hover:bg-accent/50"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">切换主题</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className="cursor-pointer"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  浅色
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className="cursor-pointer"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  深色
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className="cursor-pointer"
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  系统
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
