import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout'; // Corregir ruta y mayúsculas
import { Head, useForm } from '@inertiajs/react';
import { Project } from '@/types';
import { ProjectList } from '@/features/projects/components/ProjectList'; // Corregir mayúsculas
import { ProjectForm } from '@/features/projects/components/ProjectForm'; // Corregir mayúsculas
import { Button } from '@/components/ui/button'; // Corregir mayúsculas
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Corregir mayúsculas
import { useToast } from '@/components/ui/use-toast'; // Corregir mayúsculas

interface ProjectsIndexProps {
    projects: Project[];
}

export default function Index({ projects }: ProjectsIndexProps) {
    const { toast } = useToast();
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

    const { delete: inertiaDelete, processing } = useForm();

    const handleCreateProject = () => {
        setEditingProject(undefined);
        setShowFormModal(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setShowFormModal(true);
    };

    const handleDeleteProject = (project: Project) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            inertiaDelete(route('projects.destroy', { project: project.id }), { // Corregir error de Ziggy
                onSuccess: () => {
                    toast({
                        title: 'Proyecto eliminado',
                        description: `El proyecto "${project.name}" ha sido eliminado exitosamente.`,
                    });
                },
                onError: (errors) => {
                    toast({
                        title: 'Error al eliminar',
                        description: errors.message || 'Hubo un error al eliminar el proyecto.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const handleFormSuccess = () => {
        setShowFormModal(false);
        setEditingProject(undefined);
        toast({
            title: editingProject ? 'Proyecto actualizado' : 'Proyecto creado',
            description: editingProject
                ? `El proyecto "${editingProject.name}" ha sido actualizado.`
                : 'Un nuevo proyecto ha sido creado exitosamente.',
        });
    };

    const handleFormCancel = () => {
        setShowFormModal(false);
        setEditingProject(undefined);
    };

    return (
        <AppLayout
            title="Proyectos"
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Proyectos
                </h2>
            }
        >
            <Head title="Proyectos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end mb-4">
                                <Button onClick={handleCreateProject}>Crear Nuevo Proyecto</Button>
                            </div>
                            <ProjectList
                                projects={projects}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? 'Editar Proyecto' : 'Crear Proyecto'}</DialogTitle>
                        <DialogDescription>
                            {editingProject
                                ? 'Realiza cambios en tu proyecto aquí.'
                                : 'Crea un nuevo proyecto para empezar.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ProjectForm
                        project={editingProject}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
