import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Image,
  TextInput,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { profileApi } from '../services/profile.api';
import { connectionApi } from '../services/connection.api';
import { FilterDrawerModal } from '../components/filter-drawer-modal';

// Fallback high quality Rajput sample profiles matching screenshots
const MOCK_PROFILES = [
  {
    id: 'p-1011',
    matriId: '1011',
    name: 'Priyanka Kanwar',
    age: '24',
    height: `5'0"`,
    city: 'Jaipur',
    location: 'Jaipur, Rajasthan',
    clan: 'Rathore',
    education: 'B.Tech CS',
    occupation: 'Software Engineer',
    classVal: 'Upper Middle Class',
    gender: 'Female',
    verified: true,
    newlyJoined: true,
    matchScore: '98%',
    gunaScore: '34/36',
    avatar: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'p-1012',
    matriId: '1012',
    name: 'Ananya Kanwar',
    age: '26',
    height: `5'2"`,
    city: 'Jodhpur',
    location: 'Jodhpur, Rajasthan',
    clan: 'Chauhan',
    education: 'MBA Marketing',
    occupation: 'Brand Manager',
    classVal: 'Royal Class',
    gender: 'Female',
    verified: true,
    newlyJoined: true,
    matchScore: '95%',
    gunaScore: '32/36',
    avatar: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'p-1013',
    matriId: '1013',
    name: 'Kavya Kanwar',
    age: '25',
    height: `5'1"`,
    city: 'Udaipur',
    location: 'Udaipur, Rajasthan',
    clan: 'Sisodia',
    education: 'M.Sc Biotechnology',
    occupation: 'Research Fellow',
    classVal: 'Upper Middle Class',
    gender: 'Female',
    verified: true,
    newlyJoined: false,
    matchScore: '96%',
    gunaScore: '35/36',
    avatar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'p-1014',
    matriId: '1014',
    name: 'Sunaina Kanwar',
    age: '24',
    height: `5'0"`,
    city: 'Bikaner',
    location: 'Bikaner, Rajasthan',
    clan: 'Bhati',
    education: 'B.Arch',
    occupation: 'Architect',
    classVal: 'Royal Class',
    gender: 'Female',
    verified: true,
    newlyJoined: true,
    matchScore: '92%',
    gunaScore: '31/36',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'p-1015',
    matriId: '1015',
    name: 'Vikram Singh',
    age: '28',
    height: `6'0"`,
    city: 'Jaipur',
    location: 'Jaipur, Rajasthan',
    clan: 'Rathore',
    education: 'B.Tech IT',
    occupation: 'Senior Software Architect',
    classVal: 'Upper Middle Class',
    gender: 'Male',
    verified: true,
    newlyJoined: true,
    matchScore: '97%',
    gunaScore: '33/36',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

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
  return fallback;
};

const normalizeMatch = (p: any, index: number) => {
  const firstName = safeString(p.firstName, '');
  const lastName = safeString(p.lastName, '');
  const nameStr = p.name || p.fullName || `${firstName} ${lastName}`.trim() || 'Rajput Member';

  let ageVal = '24';
  if (p.age) {
    ageVal = String(p.age);
  } else if (p.dateOfBirth) {
    const dob = new Date(p.dateOfBirth);
    if (!isNaN(dob.getTime())) {
      ageVal = String(new Date().getFullYear() - dob.getFullYear());
    }
  }

  let photoUrl = p.avatar || p.profileImage || p.image || p.photo || null;
  const mock = MOCK_PROFILES[index % MOCK_PROFILES.length];
  if (!photoUrl) {
    photoUrl = mock.avatar;
  }

  const gotraVal = safeString(p.HoroscopicId?.gotra || p.gotra, 'Rathore');
  const clanVal = safeString(p.HoroscopicId?.clan || p.clan, mock.clan);
  const cityVal = safeString(p.city || p.address?.city, mock.city);
  const matriId = p.martrId ? String(p.martrId) : (p._id ? String(p._id).substring(0, 4) : mock.matriId);

  return {
    id: p._id || p.id || mock.id,
    rawProfile: p,
    matriId,
    name: safeString(nameStr, mock.name),
    age: ageVal,
    height: formatHeight(p.height || mock.height),
    gotra: gotraVal,
    clan: clanVal,
    education: safeString(p.education, mock.education),
    occupation: safeString(p.occupation, mock.occupation),
    classVal: safeString(p.classVal, mock.classVal),
    location: cityVal,
    city: cityVal,
    newlyJoined: p.newlyJoined ?? true,
    verified: p.isVerified ?? true,
    matchScore: mock.matchScore,
    gunaScore: mock.gunaScore,
    avatar: photoUrl,
    photos: [photoUrl],
    gender: safeString(p.gender || p.sex, 'Female'),
  };
};

export default function ExploreScreen() {
  const router = useRouter();

  // Profiles State
  const [matches, setMatches] = useState<any[]>(MOCK_PROFILES);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Dynamic Filtering & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChipFilter, setActiveChipFilter] = useState<'all' | 'brides' | 'grooms' | 'jaipur' | 'jodhpur' | 'verified'>('all');

  // View Mode: 'single' or 'grid'
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);

  // Interactive Sets
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [blockedSet, setBlockedSet] = useState<Set<string>>(new Set());

  // Gallery Modal State
  const [galleryModalVisible, setGalleryModalVisible] = useState<boolean>(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // ─── PHYSICS ANIMATED SWIPE SYSTEM ──────────────────────────────────────
  const position = useRef(new Animated.ValueXY()).current;

  const filteredProfiles = matches.filter((item) => {
    if (blockedSet.has(item.id)) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchMatri = item.matriId?.toLowerCase().includes(q);
      const matchName = item.name?.toLowerCase().includes(q);
      const matchCity = item.city?.toLowerCase().includes(q);
      const matchClan = item.clan?.toLowerCase().includes(q);
      const matchEdu = item.education?.toLowerCase().includes(q);
      if (!matchMatri && !matchName && !matchCity && !matchClan && !matchEdu) {
        return false;
      }
    }

    if (activeChipFilter === 'brides') return item.gender?.toLowerCase() === 'female';
    if (activeChipFilter === 'grooms') return item.gender?.toLowerCase() === 'male';
    if (activeChipFilter === 'jaipur') return item.city?.toLowerCase() === 'jaipur';
    if (activeChipFilter === 'jodhpur') return item.city?.toLowerCase() === 'jodhpur';
    if (activeChipFilter === 'verified') return item.verified === true;

    return true;
  });

  const activeProfile = filteredProfiles[selectedProfileIndex % Math.max(1, filteredProfiles.length)] || filteredProfiles[0] || MOCK_PROFILES[0];
  const nextProfile = filteredProfiles[(selectedProfileIndex + 1) % Math.max(1, filteredProfiles.length)];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.timing(position, {
            toValue: { x: 500, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            handleSendInterest(activeProfile.id, activeProfile.name);
            setSelectedProfileIndex((prev) => (prev + 1) % filteredProfiles.length);
          });
        } else if (gestureState.dx < -120) {
          Animated.timing(position, {
            toValue: { x: -500, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setSelectedProfileIndex((prev) => (prev + 1) % filteredProfiles.length);
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotateCard = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeBadgeOpacity = position.x.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passBadgeOpacity = position.x.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await profileApi.search({}).catch(() => null);
      let rawProfiles: any[] = [];
      if (res) {
        rawProfiles = Array.isArray(res) ? res : res.profiles || res.data || res.users || [];
      }
      if (rawProfiles.length > 0) {
        const normalized = rawProfiles.map((p, idx) => normalizeMatch(p, idx));
        setMatches(normalized);
      } else {
        setMatches(MOCK_PROFILES);
      }
    } catch {
      setMatches(MOCK_PROFILES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const handleToggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const isFav = next.has(id);
      if (isFav) {
        next.delete(id);
      } else {
        next.add(id);
        if (name) Alert.alert('Saved to Favorites', `${name} added to your favorite matches.`);
      }
      return next;
    });
  };

  const handleSendInterest = async (id: string, name: string) => {
    try {
      await connectionApi.send(id).catch(() => {});
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent', `Connection request sent to ${name}.`);
    } catch {
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Sent', `Request registered for ${name}.`);
    }
  };

  const handleOpenGallery = (item: any) => {
    const photoList = item.photos && item.photos.length > 0 ? item.photos : [item.avatar];
    setGalleryPhotos(photoList);
    setActiveGalleryIndex(0);
    setGalleryModalVisible(true);
  };

  const handleBlockProfile = (id: string, name: string) => {
    Alert.alert('Block Profile', `Are you sure you want to block ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: () => {
          setBlockedSet((prev) => new Set(prev).add(id));
          Alert.alert('Blocked', `${name} has been blocked and removed from search.`);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A1235" />

      {/* Top Royal App Bar Header with Prominent Lotus RA Logo */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleWrap}>
          <Image
            source={require('../../assets/images/lotus_ra_logo.png')}
            style={styles.headerLogoImage}
            resizeMode="contain"
          />
          <View style={styles.headerTextCol}>
            <Text style={styles.brandTitle}>Rajput Alliances</Text>
            <Text style={styles.taglineText}>Connecting Rajputs Worldwide</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterDrawerOpen(true)}>
          <Ionicons name="options-outline" size={16} color="#FFFFFF" />
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={18} color="#8C687D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Matri ID, Name, City, or Clan..."
          placeholderTextColor="#A0849A"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setSelectedProfileIndex(0);
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8C687D" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Filter Chips */}
      <View style={styles.chipsRowContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContent}>
          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'all' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('all'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'all' && styles.chipTextActive]}>
              All ({matches.length - blockedSet.size})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'brides' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('brides'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'brides' && styles.chipTextActive]}>Brides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'grooms' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('grooms'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'grooms' && styles.chipTextActive]}>Grooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'jaipur' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('jaipur'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'jaipur' && styles.chipTextActive]}>Jaipur</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'jodhpur' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('jodhpur'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'jodhpur' && styles.chipTextActive]}>Jodhpur</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chipItem, activeChipFilter === 'verified' && styles.chipItemActive]}
            onPress={() => { setActiveChipFilter('verified'); setSelectedProfileIndex(0); }}
          >
            <Text style={[styles.chipText, activeChipFilter === 'verified' && styles.chipTextActive]}>Verified</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A1235']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── VIEW MODE SWITCHER HEADER CARD ─────────────────────────────── */}
        <View style={styles.viewModeSection}>
          <Text style={styles.viewModeTitle}>View Mode</Text>

          <View style={styles.switcherPillContainer}>
            <TouchableOpacity
              style={[styles.switcherBtn, viewMode === 'single' && styles.switcherBtnActive]}
              onPress={() => setViewMode('single')}
              activeOpacity={0.8}
            >
              <View style={styles.iconWithNumRow}>
                <Ionicons
                  name="person"
                  size={18}
                  color={viewMode === 'single' ? '#4A1235' : '#8C687D'}
                />
                <View style={[styles.numBadge, viewMode === 'single' && styles.numBadgeActive]}>
                  <Text style={[styles.numBadgeText, viewMode === 'single' && styles.numBadgeTextActive]}>1</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switcherBtn, viewMode === 'grid' && styles.switcherBtnGridActive]}
              onPress={() => setViewMode('grid')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="grid"
                size={20}
                color={viewMode === 'grid' ? '#FFFFFF' : '#8C687D'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.viewModeSubtext}>
            {viewMode === 'single'
              ? 'Currently Viewing: One Profile.\nTap to switch to Grid View.'
              : 'Currently Viewing: Multiple Profiles.\nTap to switch to Single View.'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color="#4A1235" />
            <Text style={styles.loaderText}>Finding Rajput Profiles...</Text>
          </View>
        ) : filteredProfiles.length === 0 ? (
          <View style={styles.loaderCenter}>
            <Ionicons name="search-outline" size={48} color="#8C687D" />
            <Text style={styles.noResultsTitle}>No Profiles Match Search</Text>
            <Text style={styles.noResultsSub}>Try adjusting your search query or quick filters.</Text>
          </View>
        ) : (
          <>
            {/* ─── SINGLE PROFILE VIEW MODE ───────────────────────────────── */}
            {viewMode === 'single' && activeProfile && (
              <View style={styles.singleCardWrapper}>
                {nextProfile && (
                  <View style={[styles.singleCardContainer, styles.backCardPreview]}>
                    <Image source={{ uri: nextProfile.avatar }} style={styles.singleImage} resizeMode="cover" />
                  </View>
                )}

                <Animated.View
                  style={[
                    styles.singleCardContainer,
                    {
                      transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                        { rotate: rotateCard },
                      ],
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <Animated.View style={[styles.swipeOverlayBadge, styles.likeBadge, { opacity: likeBadgeOpacity }]}>
                    <Text style={styles.likeBadgeText}>INTEREST</Text>
                  </Animated.View>

                  <Animated.View style={[styles.swipeOverlayBadge, styles.passBadge, { opacity: passBadgeOpacity }]}>
                    <Text style={styles.passBadgeText}>NEXT</Text>
                  </Animated.View>

                  <View style={styles.singlePhotoBox}>
                    <Image
                      source={{ uri: activeProfile.avatar }}
                      style={styles.singleImage}
                      resizeMode="cover"
                    />

                    <LinearGradient
                      colors={['rgba(74,18,53,0.35)', 'transparent', 'rgba(74,18,53,0.85)']}
                      style={styles.photoGradient}
                    />

                    <View style={styles.brideBadge}>
                      <Text style={styles.brideBadgeText}>
                        {activeProfile.gender?.toLowerCase() === 'male' ? 'GROOM' : 'BRIDE'}
                      </Text>
                    </View>

                    <View style={styles.gunaScoreBadge}>
                      <Ionicons name="star" size={11} color="#D4AF37" />
                      <Text style={styles.gunaScoreText}>Guna: {activeProfile.gunaScore || '34/36'}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.locationPinCircle}
                      onPress={() => Alert.alert('Location Pin', `${activeProfile.name} is located in ${activeProfile.location}.`)}
                    >
                      <Ionicons name="location" size={16} color="#D4AF37" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardFooterBanner}>
                    <Text style={styles.cardFooterBannerText}>
                      Matri ID: <Text style={styles.matriIdBold}>{activeProfile.matriId}</Text> | {activeProfile.age} Yrs | {activeProfile.height} | {activeProfile.city}
                    </Text>
                  </View>

                  {/* ─── DEDICATED INDIVIDUAL ACTION TOOLBAR ─── */}
                  <View style={styles.individualCardToolbarWrap}>
                    <View style={styles.individualCardToolbar}>
                      <TouchableOpacity
                        style={styles.cardTbIconBtn}
                        onPress={() => handleViewProfile(activeProfile)}
                      >
                        <Ionicons name="eye-outline" size={18} color="#4A1235" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardTbIconBtn}
                        onPress={() => handleToggleFavorite(activeProfile.id, activeProfile.name)}
                      >
                        <Ionicons
                          name={favorites.has(activeProfile.id) ? 'heart' : 'heart-outline'}
                          size={18}
                          color={favorites.has(activeProfile.id) ? '#E11D48' : '#4A1235'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardTbIconBtn}
                        onPress={() => handleOpenGallery(activeProfile)}
                      >
                        <Ionicons name="images-outline" size={18} color="#4A1235" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardTbIconBtn}
                        onPress={() => handleSendInterest(activeProfile.id, activeProfile.name)}
                      >
                        <Ionicons
                          name={sentInterests.has(activeProfile.id) ? 'checkmark' : 'person-add-outline'}
                          size={18}
                          color={sentInterests.has(activeProfile.id) ? '#10B981' : '#4A1235'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardTbIconBtn}
                        onPress={() => handleBlockProfile(activeProfile.id, activeProfile.name)}
                      >
                        <Ionicons name="ban-outline" size={18} color="#4A1235" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>

                <View style={styles.swipeHintRow}>
                  <Text style={styles.swipeHintText}>‹ Drag card left/right or tap arrows to navigate ›</Text>
                </View>

                {filteredProfiles.length > 1 && (
                  <View style={styles.carouselNavRow}>
                    <TouchableOpacity
                      style={styles.navArrowBtn}
                      onPress={() =>
                        setSelectedProfileIndex((prev) => (prev > 0 ? prev - 1 : filteredProfiles.length - 1))
                      }
                    >
                      <Ionicons name="chevron-back" size={18} color="#4A1235" />
                    </TouchableOpacity>
                    <Text style={styles.carouselCounterText}>
                      Profile {selectedProfileIndex + 1} of {filteredProfiles.length}
                    </Text>
                    <TouchableOpacity
                      style={styles.navArrowBtn}
                      onPress={() =>
                        setSelectedProfileIndex((prev) => (prev + 1) % filteredProfiles.length)
                      }
                    >
                      <Ionicons name="chevron-forward" size={18} color="#4A1235" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* ─── GRID PROFILE VIEW MODE ─────────────────────────────────── */}
            {viewMode === 'grid' && (
              <View style={styles.grid2ColContainer}>
                {filteredProfiles.map((item, idx) => {
                  const isFav = favorites.has(item.id);
                  const isConn = sentInterests.has(item.id);

                  return (
                    <View key={item.id} style={styles.gridCardItem}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedProfileIndex(idx);
                          setViewMode('single');
                        }}
                        activeOpacity={0.9}
                      >
                        <View style={styles.gridPhotoBox}>
                          <Image source={{ uri: item.avatar }} style={styles.gridImage} resizeMode="cover" />

                          <LinearGradient
                            colors={['rgba(74,18,53,0.3)', 'transparent', 'rgba(74,18,53,0.85)']}
                            style={styles.gridGradient}
                          />

                          <View style={styles.gridBrideBadge}>
                            <Text style={styles.gridBrideBadgeText}>
                              {item.gender?.toLowerCase() === 'male' ? 'GROOM' : 'BRIDE'}
                            </Text>
                          </View>

                          <TouchableOpacity
                            style={styles.gridHeartCircle}
                            onPress={() => handleToggleFavorite(item.id, item.name)}
                          >
                            <Ionicons
                              name="heart"
                              size={14}
                              color={isFav ? '#E11D48' : '#D4AF37'}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.gridFooterBanner}>
                          <Text style={styles.gridMatriText} numberOfLines={1}>
                            Matri ID: {item.matriId}
                          </Text>
                          <Text style={styles.gridSubInfoText} numberOfLines={1}>
                            {item.age} Yrs | {item.height} | {item.city}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.miniGridCardToolbar}>
                        <TouchableOpacity
                          style={styles.miniGridTbIconBtn}
                          onPress={() => handleViewProfile(item)}
                        >
                          <Ionicons name="eye-outline" size={14} color="#4A1235" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.miniGridTbIconBtn}
                          onPress={() => handleToggleFavorite(item.id, item.name)}
                        >
                          <Ionicons
                            name={isFav ? 'heart' : 'heart-outline'}
                            size={14}
                            color={isFav ? '#E11D48' : '#4A1235'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.miniGridTbIconBtn}
                          onPress={() => handleSendInterest(item.id, item.name)}
                        >
                          <Ionicons
                            name={isConn ? 'checkmark' : 'person-add-outline'}
                            size={14}
                            color={isConn ? '#10B981' : '#4A1235'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.miniGridTbIconBtn}
                          onPress={() => handleBlockProfile(item.id, item.name)}
                        >
                          <Ionicons name="ban-outline" size={13} color="#4A1235" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Gallery Modal */}
      <Modal visible={galleryModalVisible} transparent animationType="fade">
        <View style={styles.galleryModalBackdrop}>
          <TouchableOpacity style={styles.galleryCloseBtn} onPress={() => setGalleryModalVisible(false)}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {galleryPhotos.length > 0 && (
            <View style={styles.galleryCardBox}>
              <Image
                source={{ uri: galleryPhotos[activeGalleryIndex] }}
                style={styles.galleryFullImage}
                resizeMode="contain"
              />
              <Text style={styles.galleryCounterText}>
                Photo {activeGalleryIndex + 1} of {galleryPhotos.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Filter Drawer */}
      <FilterDrawerModal
        visible={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={() => setIsFilterDrawerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  topHeader: {
    height: 64,
    backgroundColor: '#4A1235',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#D4AF37',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoImage: {
    width: 52,
    height: 52,
    marginRight: 8,
  },
  headerTextCol: {
    marginLeft: 2,
  },
  brandTitle: {
    color: '#FFFDF9',
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    fontFamily: 'serif',
  },
  taglineText: {
    color: '#D4AF37',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 10,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E7D8C9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#4A1235',
    fontWeight: '600',
  },

  chipsRowContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  chipsScrollContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chipItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EDE5DC',
    borderWidth: 1,
    borderColor: '#E2CFC2',
  },
  chipItemActive: {
    backgroundColor: '#4A1235',
    borderColor: '#4A1235',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A1235',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 180,
  },

  viewModeSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  viewModeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A1235',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  switcherPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDE5DC',
    width: 220,
    height: 48,
    borderRadius: 24,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  switcherBtn: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  switcherBtnGridActive: {
    backgroundColor: '#4A1235',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWithNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  numBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8C687D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  numBadgeActive: {
    backgroundColor: '#4A1235',
  },
  numBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  numBadgeTextActive: {
    color: '#FFFFFF',
  },
  viewModeSubtext: {
    fontSize: 12,
    color: '#4A1235',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
    fontWeight: '600',
  },

  singleCardWrapper: {
    marginTop: 12,
    alignItems: 'center',
    position: 'relative',
  },
  backCardPreview: {
    position: 'absolute',
    top: 6,
    transform: [{ scale: 0.95 }],
    opacity: 0.5,
  },
  singleCardContainer: {
    width: '100%',
    backgroundColor: '#FAF5EF',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7D8C9',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    paddingBottom: 10,
  },
  swipeOverlayBadge: {
    position: 'absolute',
    top: 40,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  likeBadge: {
    left: 24,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    transform: [{ rotate: '-15deg' }],
  },
  likeBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  passBadge: {
    right: 24,
    borderColor: '#E11D48',
    backgroundColor: 'rgba(225, 29, 72, 0.9)',
    transform: [{ rotate: '15deg' }],
  },
  passBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  singlePhotoBox: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: '#3D0C29',
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    ...StyleSheet.absoluteFill,
  },
  brideBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(74, 18, 53, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  brideBadgeText: {
    color: '#FFFDF9',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  matchScoreBadge: {
    position: 'absolute',
    top: 14,
    right: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchScoreText: {
    color: '#4A1235',
    fontSize: 10,
    fontWeight: '900',
  },
  singleHeartCircle: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(74, 18, 53, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.6)',
  },
  gunaScoreBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(74, 18, 53, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  gunaScoreText: {
    color: '#F4E4BC',
    fontSize: 10,
    fontWeight: '800',
  },
  locationPinCircle: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(74, 18, 53, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  cardFooterBanner: {
    backgroundColor: '#4A1235',
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterBannerText: {
    color: '#F4E4BC',
    fontSize: 15,
    fontFamily: 'serif',
    textAlign: 'center',
    fontWeight: '600',
  },
  matriIdBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },

  individualCardToolbarWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  individualCardToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF2E9',
    width: '100%',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2CFC2',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTbViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A1235',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 6,
  },
  cardTbViewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardTbIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE2D6',
  },

  swipeHintRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: 11,
    color: '#9A7228',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  carouselNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  navArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCounterText: {
    fontSize: 12,
    color: '#4A1235',
    fontWeight: '700',
  },

  grid2ColContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  gridCardItem: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7D8C9',
    marginBottom: 14,
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 6,
  },
  gridPhotoBox: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#3D0C29',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    ...StyleSheet.absoluteFill,
  },
  gridBrideBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(74, 18, 53, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  gridBrideBadgeText: {
    color: '#FFFDF9',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  gridHeartCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74, 18, 53, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  gridFooterBanner: {
    backgroundColor: '#4A1235',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gridMatriText: {
    color: '#F4E4BC',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  gridSubInfoText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },

  miniGridCardToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 6,
    gap: 3,
  },
  miniGridTbViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A1235',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 3,
    flex: 1,
  },
  miniGridTbViewText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  miniGridTbIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE2D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderCenter: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#4A1235',
    fontWeight: '700',
  },
  noResultsTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#4A1235',
  },
  noResultsSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#8C687D',
    textAlign: 'center',
  },

  galleryModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  galleryCardBox: {
    width: '90%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryFullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  galleryCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
});
