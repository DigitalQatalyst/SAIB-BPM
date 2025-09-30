import React, { useEffect, createElement } from 'react';
const VoiceflowChat: React.FC = () => {
  useEffect(() => {
    // Check if the script is already loaded to prevent duplicate loading
    if (document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]')) {
      return;
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => {
      // @ts-ignore - Voiceflow is loaded via script and not available in TypeScript definitions
      window.voiceflow?.chat.load({
        verify: {
          projectID: '68cc02cce763d8103577c4b9'
        },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: 'https://runtime-api.voiceflow.com'
        }
      });
    };
    script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
    document.body.appendChild(script);
    // Cleanup function to remove the script when component unmounts
    return () => {
      const scriptElement = document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);
  return null; // This component doesn't render anything visible
};
export default VoiceflowChat;