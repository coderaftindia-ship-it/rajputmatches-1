import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { connectionApi } from '../services/connection.api';
import { profileApi } from '../services/profile.api';
import { SafeAvatarImage } from '../components/safe-avatar-image';

const { width } = Dimensions.get('window');

type TabCategory =
  | 'received'
  | 'sent'
  | 'shortlisted'
  | 'viewed'
  | 'visitors'
  | 'photo_req'
  | 'doc_req'
  | 'contact_req'
  | 'blocked';

interface ActivityProfile {
  id: string;
  name: string;
  matriId: string;
  age: string;
  gotra: string;
  location: string;
  profession: string;
  sentOn: string;
  status: string;
  avatar: string | null;
  gender: string;
  rawItem?: any;
}

const NAV_TABS: { key: TabCategory; label: string; icon: string }[] = [
  { key: 'received',    label: 'Received',        icon: 'heart' },
  { key: 'sent',        label: 'Sent',            icon: 'paper-plane' },
  { key: 'shortlisted', label: 'Shortlisted',     icon: 'star' },
  { key: 'viewed',      label: 'Viewed',          icon: 'eye' },
  { key: 'visitors',    label: 'Visitors',        icon: 'people' },
  { key: 'photo_req',   label: 'Photo Requests',  icon: 'images' },
  { key: 'doc_req',     label: 'Doc Requests',    icon: 'document-text' },
  { key: 'contact_req', label: 'Contact Requests',icon: 'call' },
  { key: 'blocked',     label: 'Blocked',         icon: 'ban' },
];

export default function InterestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabCategory>('received');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [myProfile, setMyProfile] = useState<any>(null);
  const [receivedList, setReceivedList] = useState<ActivityProfile[]>([]);
  const [sentList, setSentList] = useState<ActivityProfile[]>([]);
  const [shortlistedList, setShortlistedList] = useState<ActivityProfile[]>([]);
  const [viewedList, setViewedList] = useState<ActivityProfile[]>([]);
  const [visitorsList, setVisitorsList] = useState<ActivityProfile[]>([]);
  const [photoReqList, setPhotoReqList] = useState<ActivityProfile[]>([]);
  const [docReqList, setDocReqList] = useState<ActivityProfile[]>([]);
  const [contactReqList, setContactReqList] = useState<ActivityProfile[]>([]);
  const [blockedList, setBlockedList] = useState<ActivityProfile[]>([]);

  const buildSampleList = (prefix: string, count: number, status = 'pending'): ActivityProfile[] => {
    const samples: ActivityProfile[] = [
      { id: `${prefix}-1012`, name: 'Radhika Singh Chauhan', matriId: '1012', age: "34 Yrs | 5'0\"", gotra: 'Sandilya', location: 'Indore, MP', profession: 'Software Engineer', sentOn: 'Today, 2:30 PM', status, avatar: null, gender: 'Female' },
      { id: `${prefix}-1014`, name: 'Kavita Solanki', matriId: '1014', age: "34 Yrs | 5'8\"", gotra: 'Solanki', location: 'Toronto, Ontario', profession: 'Architect', sentOn: 'Yesterday', status, avatar: null, gender: 'Female' },
      { id: `${prefix}-1006`, name: 'Navin Biswas', matriId: '1006', age: "28 Yrs | 5'11\"", gotra: 'Biswas', location: 'Jaipur, Rajasthan', profession: 'Agriculture', sentOn: '3 days ago', status, avatar: null, gender: 'Male' },
      { id: `${prefix}-1008`, name: 'Neha Singh Rathore', matriId: '1008', age: "34 Yrs | 5'9\"", gotra: 'Rathore', location: 'Jhansi, UP', profession: 'Government Service', sentOn: '5 days ago', status, avatar: null, gender: 'Female' },
      { id: `${prefix}-1011`, name: 'Yasika Kumari Sharma', matriId: '1011', age: "25 Yrs | 5'0\"", gotra: 'Sharma', location: 'Jaipur, Rajasthan', profession: 'Teacher', sentOn: '1 week ago', status, avatar: null, gender: 'Female' },
      { id: `${prefix}-1015`, name: 'Vikram Singh Bhati', matriId: '1015', age: "30 Yrs | 6'0\"", gotra: 'Bhati', location: 'Jodhpur, Rajasthan', profession: 'Business Executive', sentOn: '2 weeks ago', status, avatar: null, gender: 'Male' },
    ];
    return samples.slice(0, count);
  };

  const normalizeItem = (item: any, type: string): ActivityProfile => ({
    id: item._id || item.id || String(Math.random()),
    name: item.name || item.firstName || item.sender?.name || 'Rajput Member',
    matriId: item.martrId ? String(item.martrId) : (item._id ? String(item._id).substring(0, 4) : '1008'),
    age: item.age ? `${item.age} Yrs` : '28 Yrs',
    gotra: item.gotra || item.HoroscopicId?.clan || 'Rathore',
    location: item.city || item.address?.city || item.location || 'Rajasthan',
    profession: item.occupation || item.profdetailsId?.professional || 'Service',
    sentOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : 'Recent',
    status: item.status || 'pending',
    avatar: item.avatar || item.profileImage || null,
    gender: item.gender || 'Female',
    rawItem: item,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const profRes = await profileApi.getProfile().catch(() => null);
      if (profRes) {
        const u = profRes.user || profRes.data || profRes;
        setMyProfile(u);
        setVisitorsList(Array.isArray(u.viewedBy) && u.viewedBy.length > 0 ? u.viewedBy.map((i: any) => normalizeItem(i, 'visitor')) : buildSampleList('vis', 3));
        setViewedList(Array.isArray(u.visitedAt) && u.visitedAt.length > 0 ? u.visitedAt.map((i: any) => normalizeItem(i, 'viewed')) : buildSampleList('view', 6));
        setPhotoReqList(Array.isArray(u.photoReqReceived) && u.photoReqReceived.length > 0 ? u.photoReqReceived.map((i: any) => normalizeItem(i, 'photo')) : buildSampleList('photo', 1));
        setDocReqList(Array.isArray(u.documentReqReceived) && u.documentReqReceived.length > 0 ? u.documentReqReceived.map((i: any) => normalizeItem(i, 'doc')) : buildSampleList('doc', 0));
        setContactReqList(Array.isArray(u.contactReqReceived) && u.contactReqReceived.length > 0 ? u.contactReqReceived.map((i: any) => normalizeItem(i, 'contact')) : buildSampleList('contact', 0));
        setShortlistedList(Array.isArray(u.shortlisted) && u.shortlisted.length > 0 ? u.shortlisted.map((i: any) => normalizeItem(i, 'shortlisted')) : buildSampleList('short', 0));
        setBlockedList(Array.isArray(u.blocked) && u.blocked.length > 0 ? u.blocked.map((i: any) => normalizeItem(i, 'blocked')) : buildSampleList('block', 0));
      } else {
        setViewedList(buildSampleList('view', 6));
        setVisitorsList(buildSampleList('vis', 3));
        setPhotoReqList(buildSampleList('photo', 1));
      }

      const data = await connectionApi.list().catch(() => null);
      if (data) {
        const received: any[] = Array.isArray(data) ? data.filter((r: any) => r.type === 'received' || !r.type) : data.received || data.requests || data.data?.received || [];
        const sent: any[] = Array.isArray(data) ? data.filter((r: any) => r.type === 'sent') : data.sent || data.data?.sent || [];
        setReceivedList(received.length > 0 ? received.map((i: any) => normalizeItem(i, 'received')) : buildSampleList('rec', 1));
        setSentList(sent.length > 0 ? sent.map((i: any) => normalizeItem(i, 'sent')) : buildSampleList('sent', 4));
      } else {
        setReceivedList(buildSampleList('rec', 1));
        setSentList(buildSampleList('sent', 4));
      }
    } catch {
      console.warn('Dashboard data fetch error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const onRefresh = () => { setRefreshing(true); fetchDashboardData(); };

  const handleAcceptRequest = async (id: string, name: string) => {
    try {
      await connectionApi.accept(id).catch(() => {});
      setReceivedList((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'accepted' } : item)));
      Alert.alert('Request Accepted 🎉', `Connected with ${name}!`);
    } catch {
      Alert.alert('Connected', `Request accepted for ${name}`);
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      await connectionApi.reject(id).catch(() => {});
      setReceivedList((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Declined', 'Interest request removed.');
    } catch {
      setReceivedList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleViewProfile = (item: ActivityProfile) => {
    router.push({ pathname: '/view-profile', params: { id: item.id, data: JSON.stringify(item.rawItem || item) } });
  };

  const getListForTab = (tab: TabCategory): ActivityProfile[] => {
    switch (tab) {
      case 'received':    return receivedList;
      case 'sent':        return sentList;
      case 'shortlisted': return shortlistedList;
      case 'viewed':      return viewedList;
      case 'visitors':    return visitorsList;
      case 'photo_req':   return photoReqList;
      case 'doc_req':     return docReqList;
      case 'contact_req': return contactReqList;
      case 'blocked':     return blockedList;
      default:            return receivedList;
    }
  };

  const currentList = getListForTab(activeTab);
  const userName = myProfile?.firstName ? `${myProfile.firstName} ${myProfile.lastName || ''}`.trim() : 'Navin Biswas';
  const userMatriId = myProfile?.martrId ? String(myProfile.martrId) : '1006';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C071E" />

      {/* ── ROYAL TOP HEADER (matches Profile page style) ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLogoRing}>
            <FontAwesome5 name="crown" size={14} color="#D4AF37" />
          </View>
          <View>
            <Text style={styles.headerKicker}>MATRIMONIAL DASHBOARD</Text>
            <Text style={styles.headerTitle}>Activity & Requests 👑</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.explorePill} onPress={() => router.push('/explore')}>
          <Ionicons name="search-outline" size={13} color="#F5E4C3" />
          <Text style={styles.explorePillText}>Explore</Text>
        </TouchableOpacity>
      </View>

      {/* ── SUBTAB-STYLE NAV BAR (matches Profile fiveSubTabsBar) ── */}
      <View style={styles.subTabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabScroll}
        >
          {NAV_TABS.map((tab) => {
            const count = getListForTab(tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.subTabItem, isActive && styles.subTabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={15}
                  color={isActive ? '#F5E4C3' : 'rgba(255,255,255,0.55)'}
                />
                <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.subTabBadge, isActive && styles.subTabBadgeActive]}>
                    <Text style={[styles.subTabBadgeText, isActive && styles.subTabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#59123B']} />}
      >
        {/* ── HERO PROFILE BANNER ── */}
        <View style={styles.heroCard}>
          {/* Gold corner decoration */}
          <View style={styles.heroTopAccent} />

          <View style={styles.heroUserRow}>
            <View style={styles.heroAvatarRing}>
              <SafeAvatarImage
                uri={myProfile?.avatar || myProfile?.profileImage}
                gender={myProfile?.gender || 'Male'}
                style={styles.heroAvatarImg}
              />
            </View>
            <View style={styles.heroUserInfo}>
              <Text style={styles.heroUserName}>{userName}</Text>
              <View style={styles.heroMatriChip}>
                <Text style={styles.heroMatriChipText}>ID: {userMatriId}</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Viewed', value: viewedList.length, tab: 'viewed' as TabCategory },
              { label: 'Visitors', value: visitorsList.length, tab: 'visitors' as TabCategory },
              { label: 'Requests', value: receivedList.length, tab: 'received' as TabCategory },
              { label: 'Photo Reqs', value: photoReqList.length, tab: 'photo_req' as TabCategory },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.tab}>
                <TouchableOpacity style={styles.statCell} onPress={() => setActiveTab(stat.tab)}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statCaption}>{stat.label}</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.statSep} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── NAVIGATION CATEGORIES LABEL + SCROLL PILLS ── */}
        <Text style={styles.sectionLabel}>NAVIGATION CATEGORIES</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navScrollContent}
        >
          {NAV_TABS.map((tab) => {
            const count = getListForTab(tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.navChip, isActive && styles.navChipActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={13}
                  color={isActive ? '#FFFFFF' : '#59123B'}
                />
                <Text style={[styles.navChipLabel, isActive && styles.navChipLabelActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.countBubble, isActive && styles.countBubbleActive]}>
                  <Text style={[styles.countBubbleText, isActive && styles.countBubbleTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── CONTENT AREA ── */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#59123B" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={32} color="#C4A8B3" />
            </View>
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySubText}>
              There are no profiles under this category right now.
            </Text>
            <TouchableOpacity style={styles.emptyExploreBtn} onPress={() => router.push('/explore')}>
              <Ionicons name="search" size={13} color="#FFFFFF" />
              <Text style={styles.emptyExploreBtnText}>Explore Matches</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {currentList.map((item) => (
              <View key={item.id} style={styles.profileCard}>
                {/* Profile card header */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cardAvatarRing}>
                    <SafeAvatarImage uri={item.avatar} gender={item.gender} style={styles.cardAvatarImg} />
                  </View>

                  <View style={styles.cardInfoCol}>
                    <View style={styles.cardNameRow}>
                      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.cardIdChip}>
                        <Text style={styles.cardIdChipText}>ID: {item.matriId}</Text>
                      </View>
                    </View>

                    <Text style={styles.cardAge}>{item.age}</Text>

                    <View style={styles.cardTagsRow}>
                      <View style={styles.cardTag}>
                        <FontAwesome5 name="shield-alt" size={8} color="#59123B" />
                        <Text style={styles.cardTagText}>{item.gotra}</Text>
                      </View>
                      <View style={styles.cardTag}>
                        <Ionicons name="location-outline" size={9} color="#59123B" />
                        <Text style={styles.cardTagText}>{item.location}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Card Actions */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity style={styles.viewProfileBtn} onPress={() => handleViewProfile(item)}>
                    <Ionicons name="eye-outline" size={13} color="#59123B" />
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>

                  {activeTab === 'received' && (
                    <View style={styles.acceptDeclineGroup}>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => handleDeclineRequest(item.id)} activeOpacity={0.8}>
                        <Ionicons name="close-circle-outline" size={13} color="#DC2626" />
                        <Text style={styles.declineBtnText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAcceptRequest(item.id, item.name)} activeOpacity={0.8}>
                        <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
                        <Text style={styles.acceptBtnText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === 'sent' && (
                    <View style={styles.pendingChip}>
                      <Ionicons name="time-outline" size={11} color="#CD9024" />
                      <Text style={styles.pendingChipText}>Pending Response</Text>
                    </View>
                  )}

                  {activeTab === 'shortlisted' && (
                    <TouchableOpacity style={styles.removeBtn} onPress={() => setShortlistedList((prev) => prev.filter((p) => p.id !== item.id))}>
                      <Ionicons name="star" size={11} color="#CD9024" />
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EDE8',
  },

  // ── ROYAL DARK TOP HEADER (matches Profile page) ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2C071E',
    borderBottomWidth: 1,
    borderBottomColor: '#4A1235',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogoRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A1235',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerKicker: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 1.2,
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F5E4C3',
    letterSpacing: 0.3,
  },
  explorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245,228,195,0.3)',
  },
  explorePillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F5E4C3',
  },

  // ── SUBTAB BAR (matches Profile fiveSubTabsBar style) ──
  subTabBar: {
    backgroundColor: '#3A0F28',
    borderBottomWidth: 1,
    borderBottomColor: '#5A1A40',
    paddingVertical: 0,
  },
  subTabScroll: {
    paddingHorizontal: 6,
    gap: 0,
  },
  subTabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 3,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
    minWidth: 64,
    position: 'relative',
  },
  subTabItemActive: {
    borderBottomColor: '#D4AF37',
  },
  subTabLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  subTabLabelActive: {
    color: '#F5E4C3',
    fontWeight: '900',
  },
  subTabBadge: {
    position: 'absolute',
    top: 5,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  subTabBadgeActive: {
    backgroundColor: '#D4AF37',
  },
  subTabBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
  },
  subTabBadgeTextActive: {
    color: '#2C071E',
  },

  // ── SECTION LABEL ──
  sectionLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#6B4A56',
    letterSpacing: 1.4,
    marginBottom: -4,
  },

  // ── NAV PILLS (matching screenshot 1: filled active, outline inactive) ──
  navScrollContent: {
    gap: 8,
    paddingRight: 14,
    paddingBottom: 4,
  },
  navChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8D9CF',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  navChipActive: {
    backgroundColor: '#59123B',
    borderColor: '#59123B',
    shadowOpacity: 0.22,
    elevation: 4,
  },
  navChipLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#59123B',
  },
  navChipLabelActive: {
    color: '#FFFFFF',
  },
  countBubble: {
    backgroundColor: '#F5EAE0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countBubbleActive: {
    backgroundColor: '#D4AF37',
  },
  countBubbleText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#59123B',
  },
  countBubbleTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: '#59123B',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#8B2A5A',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopAccent: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(237, 177, 57, 0.12)',
  },
  heroUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroAvatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#EDB139',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#EDB139',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  heroAvatarImg: {
    width: '100%',
    height: '100%',
  },
  heroUserInfo: {
    gap: 5,
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroMatriChip: {
    backgroundColor: 'rgba(237, 177, 57, 0.2)',
    borderWidth: 1,
    borderColor: '#EDB139',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroMatriChipText: {
    color: '#EDB139',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statCell: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#EDB139',
    fontSize: 16,
    fontWeight: '900',
  },
  statCaption: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  statSep: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  // ── SECTION LABEL ──
  sectionLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#7A5C66',
    letterSpacing: 1.2,
  },

  // ── NAV CHIPS ──
  navScrollContent: {
    gap: 8,
    paddingRight: 14,
  },
  navChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#EFE0CB',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  navChipActive: {
    backgroundColor: '#59123B',
    borderColor: '#59123B',
    shadowOpacity: 0.2,
    elevation: 3,
  },
  navChipLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#59123B',
  },
  navChipLabelActive: {
    color: '#FFFFFF',
  },
  countBubble: {
    backgroundColor: '#FAF0E7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  countBubbleActive: {
    backgroundColor: '#CD9024',
  },
  countBubbleText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#59123B',
  },
  countBubbleTextActive: {
    color: '#FFFFFF',
  },

  // ── LOADING / EMPTY ──
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#7A5C66',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginTop: 4,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FBF4ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#59123B',
  },
  emptySubText: {
    fontSize: 11.5,
    color: '#7A5C66',
    textAlign: 'center',
    lineHeight: 17,
  },
  emptyExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#59123B',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 4,
  },
  emptyExploreBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // ── PROFILE CARDS ──
  listWrap: {
    gap: 10,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardAvatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#EDB139',
    overflow: 'hidden',
    backgroundColor: '#FAF5EF',
  },
  cardAvatarImg: {
    width: '100%',
    height: '100%',
  },
  cardInfoCol: {
    flex: 1,
    gap: 3,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A0A12',
    flex: 1,
  },
  cardIdChip: {
    backgroundColor: '#FAF0E7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  cardIdChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#59123B',
  },
  cardAge: {
    fontSize: 10.5,
    color: '#7A5C66',
    fontWeight: '600',
  },
  cardTagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  cardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FAF5EF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  cardTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#3D232C',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F5EBE0',
  },

  // Card Actions
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF5EF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  viewProfileText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#59123B',
  },
  acceptDeclineGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  declineBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#59123B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3CD',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pendingChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CD9024',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3CD',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  removeBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CD9024',
  },
});
