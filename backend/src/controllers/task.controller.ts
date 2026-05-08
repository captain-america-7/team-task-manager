import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../server';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.query;

  try {
    const tasks = await prisma.task.findMany({
      where: projectId ? { projectId: String(projectId) } : {},
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, status, projectId, assignedUserId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        projectId,
        assignedUserId,
      },
    });
    
    io.to(projectId).emit('task:updated', { action: 'create', task });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedUserId } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        assignedUserId,
      },
    });

    io.to(task.projectId).emit('task:updated', { action: 'update', task });

    res.json(task);
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await prisma.task.delete({ where: { id } });

    io.to(task.projectId).emit('task:updated', { action: 'delete', taskId: id });

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
};
