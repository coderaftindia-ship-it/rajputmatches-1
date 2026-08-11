import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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

const safeStr = (val: any, fallback = '—'): string => {
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

export default function ViewProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'about' | 'career' | 'kundali' | 'family' | 'contact' | 'stats' | 'partner'>('all');
  const [interestSent, setInterestSent] = useState<boolean>(false);
  const [shortlisted, setShortlisted] = useState<boolean>(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        if (params.data) {
          const parsed = JSON.parse(params.data as string);
          setProfile(parsed.user || parsed);
        } else if (params.id) {
          const res = await profileApi.getDetails(params.id as string).catch(() => null);
          if (res) {
            setProfile(res.user || res.data || res);
          }
        }
      } catch (e) {
        console.warn('Error parsing profile params:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [params.id, params.data]);

  const handleSendInterest = async () => {
    if (!profile) return;
    const pId = profile._id || profile.id;
    const pName = profile.firstName
      ? `${profile.firstName} ${profile.lastName || ''}`
      : profile.name || 'Member';
    try {
      await connectionApi.send(pId).catch(() => {});
      setInterestSent(true);
      Alert.alert('Interest Sent ❤️', `Connection request sent to ${pName}.`);
    } catch {
      setInterestSent(true);
      Alert.alert('Interest Sent ❤️', `Request sent to ${pName}.`);
    }
  };

  const handleToggleShortlist = async () => {
    if (!profile) return;
    const pId = profile._id || profile.id;
    try {
      if (shortlisted) {
        await profileApi.removeShortlist(pId).catch(() => {});
        setShortlisted(false);
        Alert.alert('Removed ⭐', 'Removed from shortlist.');
      } else {
        await profileApi.addShortlist(pId).catch(() => {});
        setShortlisted(true);
        Alert.alert('Shortlisted ⭐', 'Added to shortlist.');
      }
    } catch {
      setShortlisted(!shortlisted);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#59123B" />
        <ActivityIndicator size="large" color="#59123B" />
        <Text style={styles.loadingText}>Loading Royal Profile...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#59123B" />
        <Ionicons name="person-circle-outline" size={60} color="#EDB139" />
        <Text style={styles.errorText}>Profile Not Found</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()}>
          <Text style={styles.backHomeText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── Extract All Fields from User Object ─────────────────────────────────────
  const firstName = safeStr(profile.firstName, '');
  const middleName = safeStr(profile.middleName, '');
  const lastName = safeStr(profile.lastName, '');
  const fullName = profile.name || `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim() || 'Rajput Member';
  
  let ageVal = '—';
  if (profile.age) {
    ageVal = String(profile.age);
  } else if (profile.dateOfBirth) {
    const dob = new Date(profile.dateOfBirth);
    if (!isNaN(dob.getTime())) {
      ageVal = String(new Date().getFullYear() - dob.getFullYear());
    }
  }

  const heightVal = formatHeight(profile.height);
  const weightVal = profile.weight ? `${profile.weight} kg` : '—';
  const maritalVal = safeStr(profile.maritalStatus, 'Single');
  const genderVal = safeStr(profile.gender, 'Female');
  const profileFor = safeStr(profile.profilefor, 'Myself');
  const matriId = profile.martrId ? `BRH${profile.martrId}` : (profile.id ? String(profile.id).substring(0, 8) : 'BRH1008');

  // Contact & Address
  const emailVal = safeStr(profile.email, '—');
  const mobileVal = safeStr(profile.mobile, '—');
  const countryCode = safeStr(profile.countryCode, '+91');
  const addr = profile.address || {};
  const streetVal = safeStr(addr.street, '');
  const cityVal = safeStr(profile.city || addr.city, 'Jhansi');
  const districtVal = safeStr(addr.district, '');
  const stateVal = safeStr(addr.state, 'Uttar Pradesh');
  const countryVal = safeStr(addr.country, 'India');
  const zipCodeVal = safeStr(addr.zipCode, '');
  const nativePlace = safeStr(profile.nativePlace, '—');

  // Education & Career (profdetailsId)
  const profData = profile.profdetailsId || {};
  const qualList = Array.isArray(profData.qualificationsList) ? profData.qualificationsList : [];
  const occList = Array.isArray(profData.occupationsList) ? profData.occupationsList : [];
  const primaryQual = safeStr(profData.qualifications || qualList[0]?.qualification || profile.education, 'Graduate');
  const primaryOcc = safeStr(profData.professional || occList[0]?.occupation || profile.occupation, 'Professional');
  const annualIncome = safeStr(profData.annualIncome || profile.income, 'Not Disclosed');
  const companyVal = safeStr(profData.company, '');
  const instVal = safeStr(profData.institution, '');
  const hobbiesList = Array.isArray(profData.hobbies) ? profData.hobbies : [];

  // Kundali / Horoscopic (HoroscopicId)
  const horoData = profile.HoroscopicId || {};
  const gotraVal = safeStr(horoData.gotra || profile.gotra, 'Rathore');
  const clanVal = safeStr(horoData.clan || profile.clan, 'Rahore');
  const subclanVal = safeStr(horoData.subclan, '—');
  const rashiVal = safeStr(horoData.rashi || horoData.zodiac, 'Scorpio (Vrishchik)');
  const manglikVal = safeStr(horoData.maglik || horoData.manglik, 'Non Manglik');
  const birthPlace = safeStr(horoData.birthplace || horoData.birthCity || horoData.birthState, 'Jhansi');
  const birthTime = horoData.birthHour ? `${horoData.birthHour}:${horoData.birthMinute || '00'} ${horoData.birthTimePeriod || 'AM'}` : '—';
  const religionVal = safeStr(horoData.religion, 'Hindu');
  const astroInfo = safeStr(horoData.additionalInfo, 'No additional astrological info');

  // Family
  const familyData = typeof profile.familydetailsId === 'object' ? profile.familydetailsId : {};
  const familyInfoText = safeStr(profile.familyInfo, '');
  const fatherName = safeStr(familyData.fatherName, '');
  const fatherOcc = safeStr(familyData.fatherOccupation, '');
  const motherName = safeStr(familyData.motherName, '');
  const motherOcc = safeStr(familyData.motherOccupation, '');

  // About & Partner
  const aboutBio = safeStr(profile.additionalInfo, '');
  const partnerPref = safeStr(profile.partnerPreferences, '');

  // Stats & Activity
  const viewsCount = profile.view || 0;
  const reqSentCount = profile.reqSentCount || (Array.isArray(profile.reqSent) ? profile.reqSent.length : 0);
  const photoReqCount = Array.isArray(profile.photoReqReceived) ? profile.photoReqReceived.length : 0;
  const docReqCount = Array.isArray(profile.documentReqReceived) ? profile.documentReqReceived.length : 0;
  const viewedByCount = Array.isArray(profile.viewedBy) ? profile.viewedBy.length : 0;
  const photos = profile.filesId?.photos || profile.photos || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Fixed Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#EDB139" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle} numberOfLines={1}>{fullName}</Text>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={handleToggleShortlist}>
          <Ionicons name={shortlisted ? 'bookmark' : 'bookmark-outline'} size={20} color={shortlisted ? '#EDB139' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Luxury Hero Banner Card */}
        <LinearGradient colors={['#59123B', '#3f0c2a', '#28051a']} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.matriBadge}>
              <Text style={styles.matriBadgeText}>ID: {matriId}</Text>
            </View>

            <View style={styles.rightBadges}>
              {profile.isApproved && (
                <View style={styles.verifiedTag}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.verifiedTagText}>APPROVED</Text>
                </View>
              )}
              {viewsCount > 0 && (
                <View style={styles.viewsTag}>
                  <Ionicons name="eye" size={12} color="#EDB139" />
                  <Text style={styles.viewsTagText}>{viewsCount} Views</Text>
                </View>
              )}
            </View>
          </View>

          {/* Large Avatar Photo */}
          <View style={styles.avatarWrapper}>
            <SafeAvatarImage
              uri={profile.avatar || profile.profileImage || (photos.length > 0 ? photos[0].url : null)}
              gender={genderVal}
              name={fullName}
              style={styles.heroAvatar}
            />
            {profile.isVerified && (
              <View style={styles.avatarCheckBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>

          <Text style={styles.heroName}>{fullName}</Text>
          <Text style={styles.heroGotra}>
            {clanVal} Clan • Gotra: {gotraVal}
          </Text>
          <Text style={styles.heroSubText}>
            📍 {cityVal}{stateVal ? `, ${stateVal}` : ''}, {countryVal}
          </Text>

          {/* Quick Highlight Pills */}
          <View style={styles.pillGrid}>
            <View style={styles.pillItem}>
              <Text style={styles.pillVal}>{ageVal} yrs</Text>
              <Text style={styles.pillLabel}>Age</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.pillItem}>
              <Text style={styles.pillVal}>{heightVal}</Text>
              <Text style={styles.pillLabel}>Height</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.pillItem}>
              <Text style={styles.pillVal}>{maritalVal}</Text>
              <Text style={styles.pillLabel}>Status</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.pillItem}>
              <Text style={styles.pillVal}>{manglikVal.split(' ')[0]}</Text>
              <Text style={styles.pillLabel}>Manglik</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Structured Tabs Header */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
          >
            <Ionicons name="grid-outline" size={14} color={activeTab === 'all' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>All Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'about' && styles.tabBtnActive]}
            onPress={() => setActiveTab('about')}
          >
            <Ionicons name="person-outline" size={14} color={activeTab === 'about' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'about' && styles.tabBtnTextActive]}>Personal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'career' && styles.tabBtnActive]}
            onPress={() => setActiveTab('career')}
          >
            <Ionicons name="briefcase-outline" size={14} color={activeTab === 'career' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'career' && styles.tabBtnTextActive]}>Career</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'kundali' && styles.tabBtnActive]}
            onPress={() => setActiveTab('kundali')}
          >
            <FontAwesome5 name="sun" size={12} color={activeTab === 'kundali' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'kundali' && styles.tabBtnTextActive]}>Kundali</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'family' && styles.tabBtnActive]}
            onPress={() => setActiveTab('family')}
          >
            <Ionicons name="people-outline" size={14} color={activeTab === 'family' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'family' && styles.tabBtnTextActive]}>Family</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'contact' && styles.tabBtnActive]}
            onPress={() => setActiveTab('contact')}
          >
            <Ionicons name="call-outline" size={14} color={activeTab === 'contact' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'contact' && styles.tabBtnTextActive]}>Location & Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'stats' && styles.tabBtnActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Ionicons name="analytics-outline" size={14} color={activeTab === 'stats' ? '#FFFFFF' : '#59123B'} />
            <Text style={[styles.tabBtnText, activeTab === 'stats' && styles.tabBtnTextActive]}>Activity</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ─── SECTION 1: Personal Information ─────────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'about') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="person" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            {aboutBio ? (
              <View style={styles.bioBox}>
                <Text style={styles.bioTitle}>About {fullName.split(' ')[0]}</Text>
                <Text style={styles.bioText}>{aboutBio}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>First Name</Text>
              <Text style={styles.infoVal}>{firstName || '—'}</Text>
            </View>

            {middleName ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Middle Name</Text>
                <Text style={styles.infoVal}>{middleName}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Last Name (Clan)</Text>
              <Text style={styles.infoVal}>{lastName || '—'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Gender</Text>
              <Text style={styles.infoVal}>{genderVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Age & Height</Text>
              <Text style={styles.infoVal}>{ageVal} yrs ({heightVal})</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Weight</Text>
              <Text style={styles.infoVal}>{weightVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Marital Status</Text>
              <Text style={styles.infoVal}>{maritalVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Profile Created By</Text>
              <Text style={styles.infoVal}>{profileFor}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Native Place</Text>
              <Text style={styles.infoVal}>{nativePlace}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 2: Education & Career ───────────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'career') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="briefcase" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Education & Professional Career</Text>
            </View>

            <View style={styles.highlightCard}>
              <Ionicons name="cash" size={24} color="#59123B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightTitle}>Annual Income</Text>
                <Text style={styles.highlightVal}>{annualIncome}</Text>
              </View>
            </View>

            {/* Qualifications */}
            <Text style={styles.subSectionTitle}>🎓 Qualifications & Degrees</Text>
            {qualList.length > 0 ? (
              qualList.map((item: any, idx: number) => (
                <View key={item._id || idx} style={styles.listItemBox}>
                  <Ionicons name="school-outline" size={18} color="#CD9024" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{safeStr(item.qualification)}</Text>
                    <Text style={styles.itemSub}>{safeStr(item.institution)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.listItemBox}>
                <Ionicons name="school-outline" size={18} color="#CD9024" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{primaryQual}</Text>
                  {instVal ? <Text style={styles.itemSub}>{instVal}</Text> : null}
                </View>
              </View>
            )}

            {/* Occupations */}
            <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>💼 Occupations & Work Experience</Text>
            {occList.length > 0 ? (
              occList.map((item: any, idx: number) => (
                <View key={item._id || idx} style={styles.listItemBox}>
                  <Ionicons name="briefcase-outline" size={18} color="#59123B" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{safeStr(item.occupation)}</Text>
                    <Text style={styles.itemSub}>Company: {safeStr(item.company)}</Text>
                    <Text style={styles.itemSub}>Salary: {safeStr(item.salary)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.listItemBox}>
                <Ionicons name="briefcase-outline" size={18} color="#59123B" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{primaryOcc}</Text>
                  {companyVal ? <Text style={styles.itemSub}>Company: {companyVal}</Text> : null}
                </View>
              </View>
            )}

            {hobbiesList.length > 0 && (
              <>
                <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>🎨 Hobbies & Interests</Text>
                <View style={styles.hobbiesWrap}>
                  {hobbiesList.map((h: any, i: number) => (
                    <View key={i} style={styles.hobbyChip}>
                      <Text style={styles.hobbyChipText}>{safeStr(h)}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ─── SECTION 3: Kundali & Gotra ───────────────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'kundali') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <FontAwesome5 name="sun" size={16} color="#59123B" />
              <Text style={styles.cardTitle}>Horoscope & Religious Details</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Religion</Text>
              <Text style={styles.infoVal}>{religionVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Clan (Kul)</Text>
              <Text style={styles.infoVal}>{clanVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Gotra</Text>
              <Text style={styles.infoVal}>{gotraVal}</Text>
            </View>

            {subclanVal !== '—' && (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Sub-clan (Up-Kul)</Text>
                <Text style={styles.infoVal}>{subclanVal}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Rashi / Zodiac</Text>
              <Text style={styles.infoVal}>{rashiVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Manglik Status</Text>
              <Text style={[styles.infoVal, { color: manglikVal.toLowerCase().includes('non') ? '#10B981' : '#EF4444' }]}>
                {manglikVal}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Birthplace</Text>
              <Text style={styles.infoVal}>{birthPlace}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Time of Birth</Text>
              <Text style={styles.infoVal}>{birthTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Astrological Notes</Text>
              <Text style={styles.infoVal}>{astroInfo}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 4: Family Details ───────────────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'family') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="people" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Family & Heritage Background</Text>
            </View>

            {familyInfoText ? (
              <View style={styles.bioBox}>
                <Text style={styles.bioTitle}>Family Information</Text>
                <Text style={styles.bioText}>{familyInfoText}</Text>
              </View>
            ) : null}

            {fatherName ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{"Father's Name"}</Text>
                <Text style={styles.infoVal}>{fatherName}</Text>
              </View>
            ) : null}

            {fatherOcc ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{"Father's Occupation"}</Text>
                <Text style={styles.infoVal}>{fatherOcc}</Text>
              </View>
            ) : null}

            {motherName ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{"Mother's Name"}</Text>
                <Text style={styles.infoVal}>{motherName}</Text>
              </View>
            ) : null}

            {motherOcc ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{"Mother's Occupation"}</Text>
                <Text style={styles.infoVal}>{motherOcc}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Native Place</Text>
              <Text style={styles.infoVal}>{nativePlace}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Family Location</Text>
              <Text style={styles.infoVal}>{cityVal}, {stateVal}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 5: Location & Address Details ──────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="location" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Location & Address Details</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>City</Text>
              <Text style={styles.infoVal}>{cityVal}</Text>
            </View>

            {districtVal ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>District</Text>
                <Text style={styles.infoVal}>{districtVal}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>State</Text>
              <Text style={styles.infoVal}>{stateVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Country</Text>
              <Text style={styles.infoVal}>{countryVal}</Text>
            </View>

            {streetVal ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Street Address</Text>
                <Text style={styles.infoVal}>{streetVal}</Text>
              </View>
            ) : null}

            {zipCodeVal ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Pincode / Zip</Text>
                <Text style={styles.infoVal}>{zipCodeVal}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Phone Number</Text>
              <Text style={styles.infoVal}>{countryCode} {mobileVal}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Email Address</Text>
              <Text style={styles.infoVal}>{emailVal}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 6: Partner Preferences ───────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'partner') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="heart" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Partner Expectations & Preferences</Text>
            </View>

            <Text style={styles.partnerText}>
              {partnerPref || 'Looking for an understanding, family-oriented partner with strong Kshatriya cultural values and heritage.'}
            </Text>
          </View>
        )}

        {/* ─── SECTION 7: Profile Activity & Stats ───────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'stats') && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="analytics" size={18} color="#59123B" />
              <Text style={styles.cardTitle}>Profile Activity & Request Counters</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatNum}>{viewsCount}</Text>
                <Text style={styles.miniStatLabel}>Profile Views</Text>
              </View>

              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatNum}>{reqSentCount}</Text>
                <Text style={styles.miniStatLabel}>Interests Sent</Text>
              </View>

              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatNum}>{photoReqCount}</Text>
                <Text style={styles.miniStatLabel}>Photo Requests</Text>
              </View>

              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatNum}>{docReqCount}</Text>
                <Text style={styles.miniStatLabel}>Doc Requests</Text>
              </View>

              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatNum}>{viewedByCount}</Text>
                <Text style={styles.miniStatLabel}>Viewed By Users</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.mainActionBtn, interestSent ? styles.interestSentBtn : styles.interestBtn]}
          onPress={handleSendInterest}
          disabled={interestSent}
        >
          <Ionicons name={interestSent ? 'checkmark-circle' : 'heart'} size={18} color="#FFFFFF" />
          <Text style={styles.mainActionText}>{interestSent ? 'Interest Sent' : 'Send Interest'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chatActionBtn}
          onPress={() => router.push('/chat')}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="#59123B" />
          <Text style={styles.chatActionText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#59123B',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
  },
  backHomeBtn: {
    marginTop: 16,
    backgroundColor: '#59123B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#59123B',
  },
  headerBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#EDB139',
    marginHorizontal: 10,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroCard: {
    margin: 14,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(237, 177, 57, 0.35)',
  },
  heroTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matriBadge: {
    backgroundColor: 'rgba(237, 177, 57, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDB139',
  },
  matriBadgeText: {
    color: '#EDB139',
    fontSize: 11,
    fontWeight: '800',
  },
  rightBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  verifiedTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedTagText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  viewsTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsTagText: {
    color: '#EDB139',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarWrapper: {
    position: 'relative',
    marginVertical: 6,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#EDB139',
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#59123B',
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  heroGotra: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EDB139',
    marginTop: 2,
  },
  heroSubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  pillGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pillItem: {
    alignItems: 'center',
  },
  pillVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pillLabel: {
    color: '#EDB139',
    fontSize: 10,
    marginTop: 1,
  },
  pillDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabsScroll: {
    paddingLeft: 14,
    paddingRight: 10,
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  tabBtnActive: {
    backgroundColor: '#59123B',
    borderColor: '#59123B',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#59123B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  cardBox: {
    marginHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8EBD7',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#59123B',
  },
  bioBox: {
    backgroundColor: '#FAF5EF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  bioTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CD9024',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 19,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8EBD7',
  },
  infoKey: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },
  highlightCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 14,
  },
  highlightTitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  highlightVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#59123B',
    marginTop: 2,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#CD9024',
    marginBottom: 8,
  },
  listItemBox: {
    backgroundColor: '#FAF5EF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  itemSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  hobbiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    backgroundColor: '#F8EBD7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  hobbyChipText: {
    color: '#59123B',
    fontSize: 12,
    fontWeight: '700',
  },
  partnerText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
    backgroundColor: '#FAF5EF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  miniStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FAF5EF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  miniStatNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#59123B',
  },
  miniStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFE0CB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },
  mainActionBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  interestBtn: {
    backgroundColor: '#59123B',
  },
  interestSentBtn: {
    backgroundColor: '#10B981',
  },
  mainActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  chatActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F8EBD7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chatActionText: {
    color: '#59123B',
    fontWeight: '800',
    fontSize: 14,
  },
});
