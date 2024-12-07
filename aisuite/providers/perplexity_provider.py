from typing import Dict, List, Optional
from ..framework.provider import Provider
from ..framework.types import Message, Choice

class PerplexityProvider(Provider):
    """Provider implementation for Perplexity AI."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Perplexity provider.
        
        Args:
            api_key: Perplexity API key
        """
        super().__init__()
        self.api_key = api_key or self._get_api_key("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai/chat/completions"
        
    async def chat_completion(
        self,
        messages: List[Message],
        model: str = "pplx-7b-chat",
        temperature: float = 0.7,
        **kwargs
    ) -> List[Choice]:
        """Create a chat completion using Perplexity's API.
        
        Args:
            messages: List of messages in the conversation
            model: Model to use (default: pplx-7b-chat)
            temperature: Sampling temperature (default: 0.7)
            **kwargs: Additional arguments to pass to the API
            
        Returns:
            List of completion choices
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            **kwargs
        }
        
        async with self.http_client.post(
            self.base_url,
            headers=headers,
            json=payload
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Perplexity API error: {error_text}")
                
            data = await response.json()
            return [
                Choice(
                    index=i,
                    message=choice["message"],
                    finish_reason=choice.get("finish_reason")
                )
                for i, choice in enumerate(data["choices"])
            ]
    
    @property
    def available_models(self) -> List[str]:
        """List available Perplexity models."""
        return [
            "pplx-7b-chat",
            "pplx-70b-chat",
            "pplx-7b-online",
            "pplx-70b-online",
            "mistral-7b-instruct",
            "mixtral-8x7b-instruct",
            "codellama-34b-instruct",
            "llama-2-70b-chat"
        ]