import React from 'react';
import { Project } from '@/types'; // Asumimos que Project type estará en '@/types' o en 'features/projects/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface ProjectListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">No hay proyectos aún. ¡Crea uno!</p>
            ) : (
                projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{project.status}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                                    Editar
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(project)}>
                                    Eliminar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
