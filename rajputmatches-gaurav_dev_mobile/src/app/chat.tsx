import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatApi } from '../services/chat.api';

const FALLBACK_THREADS = [
  {
    id: '1',
    name: 'Aditi Kanwar Chauhan',
    gotra: 'Chauhan',
    initials: 'AC',
    gradient: ['#7A1D54', '#59123B'],
    online: true,
    unread: 2,
    time: '10:30 AM',
    lastMsg: 'Sure, we can match our Kundali first!',
    msgs: [
      { id: 'c1', text: 'Namaste Aditi! I viewed your profile and found it wonderful.', sender: 'me', time: '09:15 AM' },
      { id: 'c2', text: 'Namaste Vikram! Thank you so much. I liked your profile too!', sender: 'them', time: '09:45 AM' },
      { id: 'c3', text: 'Should we connect our families or chat here first?', sender: 'me', time: '10:00 AM' },
      { id: 'c4', text: 'Sure, we can match our Kundali first!', sender: 'them', time: '10:30 AM' },
    ],
  },
  {
    id: '2',
    name: 'Priya Shekhawat',
    gotra: 'Shekhawat',
    initials: 'PS',
    gradient: ['#59123B', '#3f0c2a'],
    online: false,
    unread: 0,
    time: 'Yesterday',
    lastMsg: 'My family lives in Jodhpur.',
    msgs: [
      { id: 'p1', text: 'Hello Priya, nice to meet you!', sender: 'me', time: 'Yesterday' },
      { id: 'p2', text: 'My family lives in Jodhpur.', sender: 'them', time: 'Yesterday' },
    ],
  },
];

export default function ChatScreen() {
  const [threads, setThreads] = useState<any[]>(FALLBACK_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const fetchChats = useCallback(async () => {
    try {
      const data = await chatApi.listChats().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        setThreads(
          data.map((c: any) => ({
            id: c.id || c._id,
            name: c.participantName || c.name || 'Rajput Match',
            gotra: c.gotra || 'Rajput',
            initials: (c.participantName || c.name || 'RM').substring(0, 2).toUpperCase(),
            gradient: ['#7A1D54', '#59123B'],
            online: c.isOnline ?? true,
            unread: c.unreadCount || 0,
            time: c.lastMsgTime || 'Just now',
            lastMsg: c.lastMessage || 'Connected on Rajput Matches',
            msgs: c.messages || [
              { id: 'm1', text: c.lastMessage || 'Namaste! Lets connect.', sender: 'them', time: 'Just now' },
            ],
          }))
        );
      }
    } catch {
      console.warn('Backend chat service offline, using mock conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChats();
  }, [fetchChats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeThreadId) return;

    const newMsgText = inputText.trim();
    setInputText('');

    const newMsgObj = {
      id: `m_${Date.now()}`,
      text: newMsgText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic UI update
    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === activeThreadId) {
          return {
            ...th,
            lastMsg: newMsgText,
            time: 'Just now',
            msgs: [...(th.msgs || []), newMsgObj],
          };
        }
        return th;
      })
    );

    setSending(true);
    try {
      await chatApi.sendMessage(activeThreadId, newMsgText).catch(() => {});
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Header */}
      <View style={styles.header}>
        {activeThreadId ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => setActiveThreadId(null)}>
            <Ionicons name="arrow-back" size={22} color="#EDB139" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chatbubbles" size={24} color="#EDB139" />
        )}

        <Text style={styles.headerTitle}>
          {activeThread ? activeThread.name : 'Rajput Chat Room 💬'}
        </Text>
      </View>

      {/* Main Area */}
      {!activeThreadId ? (
        // Chat List View
        loading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color="#59123B" />
            <Text style={{ marginTop: 10, color: '#4B5563' }}>Loading conversations...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#59123B']} />}
          >
            <Text style={styles.sectionHeading}>Active Conversations</Text>

            {threads.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.threadItem}
                onPress={() => setActiveThreadId(item.id)}
              >
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                  {item.online && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.threadInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.threadName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>

                  <Text style={styles.gotraSub}>Gotra: {item.gotra}</Text>
                  <Text style={styles.lastMsgText} numberOfLines={1}>
                    {item.lastMsg}
                  </Text>
                </View>

                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      ) : (
        // Active Chat Messages View
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView contentContainerStyle={styles.chatMessagesContent}>
            {activeThread?.msgs.map((m: any) => {
              const isMe = m.sender === 'me';
              return (
                <View
                  key={m.id}
                  style={[styles.msgBubbleRow, isMe ? styles.msgMeRow : styles.msgThemRow]}
                >
                  <View style={[styles.msgBubble, isMe ? styles.msgMeBubble : styles.msgThemBubble]}>
                    <Text style={[styles.msgText, isMe ? styles.msgMeText : styles.msgThemText]}>
                      {m.text}
                    </Text>
                    <Text style={[styles.msgTime, isMe ? styles.msgMeTime : styles.msgThemTime]}>
                      {m.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Message Input Footer */}
          <View style={styles.inputFooter}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSendMessage}
              disabled={sending || !inputText.trim()}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#59123B',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EDB139',
  },
  centerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#59123B',
    marginBottom: 6,
  },
  threadItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#59123B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  gotraSub: {
    fontSize: 11,
    color: '#EDB139',
    fontWeight: '700',
    marginTop: 1,
  },
  lastMsgText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 3,
  },
  unreadBadge: {
    backgroundColor: '#59123B',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  chatMessagesContent: {
    padding: 16,
    gap: 12,
  },
  msgBubbleRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  msgMeRow: {
    justifyContent: 'flex-end',
  },
  msgThemRow: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  msgMeBubble: {
    backgroundColor: '#59123B',
    borderBottomRightRadius: 4,
  },
  msgThemBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgMeText: {
    color: '#FFFFFF',
  },
  msgThemText: {
    color: '#1F2937',
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgMeTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  msgThemTime: {
    color: '#9CA3AF',
  },
  inputFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFE0CB',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8EBD7',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#59123B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
