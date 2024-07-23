// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { content } = req.body;
    const discordWebhookUrl = req.headers['discord-webhook-url'];

 

    if (!discordWebhookUrl || typeof discordWebhookUrl !== 'string') {
      return res.status(400).json({ message: 'Discord webhook URL is required in headers' });
    }

    try {
      const response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        return res.status(response.status).json({ message: 'Failed to send message to Discord webhook' });
      }

      return res.status(200).json({ message: 'Message sent to Discord webhook' });
    } catch (error) {
      console.error('Error sending message to Discord webhook:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
