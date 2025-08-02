import { memo, useEffect, useState } from 'react';

import { MessageCircle, Search, User } from 'lucide-react';
import { useHistory } from 'react-router-dom';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import type { ConversationMetadata } from '~/types';

import { useTranslation } from '~/hooks';

import { formatRelativeTime } from '~/utils';

import { Container, Helmet } from '~/components/common';
import { Avatar, Input } from '~/components/ui';

import { useInfoUserForChat } from '~/hooks/use-info-user-for-chat.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { ConversationService } from '~/services/conversation.service';

// Component con để sử dụng hook cho từng conversation
const ConversationItem = memo(({ conversation, handleClick }: { conversation: ConversationMetadata; handleClick: (id: string) => void }) => {
  const { t } = useTranslation();
  const userType = window.location.pathname.includes('/seller/') ? 'seller' : 'customer';
  const receiverType = userType === 'seller' ? 'customer' : 'seller';

  const { data: receiverInfo } = useInfoUserForChat({
    id: conversation.receiverId,
    type: receiverType,
    enabled: !!conversation.receiverId
  });

  const formatLastMessage = (message: string): string => {
    if (!message) return t('Messages.noMessagesYet');
    if (message.length > 50) return `${message.substring(0, 50)}...`;
    return message;
  };

  return (
    <div
      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${!conversation.isSeen ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
      onClick={() => handleClick(conversation.conversationId)}
    >
      {/* Avatar */}
      <div className="relative flex items-center justify-center">
        <Avatar className="flex h-12 w-12 items-center justify-center">
          {receiverInfo?.avatarUrl || conversation.receiverAvatar ? (
            <img alt={receiverInfo?.name || conversation.receiverName} src={receiverInfo?.avatarUrl || conversation.receiverAvatar || DEFAULT_IMG_AVATAR} />
          ) : (
            <User className="flex h-6 w-6 items-center justify-center" />
          )}
        </Avatar>
        {conversation.unseenCount > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {conversation.unseenCount > 9 ? '9+' : conversation.unseenCount}
          </div>
        )}
      </div>

      {/* Conversation Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{receiverInfo?.name || conversation.receiverName || 'Unknown User'}</h3>
        </div>
        <p className={`text-sm ${!conversation.isSeen ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{formatLastMessage(conversation.lastMessage)}</p>
      </div>
      <span className="text-sm text-gray-500">{formatRelativeTime(conversation.updatedAt.toDate())}</span>

      {/* Unread indicator */}
      {!conversation.isSeen && <div className="h-2 w-2 rounded-full bg-primary" />}
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

export const MessagePage = memo(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const { data: profileResponse } = useProfile({ enabled: true });

  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!profileResponse?.id) return;

    const unsubscribe = ConversationService.subscribeToConversations(
      {
        userId: profileResponse.id,
        userType: 'customer',
        limit: 50
      },
      (newConversations) => {
        setConversations(newConversations);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [profileResponse?.id]);

  const filteredConversations = conversations.filter(
    (conversation) => conversation.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) || conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationClick = (conversationId: string): void => {
    history.push(`/user/messages/conversation/${conversationId}`);
  };

  if (loading) {
    return (
      <Helmet title={t('Messages.title')}>
        <Container className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">{t('Messages.loadingConversations')}</p>
          </div>
        </Container>
      </Helmet>
    );
  }

  return (
    <Helmet title={t('Messages.title')}>
      <Container className="p-2 py-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('Messages.title')}</h1>
            <p className="text-gray-600">{t('Messages.chatWithSellers')}</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder={t('Messages.searchConversations')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('Messages.noConversations')}</h3>
                <p className="mt-2 text-gray-600">{t('Messages.startConversation')}</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => <ConversationItem key={conversation.conversationId} conversation={conversation} handleClick={handleConversationClick} />)
            )}
          </div>
        </div>
      </Container>
    </Helmet>
  );
});

MessagePage.displayName = 'MessagePage';
