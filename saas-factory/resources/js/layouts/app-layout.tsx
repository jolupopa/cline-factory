import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string; // Añadir prop title
    header?: ReactNode; // Añadir prop header
}

export default ({ children, breadcrumbs, title, header, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} title={title} header={header} {...props}>
        {children}
    </AppLayoutTemplate>
);
