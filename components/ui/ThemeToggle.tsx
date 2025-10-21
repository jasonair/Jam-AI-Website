'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Light mode' },
    { name: 'dark', icon: Moon, label: 'Dark mode' },
    { name: 'system', icon: Monitor, label: 'System' },
  ] as const;

  const currentIndex = themes.findIndex(t => t.name === theme);

  const cycleTheme = () => {
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  const CurrentIcon = themes[currentIndex].icon;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Current: ${themes[currentIndex].label}. Click to cycle themes.`}
    >
      <CurrentIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}
