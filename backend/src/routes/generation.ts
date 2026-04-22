import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { generateCodeFromPrompt } from '../services/aiGeneration';

const router = Router();

// Generate code from prompt
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const { prompt, existingCode } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const hasApiKey = process.env.OPENAI_API_KEY || process.env.VOLC_API_KEY;
    if (!hasApiKey) {
      return res.status(500).json({ success: false, error: 'API key not configured' });
    }

    const result = await generateCodeFromPrompt(prompt, existingCode);

    if (result.success && result.code) {
      res.json({ success: true, data: { code: result.code } });
    } else {
      res.status(500).json({ success: false, error: result.error || 'Generation failed' });
    }
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
