'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return (
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800" disabled>
        <Monitor className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    );
  }

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

  // Handle case where theme is not yet available or invalid
  const currentTheme = themes[currentIndex];
  const CurrentIcon = currentTheme ? currentTheme.icon : Monitor;
  const currentLabel = currentTheme ? currentTheme.label : 'System';

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Current: ${currentLabel}. Click to cycle themes.`}
    >
      <CurrentIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}
