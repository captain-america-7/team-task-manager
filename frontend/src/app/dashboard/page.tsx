'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects');
      return response.data;
    },
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats?.projectCount}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">Todo</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold text-blue-600">{stats?.taskStats.TODO}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold text-yellow-600">{stats?.taskStats.IN_PROGRESS}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold text-green-600">{stats?.taskStats.COMPLETED}</div>}
              </CardContent>
            </Card>
            <Card className="border-red-100 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-500 uppercase">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold text-red-600">{stats?.overdueCount || 0}</div>}
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
            ) : projects?.length === 0 ? (
              <p className="text-gray-500 col-span-3">No projects found. Create one to get started!</p>
            ) : (
              projects?.map((project: any) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                        <span>{project.tasks.length} tasks</span>
                        <span>{project.members.length} members</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
