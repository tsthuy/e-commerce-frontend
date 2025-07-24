import { memo, useEffect, useState } from 'react';

import { MessageCircle, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import type { ConversationMetadata } from '~/types';

import { formatRelativeTime } from '~/utils';

import { Container, Helmet } from '~/components/common';
import { Avatar, Button, Input } from '~/components/ui';

import { useInfoUserForChat } from '~/hooks/use-info-user-for-chat.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { ConversationService } from '~/services/conversation.service';

// Component con để sử dụng hook cho từng conversation
const ConversationItem = memo(({ conversation, handleClick }: { conversation: ConversationMetadata; handleClick: (id: string) => void }) => {
  // Seller is talking to customer
  const { data: customerInfo } = useInfoUserForChat({
    id: conversation.receiverId,
    type: 'customer'
  });
  const { t } = useTranslation();

  const formatConversationTime = (timestamp: unknown): string => {
    if (!timestamp) return '';

    try {
      let date: Date;

      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof (timestamp as { toDate: () => Date }).toDate === 'function') {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp && typeof (timestamp as { seconds: number }).seconds === 'number') {
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

  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 ${!conversation.isSeen ? 'border-blue-200 bg-blue-50' : 'bg-white'}`}
      onClick={() => handleClick(conversation.conversationId)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          {customerInfo?.avatarUrl || conversation.receiverAvatar ? (
            <img alt={customerInfo?.name || conversation.receiverName} src={customerInfo?.avatarUrl || conversation.receiverAvatar} />
          ) : (
            <User className="h-6 w-6" />
          )}
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{customerInfo?.name || conversation.receiverName || t('Messages.customer')}</h3>
            <div className="flex items-center gap-2">
              {conversation.unseenCount > 0 && <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">{conversation.unseenCount}</span>}
              <span className="text-xs text-gray-500">{formatConversationTime(conversation.updatedAt)}</span>
            </div>
          </div>

          <p className={`truncate text-sm ${!conversation.isSeen ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{conversation.lastMessage || t('Messages.noMessagesYet')}</p>
        </div>
      </div>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

export const ShopInboxPage = memo(() => {
  const history = useHistory();
  const { data: profileResponse } = useProfile({ enabled: true });
  const { t } = useTranslation();

  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleConversationClick = (conversationId: string): void => {
    history.push(`/seller/inbox/conversation/${conversationId}`);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = conversations.filter(
        (conversation) => conversation.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) || conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchTerm, conversations]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (profileResponse?.id) {
      setLoading(true);

      unsubscribe = ConversationService.subscribeToConversations({ userId: profileResponse.id, userType: 'seller' }, (newConversations) => {
        // Sort by updatedAt descending (most recent first)
        const sortedConversations = newConversations.sort((a, b) => {
          const aTime = a.updatedAt?.seconds || 0;
          const bTime = b.updatedAt?.seconds || 0;
          return bTime - aTime;
        });
        setConversations(sortedConversations);
        setLoading(false);
      });
    }

    return (): void => {
      unsubscribe?.();
    };
  }, [profileResponse?.id]);

  if (loading) {
    return (
      <Container>
        <Helmet title={t('Messages.shopInboxLoading')}>
          <title>{t('Messages.shopInboxLoading')}</title>
        </Helmet>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-gray-600">{t('Messages.loadingMessages')}</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet title={t('Messages.shopInbox')}>
        <title>{t('Messages.shopInbox')}</title>
      </Helmet>

      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('Messages.shopInbox')}</h1>
          <p className="text-gray-600">{t('Messages.manageConversations')}</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder={t('Messages.searchConversations')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-8 text-center">
              <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">{searchTerm ? t('Messages.noMatchingConversations') : t('Messages.noMessagesYet')}</h3>
              <p className="text-gray-600">{searchTerm ? t('Messages.tryAdjustingSearch') : t('Messages.customerMessagesWillAppear')}</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => <ConversationItem key={conversation.conversationId} conversation={conversation} handleClick={handleConversationClick} />)
          )}
        </div>

        {/* Quick Actions */}
        {filteredConversations.length > 0 && (
          <div className="mt-6 rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900">{t('Messages.quickActions')}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Mark all as seen
                  conversations.forEach(async (conv) => {
                    if (!conv.isSeen && profileResponse?.id) {
                      await ConversationService.markConversationAsSeen(profileResponse.id, conv.conversationId, 'seller');
                    }
                  });
                }}
              >
                {t('Messages.markAllAsRead')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
});

ShopInboxPage.displayName = 'ShopInboxPage';
