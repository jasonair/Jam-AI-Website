'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, useAuth } from '@/lib/contexts/AuthContext';
import BetaGate from '@/components/sections/BetaGate';

function RootContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const isBetaGateActive = process.env.NEXT_PUBLIC_BETA_GATE_ACTIVE === 'true';
    const isSpecialRoute = pathname.startsWith('/admin') || pathname.startsWith('/auth');

    // Show beta gate only if:
    // 1. Beta gate is active
    // 2. Not a special route (/admin or /auth)
    // 3. User is not authenticated (once authenticated, they have beta access)

    // Prevent flash of content while checking auth state
    if (isBetaGateActive && !isSpecialRoute && loading) {
        return <div className="min-h-screen bg-white dark:bg-gray-900" />;
    }

    if (isBetaGateActive && !isSpecialRoute && !user) {
        return <BetaGate />;
    }

    return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <RootContent>{children}</RootContent>
            </AuthProvider>
        </ThemeProvider>
    );
}
