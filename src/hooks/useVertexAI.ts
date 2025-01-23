import { useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import { firebaseConfig, RECAPTCHA_ENTERPRISE_SITE_KEY } from '../../config';

export interface UseVertexAIOptions {
  modelName?: string;
}

export function useVertexAI({
  modelName = 'gemini-1.5-flash-002',
}: UseVertexAIOptions = {}) {
  const modelRef = useRef<any>(null);

  const initialize = useCallback(async () => {
    if (modelRef.current) return modelRef.current;

    const app = initializeApp(firebaseConfig);

    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
    });

    const vertexAI = getVertexAI(app);
    modelRef.current = getGenerativeModel(vertexAI, {
      model: modelName,
    });

    return modelRef.current;
  }, [modelName]);

  const generateResponse = useCallback(
    async (prompt: string) => {
      if (!modelRef.current) {
        await initialize();
      }

      try {
        const generateContentResult = await modelRef.current.generateContent(
          prompt,
        );
        return generateContentResult.response.text();
      } catch (error) {
        throw new Error(
          `Failed to generate response: ${(error as Error).message}`,
        );
      }
    },
    [initialize],
  );

  return {
    initialize,
    generateResponse,
  };
}
