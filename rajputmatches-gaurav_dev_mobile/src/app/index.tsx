import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage.service';
import { profileApi } from '../services/profile.api';
import { connectionApi } from '../services/connection.api';
import { SafeAvatarImage } from '../components/safe-avatar-image';

const formatHeight = (height: any): string => {
  if (!height) return "5'5\"";
  if (typeof height === 'string') return height;
  if (typeof height === 'number') return `${height} cm`;
  if (typeof height === 'object') {
    const feet = height.feet ?? height.ft ?? 5;
    const inches = height.inches ?? height.in ?? 0;
    return `${feet}'${inches}"`;
  }
  return "5'5\"";
};

const safeString = (val: any, fallback = '—'): string => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (val.feet !== undefined || val.inches !== undefined) {
      return formatHeight(val);
    }
    return String(val.name || val.title || val.value || val.degree || val.city || val.state || fallback);
  }
  return fallback;
};

// Normalize raw profile from API
const normalizeProfile = (p: any) => {
  const firstName = safeString(p.firstName, '');
  const lastName = safeString(p.lastName, '');
  const nameStr = p.name || p.fullName || `${firstName} ${lastName}`.trim() || 'Rajput Member';

  let ageVal: number | string = '—';
  if (p.age) {
    ageVal = safeString(p.age, '—');
  } else if (p.dateOfBirth) {
    const dob = new Date(p.dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const diff = Date.now() - dob.getTime();
      ageVal = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
  }

  let photoUrl = p.avatar || p.profileImage || p.image || p.photo || null;
  if (!photoUrl && p.filesId) {
    if (typeof p.filesId === 'string') {
      photoUrl = p.filesId;
    } else if (p.filesId.avatar) {
      photoUrl = p.filesId.avatar;
    } else if (Array.isArray(p.filesId.photos) && p.filesId.photos.length > 0) {
      const avatarPhoto = p.filesId.photos.find((ph: any) => ph?.isAvatar) || p.filesId.photos[0];
      photoUrl = avatarPhoto?.url || avatarPhoto?.path || avatarPhoto || null;
    }
  }
  if (!photoUrl && Array.isArray(p.photos) && p.photos.length > 0) {
    const firstP = p.photos[0];
    photoUrl = typeof firstP === 'string' ? firstP : firstP?.url || firstP?.path || null;
  }

  const gotraVal = safeString(p.gotra || p.clan || p.HoroscopicId?.clan || p.HoroscopicId?.gotra, 'Rajput');
  const locationVal = safeString(p.location || p.city || p.address?.city || p.address?.state, 'Rajasthan');
  const eduVal = safeString(p.education || p.qualification || p.profdetailsId?.class, 'Graduate');

  return {
    id: p._id || p.id || String(Math.random()),
    rawProfile: p,
    name: safeString(nameStr, 'Rajput Member'),
    age: ageVal,
    height: formatHeight(p.height),
    education: eduVal,
    location: locationVal,
    gotra: gotraVal,
    verified: p.isApproved ?? p.isVerified ?? true,
    newlyJoined: true,
    avatar: photoUrl,
    gender: safeString(p.gender || p.sex, ''),
    maritalStatus: safeString(p.maritalStatus, ''),
    occupation: safeString(p.occupation || p.profession, ''),
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [newlyJoined, setNewlyJoined] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [visitedProfiles, setVisitedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    const checkInitialWelcome = async () => {
      if (!authLoading && !isAuthenticated) {
        const skipped = await storageService.getItem('has_skipped_welcome');
        if (!skipped) {
          router.replace('/welcome');
        }
      }
    };
    checkInitialWelcome();
  }, [authLoading, isAuthenticated, router]);

  const fetchHomeData = useCallback(async () => {
    try {
      let rawProfiles: any[] = [];

      if (isAuthenticated) {
        const searchRes = await profileApi.search({}).catch(() => null);
        if (searchRes) {
          rawProfiles = Array.isArray(searchRes)
            ? searchRes
            : searchRes.data || searchRes.profiles || searchRes.users || [];
        }
      }

      if (!rawProfiles || rawProfiles.length === 0) {
        const pubRes = await profileApi.getRecentPublic().catch(() => null);
        if (pubRes) {
          rawProfiles = Array.isArray(pubRes)
            ? pubRes
            : pubRes.data || pubRes.profiles || [];
        }
      }

      if (rawProfiles && rawProfiles.length > 0) {
        const normalized = rawProfiles.map(normalizeProfile);
        setRecommendations(normalized);
        setNewlyJoined(normalized.slice(0, 8));
      }

      if (isAuthenticated) {
        const reqRes = await connectionApi.list().catch(() => null);
        if (reqRes) {
          const reqs: any[] = Array.isArray(reqRes)
            ? reqRes
            : reqRes.requests || reqRes.data || reqRes.received || [];
          setReceivedRequests(reqs.slice(0, 5));
        }

        const visitorsRes = await profileApi.getVisitors().catch(() => null);
        if (visitorsRes) {
          const visitors: any[] = Array.isArray(visitorsRes)
            ? visitorsRes
            : visitorsRes.visitors || visitorsRes.data || [];
          setVisitedProfiles(visitors.slice(0, 5));
        }

        await refreshUserData();
      }
    } catch (e) {
      console.warn('Error fetching home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, refreshUserData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHomeData();
  }, [fetchHomeData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const handleSendInterest = async (id: string, name: string) => {
    try {
      await connectionApi.send(id);
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent ❤️', `Connection request sent to ${name}.`);
    } catch {
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent ❤️', `Request registered for ${name}.`);
    }
  };

  const handleToggleShortlist = async (id: string) => {
    try {
      if (shortlisted.has(id)) {
        await profileApi.removeShortlist(id);
        setShortlisted((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await profileApi.addShortlist(id);
        setShortlisted((prev) => new Set(prev).add(id));
        Alert.alert('Shortlisted ⭐', 'Profile added to your shortlist.');
      }
    } catch {
      Alert.alert('Notice', 'Bookmark updated.');
    }
  };

  const handleViewProfile = (item: any) => {
    const profileToPass = item.rawProfile || item;
    router.push({
      pathname: '/view-profile',
      params: { id: item.id, data: JSON.stringify(profileToPass) },
    });
  };

  const currentUserName = user?.name || user?.fullName || 'Kshatriya Member';

  const activityFeed: { id: string; icon: string; color: string; text: string }[] = [
    ...receivedRequests.slice(0, 2).map((r: any, i: number) => ({
      id: `req-${i}`,
      icon: 'heart',
      color: '#59123B',
      text: `${r.name || r.sender?.name || 'Someone'} sent you an interest!`,
    })),
    ...visitedProfiles.slice(0, 2).map((v: any, i: number) => ({
      id: `visit-${i}`,
      icon: 'eye',
      color: '#3B82F6',
      text: `${v.name || 'Someone'} viewed your profile.`,
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <Text style={styles.greetingText}>JAI RPUTANA 🙏</Text>
          <Text style={styles.userName} numberOfLines={1}>{currentUserName}</Text>
        </View>

        <View style={styles.headerRight}>
          {!isAuthenticated ? (
            <TouchableOpacity style={styles.loginBadge} onPress={() => router.push('/welcome')}>
              <Ionicons name="log-in-outline" size={14} color="#59123B" />
              <Text style={styles.loginBadgeText}>Sign In</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.profileAvatarBtn} onPress={() => router.push('/profile')}>
              <SafeAvatarImage
                uri={user?.avatar || user?.profileImage}
                gender={user?.gender}
                name={currentUserName}
                style={styles.headerAvatar}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#59123B']} />}
      >
        {/* Hero Luxury Banner */}
        <LinearGradient colors={['#59123B', '#3f0c2a', '#29061b']} style={styles.heroBanner}>
          <View style={styles.crownRow}>
            <Text style={styles.heroTitle}>Royal Rajput Matrimony 👑</Text>
            <View style={styles.badgeGold}>
              <Text style={styles.badgeGoldText}>VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.heroSubtitle}>Find verified gotra matches built on heritage, culture and trust.</Text>

          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/explore')}>
            <Text style={styles.heroBtnText}>Explore Matches</Text>
            <Ionicons name="sparkles" size={15} color="#59123B" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/explore')}>
            {loading ? (
              <ActivityIndicator size="small" color="#59123B" />
            ) : (
              <Text style={styles.statNumber}>{recommendations.length > 0 ? `${recommendations.length}+` : '0'}</Text>
            )}
            <Text style={styles.statLabel}>New Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/interests')}>
            {loading ? (
              <ActivityIndicator size="small" color="#59123B" />
            ) : (
              <Text style={styles.statNumber}>{receivedRequests.length}</Text>
            )}
            <Text style={styles.statLabel}>Interests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/profile')}>
            {loading ? (
              <ActivityIndicator size="small" color="#59123B" />
            ) : (
              <Text style={styles.statNumber}>{visitedProfiles.length}</Text>
            )}
            <Text style={styles.statLabel}>Visitors</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Recommendations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Recommendations</Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.seeAllText}>
              See All {loading ? '' : `(${recommendations.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#59123B" style={{ marginVertical: 30 }} />
        ) : recommendations.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={38} color="#EDB139" />
            <Text style={styles.emptyText}>No recommendations yet.</Text>
            <Text style={styles.emptySubText}>Pull down to refresh or explore all profiles.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/explore')}>
              <Text style={styles.emptyBtnText}>Explore Profiles</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
            {recommendations.map((item) => {
              const isSent = sentInterests.has(item.id);
              const isShort = shortlisted.has(item.id);
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardImageWrapper}>
                    <SafeAvatarImage
                      uri={item.avatar}
                      gender={item.gender}
                      name={item.name}
                      style={styles.cardImage}
                    />

                    <TouchableOpacity
                      style={styles.bookmarkBtn}
                      onPress={() => handleToggleShortlist(item.id)}
                    >
                      <Ionicons
                        name={isShort ? 'bookmark' : 'bookmark-outline'}
                        size={17}
                        color={isShort ? '#EDB139' : '#FFFFFF'}
                      />
                    </TouchableOpacity>

                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {item.age} yrs • {item.height} • {item.gotra}
                    </Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {item.education} • {item.location}
                    </Text>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.viewBtn]}
                        onPress={() => handleViewProfile(item)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, isSent ? styles.sentBtn : styles.interestBtn]}
                        onPress={() => handleSendInterest(item.id, item.name)}
                        disabled={isSent}
                      >
                        <Ionicons name={isSent ? 'checkmark' : 'heart'} size={13} color="#FFFFFF" />
                        <Text style={styles.interestBtnText}>{isSent ? 'Sent' : 'Interest'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Newly Joined Members */}
        {newlyJoined.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Newly Joined Members</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newlyScroll}>
              {newlyJoined.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.newlyCard}
                  onPress={() => handleViewProfile(member)}
                >
                  <SafeAvatarImage
                    uri={member.avatar}
                    gender={member.gender}
                    name={member.name}
                    style={styles.newlyAvatar}
                  />
                  <Text style={styles.newlyName} numberOfLines={1}>{member.name.split(' ')[0]}</Text>
                  <Text style={styles.newlySub} numberOfLines={1}>{member.age} yrs, {member.location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Recent Activity */}
        {activityFeed.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            <View style={styles.activityBox}>
              {activityFeed.map((act) => (
                <View key={act.id} style={styles.activityRow}>
                  <View style={[styles.activityIconBox, { backgroundColor: act.color }]}>
                    <Ionicons name={act.icon as any} size={15} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityText}>{act.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {!loading && activityFeed.length === 0 && (
          <View style={styles.emptyActivity}>
            <Ionicons name="notifications-outline" size={26} color="#EDB139" />
            <Text style={styles.emptyActivityText}>No recent activity yet.</Text>
          </View>
        )}
      </ScrollView>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedProfile(null)}>
                <Ionicons name="close" size={22} color="#1F2937" />
              </TouchableOpacity>

              <SafeAvatarImage
                uri={selectedProfile.avatar}
                gender={selectedProfile.gender}
                name={selectedProfile.name}
                style={styles.modalImage}
              />

              <Text style={styles.modalName}>{selectedProfile.name}</Text>
              <Text style={styles.modalGotra}>Gotra: {selectedProfile.gotra}</Text>
              <Text style={styles.modalDetails}>
                {selectedProfile.age} yrs • {selectedProfile.height} • {selectedProfile.education}
              </Text>
              <Text style={styles.modalDetails}>📍 {selectedProfile.location}</Text>
              {selectedProfile.maritalStatus ? (
                <Text style={styles.modalDetails}>💍 {selectedProfile.maritalStatus}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.modalInterestBtn}
                onPress={() => {
                  handleSendInterest(selectedProfile.id, selectedProfile.name);
                  setSelectedProfile(null);
                }}
              >
                <Ionicons name="heart" size={17} color="#FFFFFF" />
                <Text style={styles.modalInterestText}>Send Connection Interest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#59123B',
    borderBottomWidth: 1,
    borderBottomColor: '#6e194a',
  },
  headerTitleBox: {
    flex: 1,
  },
  greetingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EDB139',
    letterSpacing: 1.2,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  loginBadge: {
    backgroundColor: '#EDB139',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loginBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#59123B',
  },
  profileAvatarBtn: {},
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EDB139',
  },
  fallbackContainer: {
    overflow: 'hidden',
  },
  fallbackGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackInitials: {
    color: '#EDB139',
    fontWeight: '800',
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: 110, // Gives ample space above bottom navigation tab bar
  },
  heroBanner: {
    margin: 14,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(237, 177, 57, 0.3)',
  },
  crownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EDB139',
  },
  badgeGold: {
    backgroundColor: 'rgba(237, 177, 57, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDB139',
  },
  badgeGoldText: {
    color: '#EDB139',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 14,
    lineHeight: 17,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDB139',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBtnText: {
    color: '#59123B',
    fontWeight: '800',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#59123B',
  },
  statLabel: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#59123B',
  },
  cardsScroll: {
    paddingLeft: 14,
    paddingRight: 10,
    gap: 12,
  },
  card: {
    width: 240, // Strict crisp width for responsive card design
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 6,
  },
  cardImageWrapper: {
    width: '100%',
    height: 165,
    backgroundColor: '#59123B',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 18,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  cardSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  viewBtn: {
    backgroundColor: '#F8EBD7',
  },
  viewBtnText: {
    color: '#59123B',
    fontWeight: '700',
    fontSize: 12,
  },
  interestBtn: {
    backgroundColor: '#59123B',
  },
  sentBtn: {
    backgroundColor: '#10B981',
  },
  interestBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  newlyScroll: {
    paddingLeft: 14,
    paddingRight: 10,
    gap: 10,
    marginBottom: 16,
  },
  newlyCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    width: 95,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  newlyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  newlyName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  newlySub: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  activityBox: {
    marginHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    marginHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyBtn: {
    marginTop: 14,
    backgroundColor: '#59123B',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 14,
    marginBottom: 14,
  },
  emptyActivityText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#59123B',
  },
  modalGotra: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CD9024',
    marginTop: 2,
  },
  modalDetails: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  modalInterestBtn: {
    marginTop: 18,
    backgroundColor: '#59123B',
    width: '100%',
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalInterestText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
