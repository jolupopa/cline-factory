import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Project } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface ProjectFormProps {
    project?: Project; // Opcional para edición
    onSuccess: () => void;
    onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<{
        name: string;
        description: string | null;
        status: 'active' | 'completed' | 'archived';
    }>({
        name: project?.name ?? '',
        description: project?.description ?? null,
        status: project?.status ?? 'active',
    });

    useEffect(() => {
        if (project) {
            setData({
                name: project.name,
                description: project.description,
                status: project.status,
            });
        } else {
            reset(); // Resetear el formulario si no hay proyecto (para creación)
        }
    }, [project]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project) {
            put(route('projects.update', { project: project.id }), {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        } else {
            post(route('projects.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={data.description ?? ''} // Asegurar que siempre sea string para el textarea
                    onChange={(e) => setData('description', e.target.value || null)} // Convertir a null si está vacío
                    className="mt-1 block w-full"
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                    value={data.status}
                    onValueChange={(value: 'active' | 'completed' | 'archived') => setData('status', value)}
                >
                    <SelectTrigger className="mt-1 block w-full">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                    {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                </Button>
            </div>
        </form>
    );
}
