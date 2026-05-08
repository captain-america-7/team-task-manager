import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { members: true, tasks: true },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        creatorId: req.user!.id,
        members: {
          create: {
            userId: req.user!.id,
          },
        },
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Only creator or ADMIN can add members
    if (project.creatorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to add members' });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ error: 'User not found' });

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
      },
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: 'User already a member or invalid data' });
  }
};
