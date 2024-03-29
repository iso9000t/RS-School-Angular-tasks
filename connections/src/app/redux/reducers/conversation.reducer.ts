import { createReducer, on } from '@ngrx/store';
import * as ConversationActions from '../actions/conversation.actions';
import { ConversationState } from '../models/redux.models';

const initialConversationState: ConversationState = {
  conversations: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const conversationReducer = createReducer(
  initialConversationState,
  on(ConversationActions.loadConversations, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    ConversationActions.loadConversationsSuccess,
    (state, { conversations }) => ({
      ...state,
      conversations,
      isLoading: false,
      error: null,
      lastUpdated: Date.now(),
    })
  ),
  on(ConversationActions.loadConversationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(
    ConversationActions.resetConversationState,
    () => initialConversationState
  ),
  on(ConversationActions.deleteConversation, (state, { conversationId }) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    ConversationActions.deleteConversationSuccess,
    (state, { conversationId }) => ({
      ...state,
      conversations: state.conversations.filter(
        (conv) => conv.id.S !== conversationId
      ),
      isLoading: false,
    })
  ),
  on(ConversationActions.deleteConversationFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);

