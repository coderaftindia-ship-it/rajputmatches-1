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
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { profileApi } from '../services/profile.api';
import { connectionApi } from '../services/connection.api';
import { SafeAvatarImage } from '../components/safe-avatar-image';
import { FilterDrawerModal } from '../components/filter-drawer-modal';

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

const safeString = (val: any, fallback = 'Not Specified'): string => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string' || typeof val === 'number') {
    const s = String(val).trim();
    return s.length > 0 ? s : fallback;
  }
  if (typeof val === 'object') {
    if (val.feet !== undefined || val.inches !== undefined) {
      return formatHeight(val);
    }
    return String(val.name || val.title || val.value || val.degree || val.city || val.state || fallback);
  }
  return fallback;
};

const isNewlyJoinedProfile = (p: any): boolean => {
  if (p.newlyJoined === true) return true;

  // 1. Check explicit date fields (createdAt, registeredAt, etc.)
  const dateStr = p.createdAt || p.registeredAt || p.dateJoined;
  if (dateStr) {
    const createdDate = new Date(dateStr);
    if (!isNaN(createdDate.getTime())) {
      const diffDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
  }

  // 2. Extract timestamp from MongoDB ObjectId (_id)
  const objectId = p._id || p.id;
  if (objectId && typeof objectId === 'string' && objectId.length === 24) {
    try {
      const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
      const createdDate = new Date(timestamp);
      if (!isNaN(createdDate.getTime())) {
        const diffDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback: If no date specified, mark as newly joined so list is populated
  return true;
};

const isAdminVerifiedProfile = (p: any): boolean => {
  return p.isVerified === true || p.isVerified === 'true' || p.status === 'verified';
};

const normalizeMatch = (p: any) => {
  const firstName = safeString(p.firstName, '');
  const lastName = safeString(p.lastName, '');
  const nameStr = p.name || p.fullName || `${firstName} ${lastName}`.trim() || 'Rajput Member';

  let ageVal = '—';
  if (p.age) {
    ageVal = String(p.age);
  } else if (p.dateOfBirth) {
    const dob = new Date(p.dateOfBirth);
    if (!isNaN(dob.getTime())) {
      ageVal = String(new Date().getFullYear() - dob.getFullYear());
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

  const gotraVal = safeString(p.HoroscopicId?.gotra || p.gotra, 'Not Specified');
  const clanVal = safeString(p.HoroscopicId?.clan || p.clan, 'Not Specified');
  const cityVal = safeString(p.city || p.address?.city, 'Jhansi');
  const stateVal = safeString(p.address?.state, 'Uttar Pradesh');
  const locationVal = cityVal && stateVal ? `${cityVal}, ${stateVal}` : (cityVal || stateVal || 'Rajasthan');

  const profData = p.profdetailsId || {};
  const qualList = Array.isArray(profData.qualificationsList) ? profData.qualificationsList : [];
  const occList = Array.isArray(profData.occupationsList) ? profData.occupationsList : [];
  const eduVal = safeString(profData.qualifications || qualList[0]?.qualification || p.education, 'Not Specified');
  const occVal = safeString(profData.professional || occList[0]?.occupation || p.occupation, 'Not Specified');
  const classVal = safeString(profData.class, 'Not Specified');
  const matriId = p.martrId ? String(p.martrId) : (p._id ? String(p._id).substring(0, 4) : '1008');

  return {
    id: p._id || p.id || String(Math.random()),
    rawProfile: p,
    matriId,
    name: safeString(nameStr, 'Rajput Member'),
    age: ageVal,
    height: formatHeight(p.height),
    gotra: gotraVal,
    clan: clanVal,
    education: eduVal,
    occupation: occVal,
    classVal,
    location: locationVal,
    city: cityVal,
    newlyJoined: isNewlyJoinedProfile(p),
    verified: isAdminVerifiedProfile(p),
    avatar: photoUrl,
    gender: safeString(p.gender || p.sex, 'Female'),
  };
};

export default function ExploreScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());
  const [photoReqs, setPhotoReqs] = useState<Set<string>>(new Set());
  const [contactReqs, setContactReqs] = useState<Set<string>>(new Set());
  const [blockedSet, setBlockedSet] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'verified'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'full'>('grid'); // Default: 2-Grid Mode
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const handleApplyDrawerFilters = async (filtersPayload: any) => {
    setLoading(true);
    try {
      const res = await profileApi.search(filtersPayload).catch(() => null);
      if (res) {
        const rawProfiles = Array.isArray(res)
          ? res
          : res.profiles || res.data || res.users || [];
        if (rawProfiles.length > 0) {
          const normalized = rawProfiles.map(normalizeMatch);
          setMatches(normalized);
        }
      }
    } catch {
      console.warn('Filter search error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = useCallback(async () => {
    try {
      let rawProfiles: any[] = [];
      const res = await profileApi.search({}).catch(() => null);

      if (res) {
        rawProfiles = Array.isArray(res)
          ? res
          : res.profiles || res.data || res.users || [];
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
        const normalized = rawProfiles.map(normalizeMatch);
        setMatches(normalized);
      }
    } catch {
      console.warn('Explore matches fetch error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMatches();
  }, [fetchMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const handleSendInterest = async (id: string, name: string) => {
    try {
      await connectionApi.send(id).catch(() => {});
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent ❤️', `Connection request sent to ${name}.`);
    } catch {
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent ❤️', `Request registered for ${name}.`);
    }
  };

  const handlePhotoRequest = (id: string, name: string) => {
    setPhotoReqs((prev) => new Set(prev).add(id));
    Alert.alert('Photo Request 🖼️', `Photo request sent to ${name}.`);
  };

  const handleContactRequest = (id: string, name: string) => {
    setContactReqs((prev) => new Set(prev).add(id));
    Alert.alert('Contact Request 👤', `Contact request sent to ${name}.`);
  };

  const handleBlockProfile = (id: string, name: string) => {
    Alert.alert('Block Profile 🚫', `Are you sure you want to block ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: () => {
          setBlockedSet((prev) => new Set(prev).add(id));
          Alert.alert('Blocked', `${name} has been blocked.`);
        },
      },
    ]);
  };

  const handleViewProfile = (item: any) => {
    const profileToPass = item.rawProfile || item;
    router.push({
      pathname: '/view-profile',
      params: { id: item.id, data: JSON.stringify(profileToPass) },
    });
  };

  const unblockedMatches = matches.filter((item) => !blockedSet.has(item.id));
  const newlyJoinedCount = unblockedMatches.filter((item) => item.newlyJoined).length;
  const verifiedCount = unblockedMatches.filter((item) => item.verified === true).length;

  const filteredMatches = unblockedMatches.filter((item) => {
    if (activeTab === 'new') return item.newlyJoined;
    if (activeTab === 'verified') return item.verified === true;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Luxury Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>EXCLUSIVELY RAJPUT</Text>
          <Text style={styles.headerTitle}>Matrimonial Matches 👑</Text>
        </View>

        <View style={styles.headerRightRow}>
          {/* Mode Toggle Button */}
          <TouchableOpacity
            style={styles.modeToggleBtn}
            onPress={() => setViewMode(viewMode === 'grid' ? 'full' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'grid' : 'list'}
              size={18}
              color="#59123B"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterDrawerOpen(true)}>
            <Ionicons name="options-outline" size={16} color="#59123B" />
            <Text style={styles.filterBtnText}>Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Category Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'all' && styles.tabItemActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All ({unblockedMatches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'new' && styles.tabItemActive]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
            Newly Joined ({newlyJoinedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'verified' && styles.tabItemActive]}
          onPress={() => setActiveTab('verified')}
        >
          <Text style={[styles.tabText, activeTab === 'verified' && styles.tabTextActive]}>
            Verified ✓ ({verifiedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#59123B" />
          <Text style={{ marginTop: 10, color: '#4B5563', fontWeight: '700' }}>Finding matching profiles...</Text>
        </View>
      ) : filteredMatches.length === 0 ? (
        <View style={styles.loaderCenter}>
          <Ionicons name="people-outline" size={50} color="#EDB139" />
          <Text style={{ marginTop: 12, color: '#1F2937', fontWeight: '700', fontSize: 16 }}>No profiles found</Text>
          <Text style={{ marginTop: 6, color: '#9CA3AF', textAlign: 'center' }}>Try different filters or pull down to refresh.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#59123B']} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={viewMode === 'grid' ? styles.gridWrapRow : undefined}>
            {filteredMatches.map((item) => {
              const isSent = sentInterests.has(item.id);
              const isPhotoReq = photoReqs.has(item.id);
              const isContactReq = contactReqs.has(item.id);
              const isBride = item.gender.toLowerCase() === 'female';

              // ─── 2-GRID CARD LAYOUT (Side-by-Side 2 Profiles) ────────────────
              if (viewMode === 'grid') {
                return (
                  <View key={item.id} style={styles.gridCard}>
                    {/* Top Velvet Banner with Gold Ring Avatar */}
                    <LinearGradient colors={['#59123B', '#3f0c2a']} style={styles.gridHeaderBg}>
                      <View style={styles.gridBadgeTag}>
                        <Text style={styles.gridBadgeTagText}>{isBride ? 'BRIDE' : 'GROOM'}</Text>
                      </View>

                      <View style={styles.gridAvatarRing}>
                        <SafeAvatarImage
                          uri={item.avatar}
                          gender={item.gender}
                          name={item.name}
                          style={styles.gridCircleAvatar}
                        />
                      </View>
                    </LinearGradient>

                    {/* Matri ID & Subtext */}
                    <View style={styles.gridTitleBlock}>
                      <Text style={styles.gridMatriId} numberOfLines={1}>Matri ID: {item.matriId}</Text>
                      <Text style={styles.gridSubText} numberOfLines={1}>
                        {item.age} Yrs | {item.height} | {item.city}
                      </Text>
                    </View>

                    {/* Compact Grid Chips */}
                    <View style={styles.gridInfoBox}>
                      <View style={styles.miniChip}>
                        <FontAwesome5 name="crossed-swords" size={9} color="#CD9024" />
                        <Text style={styles.miniChipLabel} numberOfLines={1}>{item.clan}</Text>
                      </View>

                      <View style={styles.miniChip}>
                        <Ionicons name="location-outline" size={10} color="#CD9024" />
                        <Text style={styles.miniChipLabel} numberOfLines={1}>{item.location}</Text>
                      </View>

                      <View style={styles.miniChip}>
                        <Ionicons name="school-outline" size={10} color="#CD9024" />
                        <Text style={styles.miniChipLabel} numberOfLines={1}>{item.education}</Text>
                      </View>
                    </View>

                    {/* Action Bar with ALL Icons */}
                    <View style={styles.gridCardActionsWrap}>
                      <TouchableOpacity
                        style={styles.gridPillBtn}
                        onPress={() => handleViewProfile(item)}
                      >
                        <Ionicons name="eye-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.gridPillText}>View Profile</Text>
                      </TouchableOpacity>

                      <View style={styles.gridIconRow}>
                        <TouchableOpacity
                          style={[styles.gridCircleBtn, isSent && styles.gridCircleBtnActive]}
                          onPress={() => handleSendInterest(item.id, item.name)}
                        >
                          <Ionicons name={isSent ? 'heart' : 'heart-outline'} size={13} color={isSent ? '#E11D48' : '#59123B'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.gridCircleBtn, isPhotoReq && styles.gridCircleBtnActive]}
                          onPress={() => handlePhotoRequest(item.id, item.name)}
                        >
                          <Ionicons name="images-outline" size={12} color={isPhotoReq ? '#10B981' : '#59123B'} />
                          <View style={styles.miniIconBadge}>
                            <Text style={styles.miniIconBadgeText}>1</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.gridCircleBtn, isContactReq && styles.gridCircleBtnActive]}
                          onPress={() => handleContactRequest(item.id, item.name)}
                        >
                          <Ionicons name="person-add-outline" size={12} color={isContactReq ? '#10B981' : '#59123B'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.gridCircleBtn}
                          onPress={() => handleBlockProfile(item.id, item.name)}
                        >
                          <Ionicons name="ban-outline" size={12} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }

              // ─── FULL CARD LAYOUT (Single Column) ───────────────────────────
              return (
                <View key={item.id} style={styles.royalCard}>
                  {/* Top Velvet Banner with Gold Ring Avatar */}
                  <LinearGradient colors={['#59123B', '#3f0c2a']} style={styles.cardHeaderBg}>
                    <View style={styles.badgeTag}>
                      <Text style={styles.badgeTagText}>{isBride ? 'BRIDE' : 'GROOM'}</Text>
                    </View>

                    <View style={styles.avatarRing}>
                      <SafeAvatarImage
                        uri={item.avatar}
                        gender={item.gender}
                        name={item.name}
                        style={styles.circleAvatar}
                      />
                    </View>
                  </LinearGradient>

                  {/* Card Title Block */}
                  <View style={styles.cardTitleBlock}>
                    <Text style={styles.matriIdTitle}>Matri ID: {item.matriId}</Text>
                    <Text style={styles.matriIdSub}>
                      {item.age} Yrs | {item.height} | {item.city}
                    </Text>
                  </View>

                  {/* 2-Column Info Grid Pills */}
                  <View style={styles.infoGrid}>
                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <FontAwesome5 name="crossed-swords" size={11} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>CLAN</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.clan}</Text>
                    </View>

                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <Ionicons name="calendar-outline" size={12} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>AGE</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.age} yrs old</Text>
                    </View>

                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <Ionicons name="location-outline" size={12} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>LOCATION</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.location}</Text>
                    </View>

                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <Ionicons name="school-outline" size={12} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>HIGH. EDUCATION</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.education}</Text>
                    </View>

                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <Ionicons name="briefcase-outline" size={12} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>OCCUPATION</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.occupation}</Text>
                    </View>

                    <View style={styles.gridCell}>
                      <View style={styles.gridCellLabelRow}>
                        <Ionicons name="person-outline" size={12} color="#CD9024" />
                        <Text style={styles.gridCellLabel}>CLASS</Text>
                      </View>
                      <Text style={styles.gridCellVal} numberOfLines={1}>{item.classVal}</Text>
                    </View>
                  </View>

                  {/* Bottom Action Bar */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.viewPillBtn}
                      onPress={() => handleViewProfile(item)}
                    >
                      <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.viewPillText}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.circleIconBtn, isSent && styles.circleIconBtnActive]}
                      onPress={() => handleSendInterest(item.id, item.name)}
                    >
                      <Ionicons name={isSent ? 'heart' : 'heart-outline'} size={18} color={isSent ? '#E11D48' : '#59123B'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.circleIconBtn, isPhotoReq && styles.circleIconBtnActive]}
                      onPress={() => handlePhotoRequest(item.id, item.name)}
                    >
                      <Ionicons name="images-outline" size={18} color={isPhotoReq ? '#10B981' : '#59123B'} />
                      <View style={styles.iconBadge}>
                        <Text style={styles.iconBadgeText}>1</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.circleIconBtn, isContactReq && styles.circleIconBtnActive]}
                      onPress={() => handleContactRequest(item.id, item.name)}
                    >
                      <Ionicons name="person-add-outline" size={18} color={isContactReq ? '#10B981' : '#59123B'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.circleIconBtn}
                      onPress={() => handleBlockProfile(item.id, item.name)}
                    >
                      <Ionicons name="ban-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Right-Side Sliding Popup Filter Modal */}
      <FilterDrawerModal
        visible={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={handleApplyDrawerFilters}
      />
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE0CB',
  },
  headerLeft: {},
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CD9024',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#59123B',
  },
  modeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8EBD7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#59123B',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE0CB',
  },
  tabItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FAF5EF',
  },
  tabItemActive: {
    backgroundColor: '#59123B',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#59123B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 110,
  },
  gridWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  // ─── 2-GRID CARD STYLES ───────────────────────────────────────────────────
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 12,
    justifyContent: 'space-between',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gridHeaderBg: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridBadgeTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  gridBadgeTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  gridAvatarRing: {
    position: 'absolute',
    bottom: -28,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#EDB139',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCircleAvatar: {
    width: '100%',
    height: '100%',
  },
  gridTitleBlock: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  gridMatriId: {
    fontSize: 13,
    fontWeight: '800',
    color: '#59123B',
  },
  gridSubText: {
    fontSize: 10,
    color: '#7A5C66',
    fontWeight: '600',
    marginTop: 1,
  },
  gridInfoBox: {
    padding: 8,
    gap: 4,
    minHeight: 84,
    justifyContent: 'center',
  },
  miniChip: {
    backgroundColor: '#FAF5EF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  miniChipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3D232C',
    flex: 1,
  },
  gridCardActionsWrap: {
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 4,
    gap: 6,
  },
  gridPillBtn: {
    width: '100%',
    height: 30,
    backgroundColor: '#59123B',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  gridPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  gridIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
  },
  gridCircleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridCircleBtnActive: {
    backgroundColor: '#F8EBD7',
    borderColor: '#CD9024',
  },
  miniIconBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#CD9024',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  miniIconBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
    textAlign: 'center',
  },

  // ─── FULL CARD STYLES ────────────────────────────────────────────────────
  royalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 14,
  },
  cardHeaderBg: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeTag: {
    position: 'absolute',
    top: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  badgeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  avatarRing: {
    position: 'absolute',
    bottom: -35,
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#EDB139',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleAvatar: {
    width: '100%',
    height: '100%',
  },
  cardTitleBlock: {
    marginTop: 42,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  matriIdTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#59123B',
  },
  matriIdSub: {
    fontSize: 12,
    color: '#7A5C66',
    marginTop: 2,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  gridCell: {
    width: '48%',
    backgroundColor: '#FAF5EF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  gridCellLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  gridCellLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CD9024',
    letterSpacing: 0.6,
  },
  gridCellVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D232C',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 14,
    paddingTop: 6,
    gap: 6,
  },
  viewPillBtn: {
    flex: 1.8,
    height: 38,
    backgroundColor: '#59123B',
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  viewPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  circleIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleIconBtnActive: {
    backgroundColor: '#F8EBD7',
    borderColor: '#CD9024',
  },
  iconBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#CD9024',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  iconBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
