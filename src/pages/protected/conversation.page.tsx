import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ArrowLeft, Image, Send, User } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import type { ConversationMetadata, Message } from '~/types';

import { useSellerProfile, useTranslation } from '~/hooks';

import { formatRelativeTime } from '~/utils';

import { Container, Helmet } from '~/components/common';
import { Avatar, Button, Textarea } from '~/components/ui';

import { useCloudinaryUpload } from '~/hooks/use-cloudinary-upload.hook';
import { useInfoUserForChat } from '~/hooks/use-info-user-for-chat.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { ConversationService } from '~/services/conversation.service';

interface ConversationPageParams {
  conversationId: string;
}

export const ConversationPage = memo(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const { conversationId } = useParams<ConversationPageParams>();

  const { uploadFiles } = useCloudinaryUpload();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMeta, setConversationMeta] = useState<ConversationMetadata | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const virtuosoRef = useRef<React.ComponentRef<typeof Virtuoso>>(null);
  const userType = window.location.pathname.includes('/seller/') ? 'seller' : 'customer';

  const customerProfile = useProfile({ enabled: userType === 'customer' });
  const sellerProfile = useSellerProfile({ enabled: userType === 'seller' });

  const profileResponse = useMemo(() => {
    return userType === 'seller' ? sellerProfile.data : customerProfile.data;
  }, [userType, customerProfile.data, sellerProfile.data]);

  const receiverType = userType === 'seller' ? 'customer' : 'seller';
  const { data: receiverInfo } = useInfoUserForChat({
    id: conversationMeta?.receiverId || '',
    type: receiverType,
    enabled: !!conversationMeta?.receiverId
  });

  const isMyMessage = (message: Message): boolean => {
    return message.senderId === profileResponse?.id && message.senderType === userType;
  };

  const loadOlderMessages = useCallback(async () => {
    if (loadingOlder || messages.length === 0) return;

    setLoadingOlder(true);
    try {
      const oldestMessage = messages[0];
      if (oldestMessage) {
        const olderMessages = await ConversationService.getOlderMessages({
          conversationId,
          beforeMessageId: oldestMessage.id,
          limit: 20
        });

        if (olderMessages.length > 0) {
          setMessages((prev) => [...olderMessages, ...prev]);

          setTimeout(() => {
            if (virtuosoRef.current) {
              virtuosoRef.current.scrollToIndex({
                index: olderMessages.length - 3,
                behavior: 'smooth'
              });
            }
          }, 0);
        }
      }
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, loadingOlder, messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !profileResponse?.id || sending) return;

    setSending(true);
    setNewMessage('');

    try {
      await ConversationService.sendMessage({
        conversationId,
        senderId: profileResponse.id,
        senderType: userType,
        text: newMessage.trim(),
        type: 'text'
      });
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
        unsubscribeMessages = ConversationService.subscribeToMessages({ conversationId, limit: 16 }, (newMessages) => {
          setMessages(newMessages);
          setLoading(false);
        });

        const metadata = await ConversationService.getConversationMetadata(profileResponse.id, conversationId, userType as 'customer' | 'seller');
        if (metadata) {
          setConversationMeta(metadata);
        }
        await ConversationService.markConversationAsSeen(profileResponse.id, conversationId, userType as 'customer' | 'seller');
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
    if (messages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: messages.length - 1, behavior: 'smooth' });
    }
  }, [messages.length]);

  const formatMessageTime = (timestamp: unknown): string => {
    if (!timestamp) return '';

    try {
      let date: Date;

      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
        date = new Date((timestamp as { seconds: number }).seconds * 1000);
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
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
        <Helmet title={t('Conversation.loadingConversation')}>
          <title>{t('Conversation.loadingConversation')}</title>
        </Helmet>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-gray-600">{t('Conversation.loadingConversation')}</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet title={`${t('Conversation.chatWith')} ${conversationMeta?.receiverName || t('Conversation.user')}`}>
        <title>
          {t('Conversation.chatWith')} {conversationMeta?.receiverName || t('Conversation.user')}
        </title>
      </Helmet>

      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-3 border-b pb-4">
          <Button size="sm" variant="ghost" onClick={() => history.goBack()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="flex h-10 w-10 items-center justify-center">
              {receiverInfo?.avatarUrl || conversationMeta?.receiverAvatar ? (
                <img
                  alt={receiverInfo?.name || conversationMeta?.receiverName || DEFAULT_IMG_AVATAR}
                  className="h-full w-full object-cover"
                  src={receiverInfo?.avatarUrl || conversationMeta?.receiverAvatar}
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{receiverInfo?.name || conversationMeta?.receiverName || t('Conversation.user')}</h2>
            </div>
          </div>
        </div>

        <div className="mb-4 h-[calc(100vh-250px)] overflow-hidden rounded-lg border bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <p>{t('Conversation.noMessagesYet')}</p>
            </div>
          ) : (
            <Virtuoso
              ref={virtuosoRef}
              data={messages}
              followOutput="smooth"
              initialTopMostItemIndex={Math.max(0, messages.length - 1)}
              startReached={loadOlderMessages}
              itemContent={(_, message) => (
                <div key={message.id} className="p-4">
                  <div className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMyMessage(message) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                      {message.type === 'image' && message.imageUrl && (
                        <div className="mb-2">
                          <img alt={t('Conversation.uploadedContent')} className="max-h-64 rounded object-cover" src={message.imageUrl} />
                        </div>
                      )}
                      {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                      {message.text && message.type === 'image' && <p className="mt-2">{message.text}</p>}
                      <p className={`mt-1 text-xs ${isMyMessage(message) ? 'text-white/70' : 'text-gray-500'}`}>{formatMessageTime(message.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
        </div>

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
              placeholder={t('Conversation.typeYourMessage')}
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button disabled={!newMessage.trim() || sending} size="sm" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
});

ConversationPage.displayName = 'ConversationPage';
