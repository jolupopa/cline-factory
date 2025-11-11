import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, type ReactNode } from 'react';

interface AppSidebarLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string; // Añadir prop title
    header?: ReactNode; // Añadir prop header
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    title, // Desestructurar title
    header, // Desestructurar header
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                {header ? ( // Renderizar header si existe
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                ) : null}
                <AppSidebarHeader breadcrumbs={breadcrumbs} title={title} /> {/* Pasar title a AppSidebarHeader */}
                {children}
            </AppContent>
        </AppShell>
    );
}
