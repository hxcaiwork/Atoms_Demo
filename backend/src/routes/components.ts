import { Router } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all components for current user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const components = await prisma.component.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { components } });
  } catch (error) {
    console.error('Get components error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create new component (save to library)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const { name, description, code, prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!name || !code) {
      return res.status(400).json({ success: false, error: 'Name and code are required' });
    }

    const component = await prisma.component.create({
      data: {
        name,
        description,
        code,
        prompt,
        userId,
      },
    });

    res.json({ success: true, data: { component } });
  } catch (error) {
    console.error('Create component error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get a single component
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const componentId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const component = await prisma.component.findFirst({
      where: { id: componentId, userId },
    });

    if (!component) {
      return res.status(404).json({ success: false, error: 'Component not found' });
    }

    res.json({ success: true, data: { component } });
  } catch (error) {
    console.error('Get component error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update component
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const componentId = parseInt(req.params.id);
    const { name, description, code, prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const existing = await prisma.component.findFirst({ where: { id: componentId, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Component not found' });
    }

    const component = await prisma.component.update({
      where: { id: componentId },
      data: { name, description, code, prompt },
    });

    res.json({ success: true, data: { component } });
  } catch (error) {
    console.error('Update component error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete component
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const componentId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const existing = await prisma.component.findFirst({ where: { id: componentId, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Component not found' });
    }

    await prisma.component.delete({ where: { id: componentId } });

    res.json({ success: true, data: { message: 'Component deleted' } });
  } catch (error) {
    console.error('Delete component error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
