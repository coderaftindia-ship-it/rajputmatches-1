import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { chatApi } from '../services/chat.api';

// High-quality Rajput match conversations with avatars & details
const MOCK_THREADS = [
  {
    id: '1',
    name: 'Aditi Kanwar Chauhan',
    gotra: 'Chauhan',
    clan: 'Chauhan',
    matriId: '1012',
    initials: 'AC',
    avatar: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=80',
    online: true,
    verified: true,
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
    clan: 'Shekhawat',
    matriId: '1013',
    initials: 'PS',
    avatar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
    online: false,
    verified: true,
    unread: 0,
    time: 'Yesterday',
    lastMsg: 'My family lives in Jodhpur.',
    msgs: [
      { id: 'p1', text: 'Hello Priya, nice to meet you!', sender: 'me', time: 'Yesterday' },
      { id: 'p2', text: 'My family lives in Jodhpur.', sender: 'them', time: 'Yesterday' },
    ],
  },
  {
    id: '3',
    name: 'Sunaina Bhati',
    gotra: 'Bhati',
    clan: 'Bhati',
    matriId: '1014',
    initials: 'SB',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    online: true,
    verified: true,
    unread: 1,
    time: 'Mon',
    lastMsg: 'Thank you for expressing interest in my profile.',
    msgs: [
      { id: 's1', text: 'Namaste Sunaina! Would love to get to know more about your family.', sender: 'me', time: 'Mon' },
      { id: 's2', text: 'Thank you for expressing interest in my profile.', sender: 'them', time: 'Mon' },
    ],
  },
];

const ICEBREAKER_PROMPTS = [
  '📜 Request Kundali Match',
  '🤝 Propose Family Call',
  '⭐ Share Horoscope Details',
  '📞 Request Contact Details',
];

export default function ChatScreen() {
  const [threads, setThreads] = useState<any[]>(MOCK_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'unread' | 'online'>('all');

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const fetchChats = useCallback(async () => {
    try {
      const data = await chatApi.listChats().catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        setThreads(
          data.map((c: any, idx: number) => {
            const mock = MOCK_THREADS[idx % MOCK_THREADS.length];
            return {
              id: c.id || c._id || mock.id,
              name: c.participantName || c.name || mock.name,
              gotra: c.gotra || mock.gotra,
              clan: c.clan || mock.clan,
              matriId: c.matriId || mock.matriId,
              initials: (c.participantName || c.name || mock.name).substring(0, 2).toUpperCase(),
              avatar: c.avatar || c.photo || mock.avatar,
              online: c.isOnline ?? mock.online,
              verified: c.isVerified ?? true,
              unread: c.unreadCount ?? mock.unread,
              time: c.lastMsgTime || mock.time,
              lastMsg: c.lastMessage || mock.lastMsg,
              msgs: c.messages || mock.msgs,
            };
          })
        );
      }
    } catch {
      // Keep mock threads
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const filteredThreads = threads.filter((th) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = th.name.toLowerCase().includes(q);
      const matchGotra = th.gotra?.toLowerCase().includes(q);
      const matchMsg = th.lastMsg?.toLowerCase().includes(q);
      if (!matchName && !matchGotra && !matchMsg) return false;
    }
    if (activeTabFilter === 'unread') return th.unread > 0;
    if (activeTabFilter === 'online') return th.online === true;
    return true;
  });

  const handleSendMessage = async (customText?: string) => {
    const messageToSend = (customText || inputText).trim();
    if (!messageToSend || !activeThreadId) return;

    if (!customText) setInputText('');

    const newMsgObj = {
      id: `m_${Date.now()}`,
      text: messageToSend,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === activeThreadId) {
          return {
            ...th,
            lastMsg: messageToSend,
            time: 'Just now',
            msgs: [...(th.msgs || []), newMsgObj],
          };
        }
        return th;
      })
    );

    setSending(true);
    try {
      await chatApi.sendMessage(activeThreadId, messageToSend).catch(() => {});
    } finally {
      setSending(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A1235" />

      {/* ─── ROYAL TOP APP HEADER ─── */}
      <View style={styles.topHeader}>
        {activeThreadId ? (
          <View style={styles.activeHeaderRow}>
            <TouchableOpacity
              style={styles.backHeaderBtn}
              onPress={() => setActiveThreadId(null)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#D4AF37" />
            </TouchableOpacity>

            {activeThread && (
              <View style={styles.headerAvatarContainer}>
                <Image source={{ uri: activeThread.avatar }} style={styles.headerAvatarImg} />
                {activeThread.online && <View style={styles.headerOnlineDot} />}
              </View>
            )}

            <View style={styles.headerTitleWrap}>
              {activeThread && (
                <View style={styles.activeThreadHeaderInfo}>
                  <View style={styles.headerNameRow}>
                    <Text style={styles.activeHeaderName} numberOfLines={1}>
                      {activeThread.name}
                    </Text>
                    {activeThread.verified && (
                      <Ionicons name="shield-checkmark" size={13} color="#10B981" />
                    )}
                  </View>
                  <Text style={styles.activeHeaderSub}>
                    Gotra: {activeThread.gotra} • {activeThread.online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.defaultHeaderRow}>
            <Image
              source={require('../../assets/images/lotus_ra_logo.png')}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
            <View style={styles.headerTitleWrap}>
              <Text style={styles.brandTitle}>Rajput Chat Room</Text>
              <Text style={styles.taglineText}>Verified Alliances Messaging</Text>
            </View>
          </View>
        )}

        {activeThread ? (
          <View style={styles.headerActionsRight}>
            <TouchableOpacity
              style={styles.callHeaderBtn}
              onPress={() => Alert.alert('Request Call', `Request contact call with ${activeThread.name}?`)}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerBadgeWrap}>
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>
                {threads.reduce((acc, curr) => acc + (curr.unread || 0), 0)} New
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* ─── CONVERSATIONS LIST VIEW ─── */}
      {!activeThreadId ? (
        <View style={{ flex: 1 }}>
          {/* Search Bar */}
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={18} color="#4A1235" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations, names, gotra..."
                placeholderTextColor="#9A7B90"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#4A1235" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Filter Tabs */}
          <View style={styles.filterTabsRow}>
            <TouchableOpacity
              style={[styles.filterTabPill, activeTabFilter === 'all' && styles.filterTabPillActive]}
              onPress={() => setActiveTabFilter('all')}
            >
              <Text style={[styles.filterTabText, activeTabFilter === 'all' && styles.filterTabTextActive]}>
                All Chats ({threads.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTabPill, activeTabFilter === 'unread' && styles.filterTabPillActive]}
              onPress={() => setActiveTabFilter('unread')}
            >
              <Text style={[styles.filterTabText, activeTabFilter === 'unread' && styles.filterTabTextActive]}>
                Unread
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTabPill, activeTabFilter === 'online' && styles.filterTabPillActive]}
              onPress={() => setActiveTabFilter('online')}
            >
              <Ionicons name="ellipse" size={8} color="#10B981" />
              <Text style={[styles.filterTabText, activeTabFilter === 'online' && styles.filterTabTextActive]}>
                Online Now
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerLoader}>
              <ActivityIndicator size="large" color="#4A1235" />
              <Text style={styles.loaderSubtext}>Loading Rajput conversations...</Text>
            </View>
          ) : filteredThreads.length === 0 ? (
            <View style={styles.centerLoader}>
              <Ionicons name="chatbubbles-outline" size={48} color="#8C687D" />
              <Text style={styles.noChatsTitle}>No Conversations Found</Text>
              <Text style={styles.noChatsSub}>Connect with Rajput members from Explore page to start chatting.</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.listContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A1235']} />}
              showsVerticalScrollIndicator={false}
            >
              {filteredThreads.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.threadItemCard}
                  onPress={() => {
                    setActiveThreadId(item.id);
                    // Mark as read
                    setThreads((prev) =>
                      prev.map((th) => (th.id === item.id ? { ...th, unread: 0 } : th))
                    );
                  }}
                  activeOpacity={0.88}
                >
                  <View style={styles.avatarWrapper}>
                    {item.avatar ? (
                      <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
                    ) : (
                      <LinearGradient colors={['#4A1235', '#6B1B4D']} style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{item.initials}</Text>
                      </LinearGradient>
                    )}
                    {item.online && <View style={styles.onlineDot} />}
                  </View>

                  <View style={styles.threadInfoCol}>
                    <View style={styles.nameRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
                        <Text style={styles.threadName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.verified && (
                          <Ionicons name="shield-checkmark" size={13} color="#10B981" />
                        )}
                      </View>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    <View style={styles.gotraPillRow}>
                      <View style={styles.gotraBadge}>
                        <Text style={styles.gotraBadgeText}>Gotra: {item.gotra}</Text>
                      </View>
                      <Text style={styles.matriIdSub}>Matri ID: {item.matriId}</Text>
                    </View>

                    <Text style={[styles.lastMsgText, item.unread > 0 && styles.lastMsgUnread]} numberOfLines={1}>
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
          )}
        </View>
      ) : (
        /* ─── ACTIVE CHAT THREAD MESSAGES VIEW ─── */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Quick Icebreaker Action Pills */}
          <View style={styles.icebreakerRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.icebreakerScroll}>
              {ICEBREAKER_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={`ib-${idx}`}
                  style={styles.icebreakerPill}
                  onPress={() => handleSendMessage(prompt)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.icebreakerPillText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatMessagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {/* Chat Date Divider */}
            <View style={styles.dateDividerRow}>
              <View style={styles.dateDividerLine} />
              <Text style={styles.dateDividerText}>TODAY</Text>
              <View style={styles.dateDividerLine} />
            </View>

            {activeThread?.msgs.map((m: any) => {
              const isMe = m.sender === 'me';
              return (
                <View
                  key={m.id}
                  style={[styles.msgBubbleRow, isMe ? styles.msgMeRow : styles.msgThemRow]}
                >
                  {!isMe && (
                    <Image source={{ uri: activeThread.avatar }} style={styles.msgAvatarThumb} />
                  )}

                  {isMe ? (
                    <LinearGradient colors={['#4A1235', '#6B1B4D']} style={[styles.msgBubble, styles.msgMeBubble]}>
                      <Text style={styles.msgMeText}>{m.text}</Text>
                      <View style={styles.msgStatusRow}>
                        <Text style={styles.msgMeTime}>{m.time}</Text>
                        <Ionicons name="checkmark-done" size={13} color="#D4AF37" />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.msgBubble, styles.msgThemBubble]}>
                      <Text style={styles.msgThemText}>{m.text}</Text>
                      <Text style={styles.msgThemTime}>{m.time}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* ─── MESSAGE INPUT FOOTER ─── */}
          <View style={styles.inputFooter}>
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={() => Alert.alert('Attachment', 'Attach Horoscope or Profile Document.')}
            >
              <Ionicons name="add-circle" size={26} color="#4A1235" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Type a message to your Rajput alliance..."
              placeholderTextColor="#9A7B90"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
              onPress={() => handleSendMessage()}
              disabled={sending || !inputText.trim()}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={16} color="#FFFFFF" />
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
    backgroundColor: '#FAF5EF',
  },

  // ─── TOP APP BAR ───
  topHeader: {
    height: 64,
    backgroundColor: '#4A1235',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#D4AF37',
  },
  defaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  backHeaderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#4A1235',
  },
  headerLogoImage: {
    width: 48,
    height: 48,
    marginRight: 6,
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFFDF9',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
    fontFamily: 'serif',
  },
  taglineText: {
    color: '#D4AF37',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  activeThreadHeaderInfo: {
    flexDirection: 'column',
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeHeaderName: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  activeHeaderSub: {
    color: '#F4E4BC',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  headerBadgeWrap: {
    alignItems: 'flex-end',
  },
  totalUnreadBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalUnreadText: {
    color: '#4A1235',
    fontSize: 10.5,
    fontWeight: '900',
  },

  // ─── SEARCH & FILTER TABS ───
  searchBarWrapper: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#E7D8C9',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#4A1235',
    fontWeight: '700',
  },

  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginTop: 10,
    gap: 8,
  },
  filterTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EDE5DC',
    borderWidth: 1,
    borderColor: '#E2CFC2',
  },
  filterTabPillActive: {
    backgroundColor: '#4A1235',
    borderColor: '#4A1235',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A1235',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },

  centerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loaderSubtext: {
    marginTop: 10,
    color: '#4A1235',
    fontWeight: '700',
  },
  noChatsTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#4A1235',
  },
  noChatsSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#8C687D',
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  listContent: {
    padding: 14,
    gap: 10,
    paddingBottom: 120,
  },
  threadItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7D8C9',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
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
  threadInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#4A1235',
    fontFamily: 'serif',
  },
  timeText: {
    fontSize: 10,
    color: '#8C687D',
    fontWeight: '600',
  },
  gotraPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  gotraBadge: {
    backgroundColor: '#EDE5DC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gotraBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9A7228',
  },
  matriIdSub: {
    fontSize: 9.5,
    color: '#8C687D',
    fontWeight: '600',
  },
  lastMsgText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  lastMsgUnread: {
    fontWeight: '800',
    color: '#4A1235',
  },
  unreadBadge: {
    backgroundColor: '#4A1235',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  // ─── ICEBREAKER ACTION PILLS ───
  icebreakerRow: {
    backgroundColor: '#FAF5EF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2CFC2',
  },
  icebreakerScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  icebreakerPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icebreakerPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A1235',
  },

  // ─── CHAT MESSAGES ───
  chatMessagesContent: {
    padding: 14,
    paddingBottom: 20,
  },
  dateDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2CFC2',
  },
  dateDividerText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#9A7228',
    letterSpacing: 1,
  },
  msgBubbleRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
    gap: 6,
  },
  msgMeRow: {
    justifyContent: 'flex-end',
  },
  msgThemRow: {
    justifyContent: 'flex-start',
  },
  msgAvatarThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginBottom: 2,
  },
  msgBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  msgMeBubble: {
    borderBottomRightRadius: 4,
  },
  msgThemBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E7D8C9',
  },
  msgMeText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
  },
  msgThemText: {
    color: '#2E0821',
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
  },
  msgStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  msgMeTime: {
    color: '#F4E4BC',
    fontSize: 9,
    fontWeight: '700',
  },
  msgThemTime: {
    color: '#8C687D',
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },

  // ─── INPUT FOOTER ───
  inputFooter: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7D8C9',
    alignItems: 'center',
    gap: 8,
  },
  attachBtn: {
    padding: 2,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#FAF5EF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#4A1235',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E2CFC2',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A1235',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: '#C2B2BD',
    shadowOpacity: 0,
    elevation: 0,
  },
});
