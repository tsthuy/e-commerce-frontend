import { memo, useEffect, useRef, useState } from 'react';

import { ArrowLeft, Image, Send, User } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';

import type { ConversationMetadata, Message } from '~/types';

import { formatRelativeTime } from '~/utils';

import { Container, Helmet } from '~/components/common';
import { Avatar, Button, Textarea } from '~/components/ui';

import { useCloudinaryUpload } from '~/hooks/use-cloudinary-upload.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { ConversationService } from '~/services/conversation.service';

interface ConversationPageParams {
  conversationId: string;
}

export const ConversationPage = memo(() => {
  const history = useHistory();
  const { conversationId } = useParams<ConversationPageParams>();
  const { data: profileResponse } = useProfile({ enabled: true });
  const { uploadFiles } = useCloudinaryUpload();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMeta, setConversationMeta] = useState<ConversationMetadata | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isMyMessage = (message: Message): boolean => {
    return message.senderId === profileResponse?.id;
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !profileResponse?.id || sending) return;

    setSending(true);
    try {
      const userType = window.location.pathname.includes('/seller/') ? 'seller' : 'customer';

      await ConversationService.sendMessage({
        conversationId,
        senderId: profileResponse.id,
        senderType: userType,
        text: newMessage.trim(),
        type: 'text'
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    if (!profileResponse?.id) return;

    setUploading(true);
    try {
      const uploadResult = await uploadFiles([file]);
      if (uploadResult.length > 0) {
        const imageUrl = uploadResult[0].secure_url;
        const userType = window.location.pathname.includes('/seller/') ? 'seller' : 'customer';

        await ConversationService.sendMessage({
          conversationId,
          senderId: profileResponse.id,
          senderType: userType,
          text: '',
          type: 'image',
          imageUrl
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  useEffect(() => {
    let unsubscribeMessages: (() => void) | undefined;

    const initializeConversation = async (): Promise<void> => {
      if (!profileResponse?.id) return;

      try {
        // Subscribe to messages
        unsubscribeMessages = ConversationService.subscribeToMessages({ conversationId, limit: 50 }, (newMessages) => {
          setMessages(newMessages);
          setLoading(false);
        });

        // Get conversation metadata
        const metadata = await ConversationService.getConversationMetadata(profileResponse.id, conversationId);
        if (metadata) {
          setConversationMeta(metadata);
        }

        // Mark conversation as seen
        await ConversationService.markConversationAsSeen(profileResponse.id, conversationId);
      } catch (error) {
        console.error('Error initializing conversation:', error);
        setLoading(false);
      }
    };

    initializeConversation();

    return (): void => {
      unsubscribeMessages?.();
    };
  }, [conversationId, profileResponse?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (timestamp: unknown): string => {
    if (!timestamp) return '';

    try {
      let date: Date;

      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
        // Firestore Timestamp
        date = (timestamp as { toDate: () => Date }).toDate();
      } else if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
        // Firestore Timestamp object
        date = new Date((timestamp as { seconds: number }).seconds * 1000);
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        // ISO string or number
        date = new Date(timestamp);
      } else {
        return '';
      }

      return formatRelativeTime(date);
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Container>
        <Helmet title="Loading conversation...">
          <title>Loading conversation...</title>
        </Helmet>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-gray-600">Loading conversation...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet title={`Chat with ${conversationMeta?.receiverName || 'User'}`}>
        <title>Chat with {conversationMeta?.receiverName || 'User'}</title>
      </Helmet>

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 border-b pb-4">
          <Button size="sm" variant="ghost" onClick={() => history.goBack()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">{conversationMeta?.receiverAvatar ? <img alt={conversationMeta.receiverName} src={conversationMeta.receiverAvatar} /> : <User className="h-5 w-5" />}</Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{conversationMeta?.receiverName || 'User'}</h2>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mb-4 h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMyMessage(message) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                    {message.type === 'image' && message.imageUrl && (
                      <div className="mb-2">
                        <img alt="Uploaded content" className="max-h-64 rounded object-cover" src={message.imageUrl} />
                      </div>
                    )}
                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                    {message.text && message.type === 'image' && <p className="mt-2">{message.text}</p>}
                    <p className={`mt-1 text-xs ${isMyMessage(message) ? 'text-white/70' : 'text-gray-500'}`}>{formatMessageTime(message.createdAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Button disabled={uploading} size="sm" type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Image className="h-4 w-4" />}
            </Button>
            <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleFileSelect} />
          </div>

          <div className="flex flex-1 gap-2">
            <Textarea
              className="max-h-32 min-h-[40px] resize-none"
              placeholder="Type your message..."
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button disabled={!newMessage.trim() || sending} size="sm" onClick={handleSendMessage}>
              {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
});

ConversationPage.displayName = 'ConversationPage';
