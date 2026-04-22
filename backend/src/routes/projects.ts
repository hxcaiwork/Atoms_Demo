import { Router } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all projects for current user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: { projects } });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get a single project
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const projectId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: { project } });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create new project
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const { name, description, code = '', prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        code,
        prompt,
        userId,
      },
    });

    res.json({ success: true, data: { project } });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const projectId = parseInt(req.params.id);
    const { name, description, code, prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Check ownership
    const existing = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { name, description, code, prompt },
    });

    res.json({ success: true, data: { project } });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const projectId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Check ownership
    const existing = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await prisma.project.delete({ where: { id: projectId } });

    res.json({ success: true, data: { message: 'Project deleted' } });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
