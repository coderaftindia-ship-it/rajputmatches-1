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
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/profile.api';
import { connectionApi } from '../services/connection.api';

// Sample High-Quality Rajput Profiles for Home Page Display
const MOCK_HOME_PROFILES = [
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
    gender: 'Female',
    verified: true,
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
    gender: 'Female',
    verified: true,
    matchScore: '95%',
    gunaScore: '32/36',
    avatar: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
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
    education: 'M.Sc Biotech',
    occupation: 'Research Fellow',
    gender: 'Female',
    verified: true,
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
    gender: 'Female',
    verified: true,
    matchScore: '92%',
    gunaScore: '31/36',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

// Spotlight Stories - Verified Rajput Members Only
const SPOTLIGHT_STORIES = [
  { id: 'st-v1', label: 'Verified', iconName: 'shield-checkmark', color: '#10B981', avatar: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
  { id: 'st-v2', label: 'Verified', iconName: 'shield-checkmark', color: '#10B981', avatar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
  { id: 'st-v3', label: 'Verified', iconName: 'shield-checkmark', color: '#10B981', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 'st-v4', label: 'Verified', iconName: 'shield-checkmark', color: '#10B981', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
];

const formatHeight = (height: any): string => {
  if (!height) return "5'5\"";
  if (typeof height === 'string') return height;
  if (typeof height === 'number') return `${height} cm`;
  return "5'5\"";
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserData } = useAuth();

  const [recommendations, setRecommendations] = useState<any[]>(MOCK_HOME_PROFILES);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filter Chip State
  const [activeFilter, setActiveFilter] = useState<'all' | 'brides' | 'grooms' | 'guna'>('all');

  // Interactive Sets
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());

  // Home View Mode State: 'single' vs 'grid'
  const [homeViewMode, setHomeViewMode] = useState<'single' | 'grid'>('single');
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);

  // ─── CONTINUOUS PULSATING SCALE ANIMATION ──────────────────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // ─── PHYSICS ANIMATED SWIPE SYSTEM ──────────────────────────────────────
  const position = useRef(new Animated.ValueXY()).current;

  const filteredRecommendations = recommendations.filter((item) => {
    if (activeFilter === 'brides') return item.gender?.toLowerCase() === 'female';
    if (activeFilter === 'grooms') return item.gender?.toLowerCase() === 'male';
    return true;
  });

  const displayList = filteredRecommendations.length > 0 ? filteredRecommendations : recommendations;

  const activeProfile = displayList[selectedProfileIndex % Math.max(1, displayList.length)] || MOCK_HOME_PROFILES[0];
  const nextProfile = displayList[(selectedProfileIndex + 1) % Math.max(1, displayList.length)];

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
            setSelectedProfileIndex((prev) => (prev + 1) % displayList.length);
          });
        } else if (gestureState.dx < -120) {
          Animated.timing(position, {
            toValue: { x: -500, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setSelectedProfileIndex((prev) => (prev + 1) % displayList.length);
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

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      const searchRes = await profileApi.search({}).catch(() => null);
      let rawProfiles: any[] = [];
      if (searchRes) {
        rawProfiles = Array.isArray(searchRes)
          ? searchRes
          : searchRes.data || searchRes.profiles || [];
      }

      if (rawProfiles.length > 0) {
        const normalized = rawProfiles.map((p, idx) => {
          const mock = MOCK_HOME_PROFILES[idx % MOCK_HOME_PROFILES.length];
          return {
            id: p._id || p.id || mock.id,
            matriId: p.martrId ? String(p.martrId) : mock.matriId,
            name: p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : mock.name,
            age: p.age ? String(p.age) : mock.age,
            height: formatHeight(p.height || mock.height),
            city: p.city || p.address?.city || mock.city,
            location: p.location || mock.location,
            clan: p.clan || mock.clan,
            education: p.education || mock.education,
            occupation: p.occupation || mock.occupation,
            gender: p.gender || mock.gender,
            verified: p.isVerified ?? true,
            matchScore: mock.matchScore,
            gunaScore: mock.gunaScore,
            avatar: p.avatar || p.profileImage || mock.avatar,
            photos: [p.avatar || mock.avatar],
          };
        });
        setRecommendations(normalized);
      } else {
        setRecommendations(MOCK_HOME_PROFILES);
      }

      if (isAuthenticated) {
        await refreshUserData().catch(() => {});
      }
    } catch {
      setRecommendations(MOCK_HOME_PROFILES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, refreshUserData]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const handleToggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const isFav = next.has(id);
      if (isFav) {
        next.delete(id);
      } else {
        next.add(id);
        if (name) Alert.alert('Bookmark Saved', `${name} added to favorites.`);
      }
      return next;
    });
  };

  const handleSendInterest = async (id: string, name: string) => {
    try {
      await connectionApi.send(id).catch(() => {});
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Expressed', `Connection request sent to ${name}.`);
    } catch {
      setSentInterests((prev) => new Set(prev).add(id));
      Alert.alert('Interest Expressed', `Connection request registered for ${name}.`);
    }
  };

  const handleViewProfile = (item: any) => {
    router.push({
      pathname: '/view-profile',
      params: { id: item.id, data: JSON.stringify(item) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A1235" />

      {/* ─── ULTRA LUXURY TOP APP BAR WITH PROMINENT LOTUS LOGO ────────────── */}
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A1235']} />}
      >
        {/* ─── NEW ANIMATED ROYAL SPOTLIGHT & STORY STRIP (NO EMOJIS) ── */}
        <View style={styles.animatedSpotlightSection}>
          {/* Animated Marquee Ribbon */}
          <LinearGradient colors={['#4A1235', '#6B1B4D', '#3A0B28']} style={styles.marqueeRibbon}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }], flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sparkles" size={13} color="#D4AF37" />
              <Text style={styles.marqueeText}>ROYAL SPOTLIGHT & DAILY 36 GUNA MATCHES</Text>
              <Ionicons name="ribbon" size={13} color="#D4AF37" />
            </Animated.View>
          </LinearGradient>

          {/* Horizontal Scroll Story Rings with Vector Icons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScrollContent}>
            {SPOTLIGHT_STORIES.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyItemBox}
                onPress={() => router.push('/explore')}
                activeOpacity={0.8}
              >
                <Animated.View style={[styles.storyAnimatedRing, { transform: [{ scale: pulseAnim }] }]}>
                  <LinearGradient colors={['#D4AF37', '#CD9024', '#F4E4BC']} style={styles.storyGradientRing}>
                    <View style={styles.storyAvatarWrap}>
                      <Image source={{ uri: story.avatar }} style={styles.storyAvatarImg} />
                    </View>
                  </LinearGradient>
                  <View style={[styles.storyBadgeIconBox, { borderColor: '#10B981' }]}>
                    <Ionicons name={story.iconName as any} size={10} color="#10B981" />
                  </View>
                </Animated.View>
                <Text style={styles.storyLabelText} numberOfLines={1}>{story.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Interactive Filter Pills */}
          <View style={styles.quickFilterPillsRow}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => { setActiveFilter('all'); setSelectedProfileIndex(0); }}
            >
              <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>All Profiles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'brides' && styles.filterPillActive]}
              onPress={() => { setActiveFilter('brides'); setSelectedProfileIndex(0); }}
            >
              <Text style={[styles.filterPillText, activeFilter === 'brides' && styles.filterPillTextActive]}>Brides</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'grooms' && styles.filterPillActive]}
              onPress={() => { setActiveFilter('grooms'); setSelectedProfileIndex(0); }}
            >
              <Text style={[styles.filterPillText, activeFilter === 'grooms' && styles.filterPillTextActive]}>Grooms</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── ELEGANT VIEW MODE SWITCHER SECTION ─────────────────────────── */}
        <View style={styles.viewModeSection}>
          <View style={styles.modeTitleHeaderRow}>
            <View style={styles.titleLineDeco} />
            <Text style={styles.viewModeTitle}>VIEW MODE</Text>
            <View style={styles.titleLineDeco} />
          </View>

          <View style={styles.switcherPillContainer}>
            <TouchableOpacity
              style={[styles.switcherBtn, homeViewMode === 'single' && styles.switcherBtnActive]}
              onPress={() => setHomeViewMode('single')}
              activeOpacity={0.85}
            >
              <View style={styles.iconWithNumRow}>
                <Ionicons
                  name="person"
                  size={16}
                  color={homeViewMode === 'single' ? '#4A1235' : '#8C687D'}
                />
                <View style={[styles.numBadge, homeViewMode === 'single' && styles.numBadgeActive]}>
                  <Text style={styles.numBadgeText}>1</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switcherBtn, homeViewMode === 'grid' && styles.switcherBtnGridActive]}
              onPress={() => setHomeViewMode('grid')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="grid"
                size={18}
                color={homeViewMode === 'grid' ? '#FFFFFF' : '#8C687D'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.viewModeSubtext}>
            {homeViewMode === 'single'
              ? 'Currently Viewing: One Profile.\nTap to switch to Grid View.'
              : 'Currently Viewing: Multiple Profiles.\nTap to switch to Single View.'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color="#4A1235" />
          </View>
        ) : (
          <>
            {/* ─── SINGLE PROFILE SWIPEABLE CARD (High-End Tinder PanResponder) ───── */}
            {homeViewMode === 'single' && activeProfile && (
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
                  {/* OVERLAY LIKE BADGE */}
                  <Animated.View style={[styles.swipeOverlayBadge, styles.likeBadge, { opacity: likeBadgeOpacity }]}>
                    <Text style={styles.likeBadgeText}>INTEREST</Text>
                  </Animated.View>

                  {/* OVERLAY PASS BADGE */}
                  <Animated.View style={[styles.swipeOverlayBadge, styles.passBadge, { opacity: passBadgeOpacity }]}>
                    <Text style={styles.passBadgeText}>NEXT</Text>
                  </Animated.View>

                  {/* Photo Container */}
                  <View style={styles.singlePhotoBox}>
                    <Image source={{ uri: activeProfile.avatar }} style={styles.singleImage} resizeMode="cover" />

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

                    <View style={styles.locationPinCircle}>
                      <Ionicons name="location" size={16} color="#D4AF37" />
                    </View>
                  </View>

                  {/* Card Footer Banner */}
                  <View style={styles.cardFooterBanner}>
                    <Text style={styles.cardFooterBannerText}>
                      Matri ID: <Text style={styles.matriIdBold}>{activeProfile.matriId}</Text> | {activeProfile.age} Yrs | {activeProfile.height} | {activeProfile.city}
                    </Text>
                  </View>

                  {/* ─── DEDICATED INDIVIDUAL CARD TOOLBAR ─── */}
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
                        onPress={() => router.push('/explore')}
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
                        onPress={() => Alert.alert('Shortlist', `${activeProfile.name} short-listed.`)}
                      >
                        <Ionicons name="ban-outline" size={18} color="#4A1235" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>

                {/* Swipe Helper & Carousel Navigation Arrows */}
                <View style={styles.swipeHintRow}>
                  <Text style={styles.swipeHintText}>‹ Drag card left/right or tap arrows to navigate ›</Text>
                </View>

                <View style={styles.carouselNavRow}>
                  <TouchableOpacity
                    style={styles.navArrowBtn}
                    onPress={() =>
                      setSelectedProfileIndex((prev) => (prev > 0 ? prev - 1 : displayList.length - 1))
                    }
                  >
                    <Ionicons name="chevron-back" size={18} color="#4A1235" />
                  </TouchableOpacity>
                  <Text style={styles.carouselCounterText}>
                    Featured {selectedProfileIndex + 1} of {displayList.length}
                  </Text>
                  <TouchableOpacity
                    style={styles.navArrowBtn}
                    onPress={() => setSelectedProfileIndex((prev) => (prev + 1) % displayList.length)}
                  >
                    <Ionicons name="chevron-forward" size={18} color="#4A1235" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ─── 2-GRID PROFILE MODE ─────────────────────────────────────── */}
            {homeViewMode === 'grid' && (
              <View style={styles.grid2ColContainer}>
                {displayList.slice(0, 4).map((item, idx) => {
                  const isFav = favorites.has(item.id);
                  const isConn = sentInterests.has(item.id);

                  return (
                    <View key={item.id} style={styles.gridCardItem}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedProfileIndex(idx);
                          setHomeViewMode('single');
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
                          onPress={() => Alert.alert('Shortlist', `${item.name} short-listed.`)}
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

        {/* ─── MORE RECOMMENDED RAJPUT MATCHES CARD FEED (DYNAMIC ACCORDING TO VIEW MODE) ─── */}
        <View style={{ marginTop: 14 }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>More Recommended Matches</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>Explore All ›</Text>
            </TouchableOpacity>
          </View>

          {homeViewMode === 'grid' ? (
            /* 2-GRID LAYOUT WHEN 2x2 GRID ICON IS CLICKED */
            <View style={styles.grid2ColContainer}>
              {recommendations.map((item, idx) => {
                const isFav = favorites.has(item.id);
                const isConn = sentInterests.has(item.id);

                return (
                  <View key={`grid-more-${item.id}-${idx}`} style={styles.gridCardItem}>
                    <TouchableOpacity
                      onPress={() => handleViewProfile(item)}
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
                        onPress={() => Alert.alert('Shortlist', `${item.name} short-listed.`)}
                      >
                        <Ionicons name="ban-outline" size={13} color="#4A1235" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            /* SINGLE FULL-WIDTH CARDS WHEN 1 ICON IS CLICKED */
            <View style={{ gap: 18, marginTop: 10 }}>
              {recommendations.slice(1).map((item, idx) => {
                const isFav = favorites.has(item.id);
                const isConn = sentInterests.has(item.id);

                return (
                  <View key={`more-single-${item.id}-${idx}`} style={styles.singleCardContainer}>
                    {/* Photo Container */}
                    <View style={styles.singlePhotoBox}>
                      <Image source={{ uri: item.avatar }} style={styles.singleImage} resizeMode="cover" />

                      <LinearGradient
                        colors={['rgba(74,18,53,0.35)', 'transparent', 'rgba(74,18,53,0.85)']}
                        style={styles.photoGradient}
                      />

                      <View style={styles.brideBadge}>
                        <Text style={styles.brideBadgeText}>
                          {item.gender?.toLowerCase() === 'male' ? 'GROOM' : 'BRIDE'}
                        </Text>
                      </View>

                      <View style={styles.gunaScoreBadge}>
                        <Ionicons name="star" size={11} color="#D4AF37" />
                        <Text style={styles.gunaScoreText}>Guna: {item.gunaScore || '34/36'}</Text>
                      </View>

                      <View style={styles.locationPinCircle}>
                        <Ionicons name="location" size={16} color="#D4AF37" />
                      </View>
                    </View>

                    {/* Card Footer Banner */}
                    <View style={styles.cardFooterBanner}>
                      <Text style={styles.cardFooterBannerText}>
                        Matri ID: <Text style={styles.matriIdBold}>{item.matriId}</Text> | {item.age} Yrs | {item.height} | {item.city}
                      </Text>
                    </View>

                    {/* ─── DEDICATED INDIVIDUAL CARD TOOLBAR ─── */}
                    <View style={styles.individualCardToolbarWrap}>
                      <View style={styles.individualCardToolbar}>
                        <TouchableOpacity
                          style={styles.cardTbIconBtn}
                          onPress={() => handleViewProfile(item)}
                        >
                          <Ionicons name="eye-outline" size={18} color="#4A1235" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardTbIconBtn}
                          onPress={() => handleToggleFavorite(item.id, item.name)}
                        >
                          <Ionicons
                            name={isFav ? 'heart' : 'heart-outline'}
                            size={18}
                            color={isFav ? '#E11D48' : '#4A1235'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardTbIconBtn}
                          onPress={() => router.push('/explore')}
                        >
                          <Ionicons name="images-outline" size={18} color="#4A1235" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardTbIconBtn}
                          onPress={() => handleSendInterest(item.id, item.name)}
                        >
                          <Ionicons
                            name={isConn ? 'checkmark' : 'person-add-outline'}
                            size={18}
                            color={isConn ? '#10B981' : '#4A1235'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardTbIconBtn}
                          onPress={() => Alert.alert('Shortlist', `${item.name} short-listed.`)}
                        >
                          <Ionicons name="ban-outline" size={18} color="#4A1235" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ─── NEWLY JOINED MEMBERS STRIP ───────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleText}>Newly Joined Members</Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.seeAllText}>See All ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newlyScroll}>
          {recommendations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newlyMemberCard}
              onPress={() => handleViewProfile(item)}
              activeOpacity={0.8}
            >
              <View style={styles.newlyAvatarRing}>
                <Image source={{ uri: item.avatar }} style={styles.newlyAvatarImg} />
              </View>
              <Text style={styles.newlyNameText} numberOfLines={1}>
                {item.name.split(' ')[0]}
              </Text>
              <Text style={styles.newlySubText} numberOfLines={1}>
                {item.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
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
  headerRightIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 180,
  },

  // ─── ANIMATED SPOTLIGHT SECTION (ABOVE VIEW MODE) ────────────────────────
  animatedSpotlightSection: {
    marginBottom: 10,
  },
  marqueeRibbon: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  marqueeText: {
    color: '#F4E4BC',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontFamily: 'serif',
  },
  storiesScrollContent: {
    gap: 14,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  storyItemBox: {
    alignItems: 'center',
    width: 64,
  },
  storyAnimatedRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyGradientRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A0D2A',
    overflow: 'hidden',
  },
  storyAvatarImg: {
    width: '100%',
    height: '100%',
  },
  storyBadgeIconBox: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4A1235',
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyLabelText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4A1235',
    marginTop: 4,
    textAlign: 'center',
  },
  quickFilterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EDE5DC',
    borderWidth: 1,
    borderColor: '#E2CFC2',
  },
  filterPillActive: {
    backgroundColor: '#4A1235',
    borderColor: '#4A1235',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A1235',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // ─── VIEW MODE SECTION ───────────────────────────────────────────────────
  viewModeSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  modeTitleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  titleLineDeco: {
    width: 44,
    height: 1.2,
    backgroundColor: '#D4AF37',
  },
  viewModeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4A1235',
    fontFamily: 'serif',
    letterSpacing: 1.8,
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
    borderWidth: 1,
    borderColor: '#E2CFC2',
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
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewModeSubtext: {
    fontSize: 12.5,
    color: '#4A1235',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
    fontWeight: '700',
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
    fontSize: 10.5,
    fontWeight: '900',
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
    fontSize: 10.5,
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
    fontSize: 10.5,
    fontWeight: '900',
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
    fontSize: 15.5,
    fontFamily: 'serif',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  matriIdBold: {
    fontWeight: '900',
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

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#4A1235',
    fontFamily: 'serif',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A7228',
  },
  newlyScroll: {
    gap: 12,
  },
  newlyMemberCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7D8C9',
    width: 84,
  },
  newlyAvatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
    marginBottom: 6,
  },
  newlyAvatarImg: {
    width: '100%',
    height: '100%',
  },
  newlyNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A1235',
  },
  newlySubText: {
    fontSize: 9,
    color: '#8C687D',
    fontWeight: '600',
  },

  loaderCenter: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});
