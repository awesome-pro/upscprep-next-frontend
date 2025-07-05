interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
                <h2 className="mt-1 text-lg text-muted-foreground">{subtitle}</h2>
            )}
        </div>
    );
}