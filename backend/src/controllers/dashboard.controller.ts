import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const now = new Date();

  try {
    const projectCount = await prisma.project.count({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        assignedUserId: userId,
      },
      _count: true,
    });

    const overdueCount = await prisma.task.count({
      where: {
        assignedUserId: userId,
        status: { not: 'COMPLETED' },
        dueDate: { lt: now },
      },
    });

    const formattedTaskStats = {
      TODO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };
...
    res.json({
      projectCount,
      taskStats: formattedTaskStats,
      overdueCount,
    });
  } catch (error) {
...
