'use client';

import { useParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, ChevronRight, ChevronLeft, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const queryClient = useQueryClient();
  const socket = useSocket(projectId as string);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects`);
      return response.data.find((p: any) => p.id === projectId);
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await api.get(`/tasks?projectId=${projectId}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('task:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.info('Tasks updated by another user');
    });

    return () => {
      socket.off('task:updated');
    };
  }, [socket, projectId, queryClient]);

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: Status }) => {
      await api.put(`/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task deleted');
    },
  });

  const inviteMember = useMutation({
    mutationFn: async (email: string) => {
      await api.post(`/projects/${projectId}/members`, { email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Member added successfully');
      setIsInviteOpen(false);
      setInviteEmail('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add member');
    },
  });

  const renderColumn = (status: Status, title: string) => {
    const columnTasks = tasks?.filter((t: any) => t.status === status) || [];

    return (
      <div className="flex-1 min-w-[300px] bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700">{title}</h3>
          <span className="bg-white px-2 py-0.5 rounded text-xs font-semibold">{columnTasks.length}</span>
        </div>
        <div className="space-y-4">
          {columnTasks.map((task: any) => (
            <Card key={task.id} className="bg-white shadow-sm border-none">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:text-red-600"
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
                    task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="flex space-x-1">
                    {status !== 'TODO' && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateTaskStatus.mutate({ taskId: task.id, status: status === 'COMPLETED' ? 'IN_PROGRESS' : 'TODO' })}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    {status !== 'COMPLETED' && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateTaskStatus.mutate({ taskId: task.id, status: status === 'TODO' ? 'IN_PROGRESS' : 'COMPLETED' })}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="ghost" className="w-full border-dashed border-2 hover:bg-gray-200 text-gray-500">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>
    );
  };

  if (projectLoading) return <div className="p-8 text-center">Loading project...</div>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{project?.name}</h1>
              <p className="text-gray-500 mb-2">{project?.description}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>{project?.members?.length || 0} members</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Invite</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => inviteMember.mutate(inviteEmail)} disabled={inviteMember.isPending}>
                      {inviteMember.isPending ? 'Inviting...' : 'Send Invite'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>Settings</Button>
            </div>
          </div>

          <div className="flex-1 flex space-x-6 overflow-x-auto pb-4">
            {renderColumn('TODO', 'To Do')}
            {renderColumn('IN_PROGRESS', 'In Progress')}
            {renderColumn('COMPLETED', 'Completed')}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
