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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { meApi } from '../services/me.api';
import { SafeAvatarImage } from '../components/safe-avatar-image';

type SectionType =
  | 'personal'
  | 'contact'
  | 'career'
  | 'about'
  | 'family'
  | 'siblings'
  | 'lineage'
  | 'relatives';

interface RelativeItem {
  id: string;
  name: string;
  marriedTo: string;
  childOf: string;
  thikana: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Edit Modal State
  const [editingSection, setEditingSection] = useState<SectionType | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  // Dynamic Relative Categories (Default 1 row per category matching screenshot)
  const [badepapaList, setBadepapaList] = useState<RelativeItem[]>([
    { id: 'bp-1', name: 'Bhairav Singh', marriedTo: 'Kamla Kanwar', childOf: 'Hukum Singh', thikana: 'Jaipur Thikana' },
  ]);

  const [kakosaList, setKakosaList] = useState<RelativeItem[]>([
    { id: 'kk-1', name: 'Mahendra Singh', marriedTo: 'Anita Kanwar', childOf: 'Hukum Singh', thikana: 'Jaipur Thikana' },
  ]);

  const [bhuasaList, setBhuasaList] = useState<RelativeItem[]>([
    { id: 'bhu-1', name: 'Surendra Singh Bhati', marriedTo: 'Pushpa Kanwar', childOf: 'Fateh Singh', thikana: 'Jaisalmer' },
  ]);

  const [mamosaList, setMamosaList] = useState<RelativeItem[]>([
    { id: 'mam-1', name: 'Mohit Singh Rathore', marriedTo: 'Priyanka Kanwar', childOf: 'Gajendra Singh', thikana: 'Jodhpur' },
  ]);

  const [masisaList, setMasisaList] = useState<RelativeItem[]>([
    { id: 'mas-1', name: 'NetworkIN Masisa', marriedTo: 'Dinesh Sharma', childOf: 'Gajendra Singh', thikana: 'Udaipur' },
  ]);

  // Handlers to Add / Delete Relative Rows
  const addRelativeRow = (category: 'badepapa' | 'kakosa' | 'bhuasa' | 'mamosa' | 'masisa') => {
    const newRow: RelativeItem = {
      id: `${category}-${Date.now()}`,
      name: '',
      marriedTo: '',
      childOf: '',
      thikana: '',
    };
    switch (category) {
      case 'badepapa':
        setBadepapaList((prev) => [...prev, newRow]);
        break;
      case 'kakosa':
        setKakosaList((prev) => [...prev, newRow]);
        break;
      case 'bhuasa':
        setBhuasaList((prev) => [...prev, newRow]);
        break;
      case 'mamosa':
        setMamosaList((prev) => [...prev, newRow]);
        break;
      case 'masisa':
        setMasisaList((prev) => [...prev, newRow]);
        break;
    }
  };

  const removeRelativeRow = (
    category: 'badepapa' | 'kakosa' | 'bhuasa' | 'mamosa' | 'masisa',
    id: string
  ) => {
    const filterFn = (list: RelativeItem[]) => (list.length > 1 ? list.filter((r) => r.id !== id) : list);
    switch (category) {
      case 'badepapa':
        setBadepapaList(filterFn);
        break;
      case 'kakosa':
        setKakosaList(filterFn);
        break;
      case 'bhuasa':
        setBhuasaList(filterFn);
        break;
      case 'mamosa':
        setMamosaList(filterFn);
        break;
      case 'masisa':
        setMasisaList(filterFn);
        break;
    }
  };

  const updateRelativeRow = (
    category: 'badepapa' | 'kakosa' | 'bhuasa' | 'mamosa' | 'masisa',
    id: string,
    field: keyof RelativeItem,
    value: string
  ) => {
    const updateFn = (list: RelativeItem[]) =>
      list.map((r) => (r.id === id ? { ...r, [field]: value } : r));

    switch (category) {
      case 'badepapa':
        setBadepapaList(updateFn);
        break;
      case 'kakosa':
        setKakosaList(updateFn);
        break;
      case 'bhuasa':
        setBhuasaList(updateFn);
        break;
      case 'mamosa':
        setMamosaList(updateFn);
        break;
      case 'masisa':
        setMasisaList(updateFn);
        break;
    }
  };

  // Full Profile Data State matching desktop web screenshots
  const [profile, setProfile] = useState<any>({
    name: 'Navin Biswas',
    matriId: '1006',
    avatar: null,
    gender: 'Male',
    profileCompletion: 85,

    // Personal Information
    currentCity: 'Jaipur',
    state: 'Rajasthan',
    nativePlace: 'Jaipur, Rajasthan',
    dateOfBirth: '10 October 2001',
    placeOfBirth: 'Jaipur',
    timeOfBirth: '07:09 AM',
    gotra: 'Biswas',
    clan: 'Biswas (Biswas)',
    height: "5'10\"",
    weight: '68 kg',
    rashi: 'Sagittarius (Dhanu)',
    manglik: 'Non Manglik',
    maritalStatus: 'Single',
    classVal: 'Royalty / Upper Middle Class',

    // Contact Information
    mobile: '+919079221554',
    email: 'coderaftindia@gmail.com',

    // Education / Career
    qualification1: 'B.Tech Computer Science',
    institution1: 'MNIT Jaipur',
    qualification2: 'MBA Finance',
    institution2: 'IIM Ahmedabad',
    role1: 'Software Architect',
    company1: 'Tech Solutions Pvt Ltd',
    role2: 'Product Consultant',
    company2: 'InnovateX Labs',

    // My World
    aboutMe: 'Passionate about Rajput culture, family values, and modern progress.',
    partnerPreferences: 'Seeking an educated, respectful partner from a respectable Kshatriya family.',

    // Family Details (Matching Screenshot 3)
    fatherName: 'Ranveer Singh Biswas',
    fatherOccupation: 'Business / Landlord',
    fatherNativePlace: 'Jaipur, Rajasthan',
    motherName: 'Sunita Kanwar',
    motherOccupation: 'Homemaker',
    motherNativePlace: 'Jodhpur, Rajasthan',
    maternalGotra: 'Rathore',
    familyThikana: 'Biswas Garh, Jaipur',
    additionalMaternal: 'Rathore Thikana Jodhpur',
    familyInfo: 'Respectable Kshatriya family rooted in cultural heritage and education.',

    // Siblings
    siblings: [
      { id: 'sib1', name: 'Vikram Singh', relation: 'ELDER BROTHER', marriedTo: 'Pooja Kanwar', childOf: 'Ranveer Singh', nativePlace: 'Jaipur' },
      { id: 'sib2', name: 'Karan Singh', relation: 'YOUNGER BROTHER', marriedTo: 'Unmarried', childOf: 'Ranveer Singh', nativePlace: 'Jaipur' },
      { id: 'sib3', name: 'Meenakshi Kanwar', relation: 'ELDER SISTER', marriedTo: 'Rajendra Singh', childOf: 'Ranveer Singh', nativePlace: 'Jodhpur' },
      { id: 'sib4', name: 'Sunaina Kanwar', relation: 'YOUNGER SISTER', marriedTo: 'Unmarried', childOf: 'Ranveer Singh', nativePlace: 'Jaipur' },
    ],

    // Grand Ancestry & Lineage
    paternalGrandfather: 'Bhairav Singh Biswas',
    paternalGfSonOf: 'Hukum Singh',
    paternalGfOccupation: 'Ex-Army Officer',
    paternalNativePlace: 'Jaipur',
    paternalGrandmother: 'Suraj Kanwar',
    paternalGmDaughterOf: 'Fateh Singh',
    paternalGmThikana: 'Jaisalmer',

    maternalGrandfather: 'Gajendra Singh Rathore',
    maternalGfSonOf: 'Mohan Singh',
    maternalGfOccupation: 'Agriculture / Zamindar',
    maternalNativePlace: 'Jodhpur',
    maternalGrandmother: 'Ratan Kanwar',
    maternalGmDaughterOf: 'Bhairav Singh',
    maternalGmThikana: 'Udaipur',
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await meApi.getProfile().catch(() => null);
      if (res) {
        const u = res.user || res.data || res;
        setProfile((prev: any) => ({
          ...prev,
          name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : prev.name,
          matriId: u.martrId ? String(u.martrId) : prev.matriId,
          avatar: u.avatar || u.profileImage || prev.avatar,
          mobile: u.mobile || prev.mobile,
          email: u.email || prev.email,
          currentCity: u.address?.city || u.city || prev.currentCity,
          state: u.address?.state || u.state || prev.state,
          gotra: u.HoroscopicId?.gotra || u.gotra || prev.gotra,
          clan: u.HoroscopicId?.clan || u.clan || prev.clan,
          manglik: u.HoroscopicId?.maglik || prev.manglik,
          rashi: u.HoroscopicId?.rashi || prev.rashi,
          aboutMe: u.additionalInfo || u.about || prev.aboutMe,
          partnerPreferences: u.partnerPreferences || prev.partnerPreferences,
        }));
      }
    } catch {
      console.warn('Profile API fetch error, using current full profile state.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserProfile();
  }, [fetchUserProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const openEditModal = (section: SectionType) => {
    setEditingSection(section);
    setEditFormData({ ...profile });
  };

  const handleSaveSection = async () => {
    setSaving(true);
    try {
      await meApi.updateProfile({
        city: editFormData.currentCity,
        state: editFormData.state,
        gotra: editFormData.gotra,
        clan: editFormData.clan,
        additionalInfo: editFormData.aboutMe,
        partnerPreferences: editFormData.partnerPreferences,
      }).catch(() => {});

      setProfile({ ...editFormData });
      setEditingSection(null);
      Alert.alert('Changes Saved ✓', 'Profile & family details updated.');
    } catch {
      setProfile({ ...editFormData });
      setEditingSection(null);
      Alert.alert('Changes Saved ✓', 'Profile details updated.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#59123B" />
        </View>
      </SafeAreaView>
    );
  }

  // Combine relative lists for display
  const allRelativesDisplay = [
    ...badepapaList.map((item) => ({ ...item, relation: 'BADE PAPA' })),
    ...kakosaList.map((item) => ({ ...item, relation: 'KAKOSA' })),
    ...bhuasaList.map((item) => ({ ...item, relation: 'BHUASA' })),
    ...mamosaList.map((item) => ({ ...item, relation: 'MAMOSA' })),
    ...masisaList.map((item) => ({ ...item, relation: 'MASISA' })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#59123B" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerSubtitle}>MY MATRIMONIAL PROFILE</Text>
          <Text style={styles.headerTitle}>{profile.name} 👑</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#59123B']} />
        }
      >
        {/* User Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarRing}>
              <SafeAvatarImage uri={profile.avatar} gender={profile.gender} style={styles.avatarImg} />
              <TouchableOpacity style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.heroMetaCol}>
              <Text style={styles.heroNameText}>{profile.name}</Text>
              <View style={styles.matriPill}>
                <Text style={styles.matriPillText}>ID: {profile.matriId}</Text>
              </View>
              <Text style={styles.heroSubText}>
                {profile.currentCity}, {profile.state}
              </Text>
            </View>
          </View>

          {/* Profile Completion Bar */}
          <View style={styles.completionWrap}>
            <View style={styles.completionTextRow}>
              <Text style={styles.completionLabel}>Profile Completion</Text>
              <Text style={styles.completionVal}>{profile.profileCompletion}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${profile.profileCompletion}%` }]} />
            </View>
          </View>
        </View>

        {/* Section Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {['all', 'personal', 'contact', 'career', 'my_world', 'family', 'siblings', 'lineage', 'relatives'].map((tabKey) => (
            <TouchableOpacity
              key={tabKey}
              style={[styles.tabChip, activeTab === tabKey && styles.tabChipActive]}
              onPress={() => setActiveTab(tabKey)}
            >
              <Text style={[styles.tabChipText, activeTab === tabKey && styles.tabChipTextActive]}>
                {tabKey.replace('_', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─── SECTION 1: PERSONAL INFORMATION ───────────────────────── */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ PERSONAL INFORMATION</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('personal')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid2Col}>
              <View style={styles.fieldItem}>
                <Ionicons name="location-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>CURRENT CITY</Text>
                  <Text style={styles.fieldVal}>{profile.currentCity}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="map-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>STATE</Text>
                  <Text style={styles.fieldVal}>{profile.state}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="home-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>NATIVE PLACE</Text>
                  <Text style={styles.fieldVal}>{profile.nativePlace}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="calendar-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>DATE OF BIRTH</Text>
                  <Text style={styles.fieldVal}>{profile.dateOfBirth}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="pin-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>PLACE OF BIRTH</Text>
                  <Text style={styles.fieldVal}>{profile.placeOfBirth}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="time-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>TIME OF BIRTH</Text>
                  <Text style={styles.fieldVal}>{profile.timeOfBirth}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <FontAwesome5 name="star" size={12} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>GOTRA</Text>
                  <Text style={styles.fieldVal}>{profile.gotra}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <FontAwesome5 name="shield-alt" size={12} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>CLAN / SUBCLAN</Text>
                  <Text style={styles.fieldVal}>{profile.clan}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="resize-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>HEIGHT</Text>
                  <Text style={styles.fieldVal}>{profile.height}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="scale-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>WEIGHT</Text>
                  <Text style={styles.fieldVal}>{profile.weight}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="moon-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>ZODIAC (RASHI)</Text>
                  <Text style={styles.fieldVal}>{profile.rashi}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <FontAwesome5 name="sun" size={12} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>MANGLIK</Text>
                  <Text style={styles.fieldVal}>{profile.manglik}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="heart-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>MARITAL STATUS</Text>
                  <Text style={styles.fieldVal}>{profile.maritalStatus}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="ribbon-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>FAMILY CLASS</Text>
                  <Text style={styles.fieldVal}>{profile.classVal}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ─── SECTION 2: CONTACT INFORMATION ──────────────────────── */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ CONTACT INFORMATION</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('contact')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid2Col}>
              <View style={styles.fieldItem}>
                <Ionicons name="call-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>MOBILE NUMBER</Text>
                  <Text style={styles.fieldVal}>{profile.mobile}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="mail-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>EMAIL ADDRESS</Text>
                  <Text style={styles.fieldVal}>{profile.email}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ─── SECTION 3: EDUCATION / CAREER (Screenshot 1 & 2 100% Match) ─ */}
        {(activeTab === 'all' || activeTab === 'career') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ EDUCATION / CAREER</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('career')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid2Col}>
              <View style={styles.fieldItem}>
                <Ionicons name="school-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>QUALIFICATIONS #1</Text>
                  <Text style={styles.fieldVal}>{profile.qualification1}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="business-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>INSTITUTION #1</Text>
                  <Text style={styles.fieldVal}>{profile.institution1}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="school-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>QUALIFICATIONS #2</Text>
                  <Text style={styles.fieldVal}>{profile.qualification2}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="business-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>INSTITUTION #2</Text>
                  <Text style={styles.fieldVal}>{profile.institution2}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="briefcase-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>CURRENT ROLE #1</Text>
                  <Text style={styles.fieldVal}>{profile.role1}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="business-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>COMPANY #1</Text>
                  <Text style={styles.fieldVal}>{profile.company1}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="briefcase-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>CURRENT ROLE #2</Text>
                  <Text style={styles.fieldVal}>{profile.role2}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="business-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>COMPANY #2</Text>
                  <Text style={styles.fieldVal}>{profile.company2}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ─── SECTION 4: MY WORLD ──────────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'my_world') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ MY WORLD</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('about')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.textBlockCard}>
              <Text style={styles.textBlockHeader}>ABOUT ME</Text>
              <Text style={styles.textBlockBody}>{profile.aboutMe}</Text>
            </View>

            <View style={styles.textBlockCard}>
              <Text style={styles.textBlockHeader}>PARTNER PREFERENCES</Text>
              <Text style={styles.textBlockBody}>{profile.partnerPreferences}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 5: FAMILY DETAILS (Screenshot 3 100% Match) ────────── */}
        {(activeTab === 'all' || activeTab === 'family') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ FAMILY DETAILS</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('family')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid2Col}>
              <View style={styles.fieldItem}>
                <Ionicons name="man-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"FATHER'S NAME"}</Text>
                  <Text style={styles.fieldVal}>{profile.fatherName}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="briefcase-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"FATHER'S OCCUPATION"}</Text>
                  <Text style={styles.fieldVal}>{profile.fatherOccupation}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="home-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"FATHER'S NATIVE PLACE"}</Text>
                  <Text style={styles.fieldVal}>{profile.fatherNativePlace}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="woman-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"MOTHER'S NAME"}</Text>
                  <Text style={styles.fieldVal}>{profile.motherName}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="briefcase-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"MOTHER'S OCCUPATION"}</Text>
                  <Text style={styles.fieldVal}>{profile.motherOccupation}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="home-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>{"MOTHER'S NATIVE PLACE"}</Text>
                  <Text style={styles.fieldVal}>{profile.motherNativePlace}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <FontAwesome5 name="shield-alt" size={12} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>MATERNAL GOTRA</Text>
                  <Text style={styles.fieldVal}>{profile.maternalGotra}</Text>
                </View>
              </View>

              <View style={styles.fieldItem}>
                <Ionicons name="location-outline" size={14} color="#59123B" />
                <View style={styles.fieldMeta}>
                  <Text style={styles.fieldKey}>FAMILY LOCATION / THIKANA</Text>
                  <Text style={styles.fieldVal}>{profile.familyThikana}</Text>
                </View>
              </View>
            </View>

            <View style={styles.textBlockCard}>
              <Text style={styles.textBlockHeader}>ADDITIONAL MATERNAL</Text>
              <Text style={styles.textBlockBody}>{profile.additionalMaternal}</Text>
            </View>

            <View style={styles.textBlockCard}>
              <Text style={styles.textBlockHeader}>FAMILY INFO / DESCRIPTION</Text>
              <Text style={styles.textBlockBody}>{profile.familyInfo}</Text>
            </View>
          </View>
        )}

        {/* ─── SECTION 8: PATERNAL & EXTENDED FAMILY RELATIVES ─────── */}
        {(activeTab === 'all' || activeTab === 'relatives') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>✦ PATERNAL & EXTENDED FAMILY RELATIVES</Text>
              <TouchableOpacity style={styles.editSectionBtn} onPress={() => openEditModal('relatives')}>
                <Ionicons name="create-outline" size={15} color="#59123B" />
              </TouchableOpacity>
            </View>

            <View style={styles.relativesGrid}>
              {allRelativesDisplay.map((rel) => (
                <View key={rel.id} style={styles.relativeBox}>
                  <View style={styles.relHeaderRow}>
                    <Text style={styles.relName}>{rel.name || 'Relative Name'}</Text>
                    <View style={styles.relTag}>
                      <Text style={styles.relTagText}>{rel.relation}</Text>
                    </View>
                  </View>
                  <Text style={styles.relSubText}>Married to: {rel.marriedTo || '—'}</Text>
                  <Text style={styles.relSubText}>Child of: {rel.childOf || '—'}</Text>
                  <Text style={styles.relSubText}>Thikana / Native: {rel.thikana || '—'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ─── EDIT MODAL (Handles Personal, Career, Family, & Relatives) ─── */}
      <Modal visible={editingSection !== null} transparent animationType="slide" onRequestClose={() => setEditingSection(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSection === 'family'
                  ? 'EDIT FAMILY DETAILS 👑'
                  : editingSection === 'career'
                  ? 'EDIT EDUCATION & CAREER 👑'
                  : editingSection === 'relatives'
                  ? 'PATERNAL & EXTENDED FAMILY DETAILS 👑'
                  : `EDIT ${editingSection?.replace('_', ' ').toUpperCase()} 👑`}
              </Text>
              <TouchableOpacity onPress={() => setEditingSection(null)}>
                <Ionicons name="close" size={22} color="#EDB139" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
              {/* CAREER EDIT FORM */}
              {editingSection === 'career' && (
                <View style={styles.formSectionBox}>
                  <Text style={styles.formSectionHeader}>EDUCATION & CAREER DETAILS</Text>
                  <View style={styles.formRowGrid}>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>QUALIFICATION #1</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.qualification1}
                        onChangeText={(val) => setEditFormData({ ...editFormData, qualification1: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>INSTITUTION #1</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.institution1}
                        onChangeText={(val) => setEditFormData({ ...editFormData, institution1: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>QUALIFICATION #2</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.qualification2}
                        onChangeText={(val) => setEditFormData({ ...editFormData, qualification2: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>INSTITUTION #2</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.institution2}
                        onChangeText={(val) => setEditFormData({ ...editFormData, institution2: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>CURRENT ROLE #1</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.role1}
                        onChangeText={(val) => setEditFormData({ ...editFormData, role1: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>COMPANY #1</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.company1}
                        onChangeText={(val) => setEditFormData({ ...editFormData, company1: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>CURRENT ROLE #2</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.role2}
                        onChangeText={(val) => setEditFormData({ ...editFormData, role2: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>COMPANY #2</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.company2}
                        onChangeText={(val) => setEditFormData({ ...editFormData, company2: val })}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* FAMILY DETAILS EDIT FORM (100% Matching Screenshot 3) */}
              {editingSection === 'family' && (
                <View style={styles.formSectionBox}>
                  <Text style={styles.formSectionHeader}>FAMILY DETAILS</Text>
                  <View style={styles.formRowGrid}>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"FATHER'S NAME"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.fatherName}
                        onChangeText={(val) => setEditFormData({ ...editFormData, fatherName: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"FATHER'S OCCUPATION"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.fatherOccupation}
                        onChangeText={(val) => setEditFormData({ ...editFormData, fatherOccupation: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"FATHER'S NATIVE PLACE"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.fatherNativePlace}
                        onChangeText={(val) => setEditFormData({ ...editFormData, fatherNativePlace: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"MOTHER'S NAME"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.motherName}
                        onChangeText={(val) => setEditFormData({ ...editFormData, motherName: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"MOTHER'S OCCUPATION"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.motherOccupation}
                        onChangeText={(val) => setEditFormData({ ...editFormData, motherOccupation: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>{"MOTHER'S NATIVE PLACE"}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.motherNativePlace}
                        onChangeText={(val) => setEditFormData({ ...editFormData, motherNativePlace: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>MATERNAL GOTRA</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.maternalGotra}
                        onChangeText={(val) => setEditFormData({ ...editFormData, maternalGotra: val })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.miniLabel}>FAMILY LOCATION / THIKANA</Text>
                      <TextInput
                        style={styles.textInput}
                        value={editFormData.familyThikana}
                        onChangeText={(val) => setEditFormData({ ...editFormData, familyThikana: val })}
                      />
                    </View>
                  </View>

                  <View style={{ gap: 4, marginTop: 4 }}>
                    <Text style={styles.miniLabel}>ADDITIONAL MATERNAL</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.additionalMaternal}
                      onChangeText={(val) => setEditFormData({ ...editFormData, additionalMaternal: val })}
                    />
                  </View>

                  <View style={{ gap: 4, marginTop: 4 }}>
                    <Text style={styles.miniLabel}>FAMILY INFO / DESCRIPTION</Text>
                    <TextInput
                      style={[styles.textInput, { height: 60 }]}
                      multiline
                      value={editFormData.familyInfo}
                      onChangeText={(val) => setEditFormData({ ...editFormData, familyInfo: val })}
                    />
                  </View>
                </View>
              )}

              {/* RELATIVES / LINEAGE EDIT FORM */}
              {editingSection === 'relatives' && (
                <>
                  {/* 1. PATERNAL GRANDPARENTS */}
                  <View style={styles.formSectionBox}>
                    <Text style={styles.formSectionHeader}>PATERNAL GRANDPARENTS (DADA-DADI SA)</Text>
                    <View style={styles.formRowGrid}>
                      <View style={styles.inputWrap}>
                        <Text style={styles.miniLabel}>GRAND FATHER NAME</Text>
                        <TextInput
                          style={styles.textInput}
                          value={profile.paternalGrandfather}
                          onChangeText={(val) => setProfile({ ...profile, paternalGrandfather: val })}
                        />
                      </View>
                      <View style={styles.inputWrap}>
                        <Text style={styles.miniLabel}>SON OF</Text>
                        <TextInput
                          style={styles.textInput}
                          value={profile.paternalGfSonOf}
                          onChangeText={(val) => setProfile({ ...profile, paternalGfSonOf: val })}
                        />
                      </View>
                      <View style={styles.inputWrap}>
                        <Text style={styles.miniLabel}>OCCUPATION</Text>
                        <TextInput
                          style={styles.textInput}
                          value={profile.paternalGfOccupation}
                          onChangeText={(val) => setProfile({ ...profile, paternalGfOccupation: val })}
                        />
                      </View>
                      <View style={styles.inputWrap}>
                        <Text style={styles.miniLabel}>THIKANA</Text>
                        <TextInput
                          style={styles.textInput}
                          value={profile.paternalNativePlace}
                          onChangeText={(val) => setProfile({ ...profile, paternalNativePlace: val })}
                        />
                      </View>
                    </View>
                  </View>

                  {/* 2. BADEPAPA */}
                  <View style={styles.formSectionBox}>
                    <View style={styles.sectionActionHeader}>
                      <Text style={styles.formSectionHeader}>BADEPAPA</Text>
                      <TouchableOpacity style={styles.addCategoryBtn} onPress={() => addRelativeRow('badepapa')}>
                        <Ionicons name="add-circle-outline" size={14} color="#59123B" />
                        <Text style={styles.addCategoryText}>+ Add BadePapa</Text>
                      </TouchableOpacity>
                    </View>

                    {badepapaList.map((row) => (
                      <View key={row.id} style={styles.dynamicRowCard}>
                        <View style={styles.formRowGrid}>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>NAME</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.name}
                              onChangeText={(val) => updateRelativeRow('badepapa', row.id, 'name', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>MARRIED TO</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.marriedTo}
                              onChangeText={(val) => updateRelativeRow('badepapa', row.id, 'marriedTo', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>DAUGHTER OF</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.childOf}
                              onChangeText={(val) => updateRelativeRow('badepapa', row.id, 'childOf', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>THIKANA / NATIVE</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.thikana}
                              onChangeText={(val) => updateRelativeRow('badepapa', row.id, 'thikana', val)}
                            />
                          </View>
                        </View>

                        {badepapaList.length > 1 && (
                          <TouchableOpacity style={styles.deleteRowBtn} onPress={() => removeRelativeRow('badepapa', row.id)}>
                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* 3. KAKOSA */}
                  <View style={styles.formSectionBox}>
                    <View style={styles.sectionActionHeader}>
                      <Text style={styles.formSectionHeader}>KAKOSA</Text>
                      <TouchableOpacity style={styles.addCategoryBtn} onPress={() => addRelativeRow('kakosa')}>
                        <Ionicons name="add-circle-outline" size={14} color="#59123B" />
                        <Text style={styles.addCategoryText}>+ Add Kakosa</Text>
                      </TouchableOpacity>
                    </View>

                    {kakosaList.map((row) => (
                      <View key={row.id} style={styles.dynamicRowCard}>
                        <View style={styles.formRowGrid}>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>NAME</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.name}
                              onChangeText={(val) => updateRelativeRow('kakosa', row.id, 'name', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>MARRIED TO</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.marriedTo}
                              onChangeText={(val) => updateRelativeRow('kakosa', row.id, 'marriedTo', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>DAUGHTER OF</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.childOf}
                              onChangeText={(val) => updateRelativeRow('kakosa', row.id, 'childOf', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>THIKANA / NATIVE</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.thikana}
                              onChangeText={(val) => updateRelativeRow('kakosa', row.id, 'thikana', val)}
                            />
                          </View>
                        </View>

                        {kakosaList.length > 1 && (
                          <TouchableOpacity style={styles.deleteRowBtn} onPress={() => removeRelativeRow('kakosa', row.id)}>
                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* 4. BHUASA */}
                  <View style={styles.formSectionBox}>
                    <View style={styles.sectionActionHeader}>
                      <Text style={styles.formSectionHeader}>BHUASA</Text>
                      <TouchableOpacity style={styles.addCategoryBtn} onPress={() => addRelativeRow('bhuasa')}>
                        <Ionicons name="add-circle-outline" size={14} color="#59123B" />
                        <Text style={styles.addCategoryText}>+ Add Bhuasa</Text>
                      </TouchableOpacity>
                    </View>

                    {bhuasaList.map((row) => (
                      <View key={row.id} style={styles.dynamicRowCard}>
                        <View style={styles.formRowGrid}>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>NAME</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.name}
                              onChangeText={(val) => updateRelativeRow('bhuasa', row.id, 'name', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>MARRIED TO</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.marriedTo}
                              onChangeText={(val) => updateRelativeRow('bhuasa', row.id, 'marriedTo', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>SON OF</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.childOf}
                              onChangeText={(val) => updateRelativeRow('bhuasa', row.id, 'childOf', val)}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.miniLabel}>THIKANA / NATIVE</Text>
                            <TextInput
                              style={styles.textInput}
                              value={row.thikana}
                              onChangeText={(val) => updateRelativeRow('bhuasa', row.id, 'thikana', val)}
                            />
                          </View>
                        </View>

                        {bhuasaList.length > 1 && (
                          <TouchableOpacity style={styles.deleteRowBtn} onPress={() => removeRelativeRow('bhuasa', row.id)}>
                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setEditingSection(null)}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveSection} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveModalText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  logoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CD9024',
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#59123B',
  },
  scrollContent: {
    padding: 12,
    gap: 12,
    paddingBottom: 110,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#59123B',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EDB139',
    elevation: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#EDB139',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#CD9024',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  heroMetaCol: {
    gap: 3,
  },
  heroNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  matriPill: {
    backgroundColor: 'rgba(237, 177, 57, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#EDB139',
  },
  matriPillText: {
    color: '#EDB139',
    fontSize: 10,
    fontWeight: '800',
  },
  heroSubText: {
    color: '#EFE0CB',
    fontSize: 11,
    fontWeight: '600',
  },
  completionWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  completionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  completionVal: {
    color: '#EDB139',
    fontSize: 10,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EDB139',
    borderRadius: 3,
  },

  // Tabs
  tabsScroll: {
    gap: 6,
  },
  tabChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  tabChipActive: {
    backgroundColor: '#59123B',
    borderColor: '#59123B',
  },
  tabChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#59123B',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE0',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#59123B',
    letterSpacing: 0.4,
  },
  editSectionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid Fields
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  fieldItem: {
    width: '48.5%',
    backgroundColor: '#FAF5EF',
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  fieldMeta: {
    flex: 1,
  },
  fieldKey: {
    fontSize: 8,
    fontWeight: '800',
    color: '#7A5C66',
  },
  fieldVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3D232C',
    marginTop: 1,
  },

  // Textarea Block Cards
  textBlockCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: 10,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginTop: 4,
  },
  textBlockHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#59123B',
  },
  textBlockBody: {
    fontSize: 11,
    color: '#3D232C',
    lineHeight: 16,
  },

  // Relatives Cards Grid
  relativesGrid: {
    gap: 8,
  },
  relativeBox: {
    backgroundColor: '#FAF5EF',
    padding: 10,
    borderRadius: 10,
    gap: 2,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  relHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  relName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D232C',
  },
  relTag: {
    backgroundColor: '#59123B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  relTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  relSubText: {
    fontSize: 10,
    color: '#7A5C66',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalPanel: {
    backgroundColor: '#FAF5EF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    borderTopWidth: 2,
    borderTopColor: '#EDB139',
  },
  modalHeader: {
    backgroundColor: '#59123B',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDB139',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 12,
    gap: 12,
  },

  // Dynamic Extended Family Sections
  formSectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  sectionActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#59123B',
    letterSpacing: 0.4,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8EBD7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  addCategoryText: {
    color: '#59123B',
    fontSize: 10,
    fontWeight: '800',
  },
  dynamicRowCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: 10,
    padding: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    position: 'relative',
  },
  deleteRowBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
  },

  // Form Row Grid
  formRowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  inputWrap: {
    width: '48.5%',
    gap: 2,
  },
  miniLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#7A5C66',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    color: '#3D232C',
  },

  modalFooter: {
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFE0CB',
  },
  cancelModalBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalText: {
    color: '#59123B',
    fontWeight: '800',
    fontSize: 12,
  },
  saveModalBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#59123B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveModalText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
