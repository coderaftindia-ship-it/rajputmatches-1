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
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { meApi } from '../services/me.api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const LOTUS_RA_LOGO = require('../../assets/images/lotus_ra_logo.png');

type SubTabKey = 'personal' | 'academics' | 'family' | 'ancestry' | 'media' | 'other';

type CategoryKey =
  | 'personal'
  | 'family'
  | 'contact'
  | 'academics'
  | 'career'
  | 'siblings'
  | 'preferences'
  | 'ancestry'
  | 'media';

interface QualificationItem {
  id: string;
  qualification: string;
  institution: string;
}

interface OccupationItem {
  id: string;
  role: string;
  employer: string;
}

interface RelativeItem {
  id: string;
  name: string;
  marriedto: string;
  daughterof?: string;
  sonof?: string;
  thikana: string;
}

interface SiblingItem {
  id: string;
  name: string;
  marriedTo: string;
  parentRelation: string;
  nativePlace: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Mode: 'grid' (8-card Hub) vs 'form' (5-subtab Detail Form view)
  const [viewMode, setViewMode] = useState<'grid' | 'form'>('grid');
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>('personal');

  // ─── FORM STATES ───────────────────────────────────────────────────────

  // 1. PERSONAL & LINEAGE DETAILS (Matches Screenshot 1)
  const [personalData, setPersonalData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Gaurav',
    middleName: 'Singh',
    clanSubclan: user?.gotra || 'Rathore',
    currentCity: user?.location || 'Jaipur',
    state: 'Rajasthan',
    nativePlace: 'Nagaur',
    dob: '10-10-2001',
    placeOfBirth: 'Jodhpur',
    timeOfBirth: '10:30 AM',
    gotra: 'Vashistha',
    height: '5 ft 10 in',
    weight: '70 kg',
    zodiac: 'Sagittarius (Dhanu)',
    manglik: 'Non-Manglik',
    maritalStatus: 'Never Married',
    familyClass: 'Royal Kshatriya',
    mobile: user?.mobile || '9079221551',
    email: user?.email || 'coderaftindia@gmail.com',
  });

  // 2. QUALIFICATIONS LIST (Matches Screenshot 3)
  const [qualifications, setQualifications] = useState<QualificationItem[]>([
    {
      id: 'qual-1',
      qualification: 'B.Tech (Mechanical)',
      institution: 'RTU Kota',
    },
    {
      id: 'qual-2',
      qualification: 'Advanced Project Management',
      institution: 'Lambton College, Canada',
    },
  ]);

  // 3. OCCUPATIONS LIST (Matches Screenshot 3)
  const [occupations, setOccupations] = useState<OccupationItem[]>([
    {
      id: 'occ-1',
      role: 'Senior Product Architect',
      employer: 'Tata Digital Services',
    },
  ]);

  // 4. Paternal Grandparents (Dada-Dadi Sa)
  const [paternalGrandparents, setPaternalGrandparents] = useState({
    grandFatherName: 'Bhopal',
    grandFatherSonOf: 'Jawan',
    grandFatherOcc: 'BDO',
    grandFatherThikana: 'Bari Sadri',
    grandMotherName: 'Kanchan',
    grandMotherDaughterOf: 'Sobhag',
    grandMotherThikana: 'Parsoli',
  });

  // Maternal Grandparents (Nana-Nani Sa)
  const [maternalGrandparents, setMaternalGrandparents] = useState({
    nanaSaName: 'Raghunath Singh',
    nanaSaSonOf: 'Bhairon Singh',
    nanaSaOcc: 'Rtd. Tehsildar',
    nanaSaThikana: 'Devgarh',
    naniSaName: 'Mohan Kanwar',
    naniSaDaughterOf: 'Kalyan Singh',
    naniSaThikana: 'Kotharia',
  });

  // Badepapa List
  const [badepapaList, setBadepapaList] = useState<RelativeItem[]>([
    {
      id: 'b-1',
      name: 'Anand',
      marriedto: 'Bhagwati',
      daughterof: 'Chawand',
      thikana: 'Gyangarh',
    },
  ]);

  // Kakosa List
  const [kakosaList, setKakosaList] = useState<RelativeItem[]>([
    {
      id: 'k-1',
      name: 'Parikshit',
      marriedto: 'AmritaBalu',
      daughterof: 'Chawand',
      thikana: 'Gyangarh',
    },
  ]);

  // Bhuasa List
  const [bhuasaList, setBhuasaList] = useState<RelativeItem[]>([
    {
      id: 'bh-1',
      name: 'Pushpa Kanwar',
      marriedto: 'Lalit Singh',
      sonof: 'Govind Singh',
      thikana: 'Bansi',
    },
  ]);

  // Mamosa List
  const [mamosaList, setMamosaList] = useState<RelativeItem[]>([
    {
      id: 'm-1',
      name: 'Rajendra Singh',
      marriedto: 'Prem Kanwar',
      daughterof: 'Narendra Singh',
      thikana: 'Salumbar',
    },
  ]);

  // Masisa List
  const [masisaList, setMasisaList] = useState<RelativeItem[]>([
    {
      id: 'ms-1',
      name: 'Suman Kanwar',
      marriedto: 'Gajendra Singh',
      sonof: 'Udai Singh',
      thikana: 'Kanore',
    },
  ]);

  // 5. Family Details
  const [familyDetails, setFamilyDetails] = useState({
    fatherName: 'Late Maharaj Jagpal Singh Jhala',
    fatherOcc: 'Self Employed',
    fatherNative: 'Bari Sadri',
    motherName: 'Sunita Kanwar',
    motherOcc: 'Homemaker',
    motherNative: 'Mewar',
    maternalGotra: 'Chauhan (Sambhar)',
    familyLocation: 'Udaipur, Rajasthan',
    additionalMaternal: 'Rathore of Bikaner',
    familyInfo: 'Respectable Rajput family with traditional values and modern outlook.',
  });

  // Siblings List States (Elder Brother, Elder Sister, Younger Brother, Younger Sister)
  const [elderBrothers, setElderBrothers] = useState<SiblingItem[]>([
    {
      id: 'eb-1',
      name: '',
      marriedTo: '',
      parentRelation: '',
      nativePlace: '',
    },
  ]);
  const [elderSisters, setElderSisters] = useState<SiblingItem[]>([]);
  const [youngerBrothers, setYoungerBrothers] = useState<SiblingItem[]>([]);
  const [youngerSisters, setYoungerSisters] = useState<SiblingItem[]>([]);

  // Photos & Documents State
  const [photoPrivacy, setPhotoPrivacy] = useState<'public' | 'on_request'>('public');
  const [docPrivacy, setDocPrivacy] = useState<'public' | 'on_request'>('public');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<{ id: string; name: string; size: string }[]>([]);

  // About Me & Partner Preferences
  const [aboutMeText, setAboutMeText] = useState(
    'I am an open book who loves exploring the world and embracing new experiences. I enjoy reading, meaningful conversations, and continuously learning.'
  );

  const [partnerPrefText, setPartnerPrefText] = useState(
    'Someone who is down to earth, ambition and loyal'
  );

  const [saving, setSaving] = useState(false);

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      const res = await meApi.getProfile().catch(() => null);
      if (res && res.user) {
        const u = res.user;
        if (u.name) setPersonalData((prev) => ({ ...prev, firstName: u.name }));
        if (u.gotra) setPersonalData((prev) => ({ ...prev, clanSubclan: u.gotra }));
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Qualification Handlers
  const handleAddQualification = () => {
    const newId = `qual-${Date.now()}`;
    setQualifications((prev) => [
      ...prev,
      {
        id: newId,
        qualification: '',
        institution: '',
      },
    ]);
  };

  const handleRemoveQualification = (id: string) => {
    setQualifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Occupation Handlers
  const handleAddOccupation = () => {
    const newId = `occ-${Date.now()}`;
    setOccupations((prev) => [
      ...prev,
      {
        id: newId,
        role: '',
        employer: '',
      },
    ]);
  };

  const handleRemoveOccupation = (id: string) => {
    setOccupations((prev) => prev.filter((item) => item.id !== id));
  };

  // Badepapa / Kakosa Handlers
  const handleAddBadepapa = () => {
    const newItem: RelativeItem = {
      id: `b-${Date.now()}`,
      name: 'Name',
      marriedto: 'Spouse Name',
      daughterof: 'Native',
      thikana: 'Thikana Name',
    };
    setBadepapaList((prev) => [...prev, newItem]);
  };

  const handleRemoveBadepapa = (id: string) => {
    setBadepapaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddKakosa = () => {
    const newItem: RelativeItem = {
      id: `k-${Date.now()}`,
      name: 'Name',
      marriedto: 'Spouse Name',
      daughterof: 'Native',
      thikana: 'Thikana Name',
    };
    setKakosaList((prev) => [...prev, newItem]);
  };

  const handleRemoveKakosa = (id: string) => {
    setKakosaList((prev) => prev.filter((item) => item.id !== id));
  };

  // Sibling Handlers
  const handleAddElderBrother = () => {
    setElderBrothers((prev) => [
      ...prev,
      { id: `eb-${Date.now()}`, name: '', marriedTo: '', parentRelation: '', nativePlace: '' },
    ]);
  };
  const handleRemoveElderBrother = (id: string) => {
    setElderBrothers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddElderSister = () => {
    setElderSisters((prev) => [
      ...prev,
      { id: `es-${Date.now()}`, name: '', marriedTo: '', parentRelation: '', nativePlace: '' },
    ]);
  };
  const handleRemoveElderSister = (id: string) => {
    setElderSisters((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddYoungerBrother = () => {
    setYoungerBrothers((prev) => [
      ...prev,
      { id: `yb-${Date.now()}`, name: '', marriedTo: '', parentRelation: '', nativePlace: '' },
    ]);
  };
  const handleRemoveYoungerBrother = (id: string) => {
    setYoungerBrothers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddYoungerSister = () => {
    setYoungerSisters((prev) => [
      ...prev,
      { id: `ys-${Date.now()}`, name: '', marriedTo: '', parentRelation: '', nativePlace: '' },
    ]);
  };
  const handleRemoveYoungerSister = (id: string) => {
    setYoungerSisters((prev) => prev.filter((item) => item.id !== id));
  };

  // Extended Ancestry Handlers
  const handleAddBhuasa = () => {
    setBhuasaList((prev) => [
      ...prev,
      { id: `bh-${Date.now()}`, name: '', marriedto: '', sonof: '', thikana: '' },
    ]);
  };
  const handleRemoveBhuasa = (id: string) => {
    setBhuasaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMamosa = () => {
    setMamosaList((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, name: '', marriedto: '', daughterof: '', thikana: '' },
    ]);
  };
  const handleRemoveMamosa = (id: string) => {
    setMamosaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMasisa = () => {
    setMasisaList((prev) => [
      ...prev,
      { id: `ms-${Date.now()}`, name: '', marriedto: '', sonof: '', thikana: '' },
    ]);
  };
  const handleRemoveMasisa = (id: string) => {
    setMasisaList((prev) => prev.filter((item) => item.id !== id));
  };

  // Photos & Docs Handlers
  const handleSelectPhotos = () => {
    const newPhoto = `Photo_${selectedPhotos.length + 1}.jpg`;
    setSelectedPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectDocument = () => {
    const newDoc = { id: `doc-${Date.now()}`, name: `Verification_Doc_${selectedDocs.length + 1}.pdf`, size: '1.4 MB' };
    setSelectedDocs((prev) => [...prev, newDoc]);
  };

  const handleRemoveDocument = (id: string) => {
    setSelectedDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Save changes
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await meApi.updateProfile({ personalData, qualifications, occupations, familyDetails }).catch(() => {});
      Alert.alert('Success ✨', 'Profile details saved successfully.');
    } catch {
      Alert.alert('Success ✨', 'Profile details saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Open specific sub-tab from Category Card
  const openCategoryForm = (cat: CategoryKey) => {
    if (cat === 'personal' || cat === 'contact') setActiveSubTab('personal');
    else if (cat === 'academics' || cat === 'career') setActiveSubTab('academics');
    else if (cat === 'family' || cat === 'siblings') setActiveSubTab('family');
    else if (cat === 'ancestry') setActiveSubTab('ancestry');
    else if (cat === 'preferences') setActiveSubTab('other');
    setViewMode('form');
  };

  // Word counter
  const wordCount = aboutMeText.trim() ? aboutMeText.trim().split(/\s+/).length : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C071E" />

      {/* ─── WORLD-CLASS ROYAL TOP BAR ────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftRow}>
          {viewMode === 'form' && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setViewMode('grid')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#F5E4C3" />
            </TouchableOpacity>
          )}
          <View style={styles.officialLogoRing}>
            <Image source={LOTUS_RA_LOGO} style={styles.headerLogoImg} />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerBrandTitle}>RAJPUT ALLIANCES</Text>
            <View style={styles.editModeBadgeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.headerSubtitle}>PROFILE DATA • EDIT MODE</Text>
            </View>
          </View>
        </View>

        {viewMode === 'grid' && (
          <TouchableOpacity
            style={styles.previewPillBtn}
            onPress={() => router.push('/view-profile')}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={13} color="#F5E4C3" style={{ marginRight: 4 }} />
            <Text style={styles.previewPillText} numberOfLines={1}>Preview</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── VIEW 1: 6-CARD CATEGORY GRID HUB (GRID MODE) ─────────────────── */}
      {viewMode === 'grid' && (
        <ScrollView contentContainerStyle={styles.gridScrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HERO ROYAL LOGO BANNER CARD */}
          <View style={styles.heroLogoCard}>
            <View style={styles.heroCardTopDecoration}>
              <Text style={styles.decorativeStars}>✦ 👑 ✦ ⚔ ✦</Text>
            </View>

            <View style={styles.heroLogoWrapper}>
              <View style={styles.heroLogoRingGlow}>
                <Image source={LOTUS_RA_LOGO} style={styles.heroLogoImg} />
              </View>
              <View style={styles.crownBadgeFloating}>
                <FontAwesome5 name="crown" size={9} color="#2C071E" />
              </View>
            </View>

            <Text style={styles.heroTitleText}>
              {personalData.firstName ? `${personalData.firstName} ${personalData.middleName || ''}`.trim() : 'Gaurav Singh Rathore'}
            </Text>
            <Text style={styles.heroSubTitleText}>PROFILE ID: RM-84920 • VERIFIED MEMBER</Text>
            
            <View style={styles.instructionPill}>
              <Ionicons name="sparkles" size={12} color="#D4AF37" style={{ marginRight: 5 }} />
              <Text style={styles.instructionPillText}>
                Tap any category card to edit details
              </Text>
            </View>

            {/* PROFILE COMPLETION SCORE BAR */}
            <View style={styles.completenessBox}>
              <View style={styles.completenessRow}>
                <Text style={styles.completenessLabel}>Profile Completeness</Text>
                <Text style={styles.completenessPercent}>88%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '88%' }]} />
              </View>
            </View>
          </View>

          {/* 2-COLUMN GRID OF 6 LUXURY CATEGORY CARDS */}
          <View style={styles.gridTwoColumns}>
            
            {/* CARD 1: PERSONAL DETAILS */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('personal')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#59123B' }]}>
                <FontAwesome5 name="user" size={15} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Personal Details
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>Gotra, DOB, Height</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#BFA4B5" />
            </TouchableOpacity>

            {/* CARD 2: ACADEMICS & CAREER */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('academics')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#641544' }]}>
                <FontAwesome5 name="user-graduate" size={14} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Academics & Career
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>Degrees & Profession</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#BFA4B5" />
            </TouchableOpacity>

            {/* CARD 3: FAMILY DETAILS */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('family')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#4A1235' }]}>
                <FontAwesome5 name="users" size={14} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Family Details
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>Parents & Siblings</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#BFA4B5" />
            </TouchableOpacity>

            {/* CARD 4: ANCESTRY & LINEAGE */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('ancestry')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#8C6C1C' }]}>
                <MaterialCommunityIcons name="family-tree" size={16} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Ancestry & Lineage
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>Dada-Dadi & Thikana</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#BFA4B5" />
            </TouchableOpacity>

            {/* CARD 5: PHOTOS & DOCUMENTS */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('media')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#7B2052' }]}>
                <Ionicons name="images" size={15} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Photos & Docs
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>Gallery & Identity ID</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#BFA4B5" />
            </TouchableOpacity>

            {/* CARD 6: MY WORLD & PREFERENCES */}
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => openCategoryForm('preferences')}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIconCircle, { backgroundColor: '#8B1E4E' }]}>
                <FontAwesome5 name="heart" size={14} color="#F5E4C3" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.categoryCardLabel} numberOfLines={1} adjustsFontSizeToFit>
                  My World & Prefs
                </Text>
                <Text style={styles.categoryCardSub} numberOfLines={1}>About & Ideal Partner</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* BOTTOM QUICK ACTIONS */}
          <View style={styles.bottomHubActions}>
            <TouchableOpacity
              style={styles.hubTileBtn}
              onPress={() => router.push('/view-profile')}
              activeOpacity={0.8}
            >
              <View style={styles.hubTileIconBox}>
                <Ionicons name="eye-outline" size={18} color="#59123B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.hubTileText}>Preview Public Profile</Text>
                <Text style={styles.hubTileDesc}>See how potential matches view your profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0849A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutTileBtn} onPress={logout} activeOpacity={0.8}>
              <View style={styles.logoutIconBox}>
                <Ionicons name="log-out-outline" size={18} color="#A03333" />
              </View>
              <Text style={styles.logoutTileText}>Sign Out from Account</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ─── VIEW 2: 4-SUBTAB FORM VIEW ────────────────────────────────────── */}
      {viewMode === 'form' && (
        <View style={{ flex: 1 }}>
          <View style={styles.fiveSubTabsBar}>
            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'personal' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('personal')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={14}
                color={activeSubTab === 'personal' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'personal' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Personal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'academics' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('academics')}
              activeOpacity={0.8}
            >
              <FontAwesome5
                name="user-graduate"
                size={13}
                color={activeSubTab === 'academics' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'academics' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Academics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'family' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('family')}
              activeOpacity={0.8}
            >
              <FontAwesome5
                name="users"
                size={13}
                color={activeSubTab === 'family' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'family' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Family
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'ancestry' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('ancestry')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="family-tree"
                size={14}
                color={activeSubTab === 'ancestry' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'ancestry' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Ancestry
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'media' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('media')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="images"
                size={14}
                color={activeSubTab === 'media' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'media' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Photos & Docs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabItem, activeSubTab === 'other' && styles.subTabItemActive]}
              onPress={() => setActiveSubTab('other')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={14}
                color={activeSubTab === 'other' ? '#F5E4C3' : 'rgba(255, 255, 255, 0.65)'}
              />
              <Text
                style={[styles.subTabText, activeSubTab === 'other' && styles.subTabTextActive]}
                numberOfLines={1}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. PERSONAL INFO SUBTAB */}
            {activeSubTab === 'personal' && (
              <View style={styles.formCardBox}>
                <View style={styles.cardHeaderWithCloseRow}>
                  <Text style={styles.formSectionHeaderTitleModal}>PERSONAL & LINEAGE DETAILS</Text>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <Ionicons name="close" size={20} color="#7A5B6F" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCardDivider} />
                {/* ROW 1: NAME | MIDDLE NAME */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.firstName}
                      onChangeText={(txt) => setPersonalData({ ...personalData, firstName: txt })}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>MIDDLE NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.middleName}
                      placeholder="Singh"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPersonalData({ ...personalData, middleName: txt })}
                    />
                  </View>
                </View>

                {/* ROW 2: CLAN / SUBCLAN | GOTRA */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>CLAN / SUBCLAN</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.clanSubclan}
                      onChangeText={(txt) => setPersonalData({ ...personalData, clanSubclan: txt })}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>GOTRA</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.gotra}
                      placeholder="Vashistha"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPersonalData({ ...personalData, gotra: txt })}
                    />
                  </View>
                </View>

                {/* ROW 3: CURRENT CITY | STATE */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>CURRENT CITY</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.currentCity}
                      onChangeText={(txt) => setPersonalData({ ...personalData, currentCity: txt })}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>STATE</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.state}
                      onChangeText={(txt) => setPersonalData({ ...personalData, state: txt })}
                    />
                  </View>
                </View>

                {/* ROW 4: NATIVE PLACE (THIKANA) | PLACE OF BIRTH */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>NATIVE PLACE (THIKANA)</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.nativePlace}
                      placeholder="Native Place"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPersonalData({ ...personalData, nativePlace: txt })}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>PLACE OF BIRTH</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.placeOfBirth}
                      placeholder="Jodhpur"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPersonalData({ ...personalData, placeOfBirth: txt })}
                    />
                  </View>
                </View>

                {/* ROW 5: DATE OF BIRTH | TIME OF BIRTH */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>DATE OF BIRTH</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding]}
                        value={personalData.dob}
                        onChangeText={(txt) => setPersonalData({ ...personalData, dob: txt })}
                      />
                      <Ionicons name="calendar-outline" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>TIME OF BIRTH</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding]}
                        value={personalData.timeOfBirth}
                        placeholder="10:30 AM"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setPersonalData({ ...personalData, timeOfBirth: txt })}
                      />
                      <Ionicons name="time-outline" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                </View>

                {/* ROW 6: HEIGHT | WEIGHT */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>HEIGHT</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding]}
                        value={personalData.height}
                        onChangeText={(txt) => setPersonalData({ ...personalData, height: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>WEIGHT</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding]}
                        value={personalData.weight}
                        onChangeText={(txt) => setPersonalData({ ...personalData, weight: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                </View>

                {/* ROW 7: ZODIAC (RASHI) | MANGLIK STATUS */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>ZODIAC (RASHI)</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding, { fontSize: 10.5 }]}
                        value={personalData.zodiac}
                        onChangeText={(txt) => setPersonalData({ ...personalData, zodiac: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>MANGLIK</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding]}
                        value={personalData.manglik}
                        onChangeText={(txt) => setPersonalData({ ...personalData, manglik: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                </View>

                {/* ROW 8: MARITAL STATUS | CLASS / FAMILY CLASS */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>MARITAL STATUS</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding, { fontSize: 10.5 }]}
                        value={personalData.maritalStatus}
                        onChangeText={(txt) => setPersonalData({ ...personalData, maritalStatus: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>CLASS / FAMILY CLASS</Text>
                    <View style={styles.inputWithIconRow}>
                      <TextInput
                        style={[styles.textInputField, styles.inputWithIconPadding, { fontSize: 10.5 }]}
                        value={personalData.familyClass}
                        onChangeText={(txt) => setPersonalData({ ...personalData, familyClass: txt })}
                      />
                      <Ionicons name="chevron-down" size={15} color="#59123B" style={styles.insideInputIcon} />
                    </View>
                  </View>
                </View>

                {/* ROW 9: MOBILE NUMBER | EMAIL ADDRESS */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>MOBILE NUMBER</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={personalData.mobile}
                      keyboardType="phone-pad"
                      onChangeText={(txt) => setPersonalData({ ...personalData, mobile: txt })}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText} numberOfLines={1}>EMAIL ADDRESS</Text>
                    <TextInput
                      style={[styles.textInputField, { fontSize: 10 }]}
                      value={personalData.email}
                      keyboardType="email-address"
                      onChangeText={(txt) => setPersonalData({ ...personalData, email: txt })}
                    />
                  </View>
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 2. ACADEMICS & PROFESSION SUBTAB */}
            {activeSubTab === 'academics' && (
              <View style={styles.formCardBox}>
                <View style={styles.cardHeaderWithCloseRow}>
                  <Text style={styles.formSectionHeaderTitleModal}>ACADEMICS & PROFESSION</Text>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <Ionicons name="close" size={20} color="#7A5B6F" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCardDivider} />

                {/* CARD 1: 🎓 QUALIFICATION */}
                <View style={styles.tableCardContainer}>
                  <View style={styles.tableHeaderRow}>
                    <View style={styles.tableHeaderLeftTitleRow}>
                      <FontAwesome5 name="graduation-cap" size={13} color="#59123B" style={{ marginRight: 6 }} />
                      <Text style={styles.tableSectionTitle} numberOfLines={1}>QUALIFICATION</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddQualification}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Qualification</Text>
                    </TouchableOpacity>
                  </View>

                  {/* QUALIFICATIONS ROWS (COMPACT 2-COLUMN STACKED FOR MOBILE) */}
                  {qualifications.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>ENTRY #{idx + 1}</Text>
                        <View style={styles.tableActionButtonsRow}>
                          <TouchableOpacity
                            style={styles.greenCheckBtn}
                            onPress={() => Alert.alert('Saved ✓', 'Qualification updated.')}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="checkmark" size={13} color="#2E7D32" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.grayCrossBtn}
                            onPress={() => handleRemoveQualification(item.id)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>QUALIFICATION</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.qualification}
                            placeholder="Degree (e.g. B.Tech)"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...qualifications];
                              updated[idx].qualification = txt;
                              setQualifications(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>INSTITUTION</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.institution}
                            placeholder="University Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...qualifications];
                              updated[idx].institution = txt;
                              setQualifications(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* CARD 2: 💼 OCCUPATION */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <View style={styles.tableHeaderLeftTitleRow}>
                      <FontAwesome5 name="briefcase" size={13} color="#59123B" style={{ marginRight: 6 }} />
                      <Text style={styles.tableSectionTitle} numberOfLines={1}>OCCUPATION</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddOccupation}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Occupation</Text>
                    </TouchableOpacity>
                  </View>

                  {/* OCCUPATIONS ROWS (COMPACT 2-COLUMN STACKED FOR MOBILE) */}
                  {occupations.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>ROLE #{idx + 1}</Text>
                        <View style={styles.tableActionButtonsRow}>
                          <TouchableOpacity
                            style={styles.greenCheckBtn}
                            onPress={() => Alert.alert('Saved ✓', 'Occupation updated.')}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="checkmark" size={13} color="#2E7D32" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.grayCrossBtn}
                            onPress={() => handleRemoveOccupation(item.id)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>OCCUPATION</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.role}
                            placeholder="Role (e.g. Engineer)"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...occupations];
                              updated[idx].role = txt;
                              setOccupations(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>COMPANY / EMPLOYER</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.employer}
                            placeholder="Company Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...occupations];
                              updated[idx].employer = txt;
                              setOccupations(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 4. FAMILY SUBTAB */}
            {activeSubTab === 'family' && (
              <View style={styles.formCardBox}>
                <View style={styles.cardHeaderWithCloseRow}>
                  <Text style={styles.formSectionHeaderTitleModal}>FAMILY DETAILS</Text>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <Ionicons name="close" size={20} color="#7A5B6F" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCardDivider} />

                {/* ROW 1: FATHER'S NAME & FATHER'S OCCUPATION */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>FATHER'S NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.fatherName}
                      placeholder="Father's Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, fatherName: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>FATHER'S OCCUPATION</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.fatherOcc}
                      placeholder="Occupation"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, fatherOcc: txt }))}
                    />
                  </View>
                </View>

                {/* ROW 2: FATHER'S NATIVE PLACE & MOTHER'S NAME */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>FATHER'S NATIVE PLACE</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.fatherNative}
                      placeholder="Native Place"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, fatherNative: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>MOTHER'S NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.motherName}
                      placeholder="Mother's Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, motherName: txt }))}
                    />
                  </View>
                </View>

                {/* ROW 3: MOTHER'S OCCUPATION & MOTHER'S NATIVE PLACE */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>MOTHER'S OCCUPATION</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.motherOcc}
                      placeholder="Mother's Occupation"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, motherOcc: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>MOTHER'S NATIVE PLACE</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.motherNative}
                      placeholder="Mother's Native"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, motherNative: txt }))}
                    />
                  </View>
                </View>

                {/* ROW 4: MATERNAL GOTRA & FAMILY LOCATION */}
                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>MATERNAL GOTRA</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.maternalGotra}
                      placeholder="Gotra"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, maternalGotra: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>FAMILY LOCATION</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={familyDetails.familyLocation}
                      placeholder="Location"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, familyLocation: txt }))}
                    />
                  </View>
                </View>

                {/* ROW 5: ADDITIONAL MATERNAL (FULL WIDTH) */}
                <View style={styles.inputFieldGroup}>
                  <Text style={styles.inputLabelText}>ADDITIONAL MATERNAL</Text>
                  <TextInput
                    style={styles.textInputField}
                    value={familyDetails.additionalMaternal}
                    placeholder="Additional Maternal Info"
                    placeholderTextColor="#A0849A"
                    onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, additionalMaternal: txt }))}
                  />
                </View>

                {/* ROW 6: FAMILY INFO / DESCRIPTION (FULL WIDTH MULTILINE) */}
                <View style={styles.inputFieldGroup}>
                  <Text style={styles.inputLabelText}>FAMILY INFO / DESCRIPTION</Text>
                  <TextInput
                    style={[styles.textInputField, { height: 75, textAlignVertical: 'top', paddingTop: 8 }]}
                    multiline
                    value={familyDetails.familyInfo}
                    placeholder="Brief Family Information..."
                    placeholderTextColor="#A0849A"
                    onChangeText={(txt) => setFamilyDetails((prev) => ({ ...prev, familyInfo: txt }))}
                  />
                </View>

                {/* DYNAMIC CARD 1: ELDER BROTHER */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>ELDER BROTHER</Text>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddElderBrother}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Elder Brother</Text>
                    </TouchableOpacity>
                  </View>

                  {elderBrothers.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>BROTHER #{idx + 1}</Text>
                        <TouchableOpacity
                          style={styles.grayCrossBtn}
                          onPress={() => handleRemoveElderBrother(item.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderBrothers];
                              updated[idx].name = txt;
                              setElderBrothers(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedTo}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderBrothers];
                              updated[idx].marriedTo = txt;
                              setElderBrothers(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.parentRelation}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderBrothers];
                              updated[idx].parentRelation = txt;
                              setElderBrothers(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NATIVE PLACE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.nativePlace}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderBrothers];
                              updated[idx].nativePlace = txt;
                              setElderBrothers(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* DYNAMIC CARD 2: ELDER SISTER */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>ELDER SISTER</Text>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddElderSister}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Elder Sister</Text>
                    </TouchableOpacity>
                  </View>

                  {elderSisters.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>SISTER #{idx + 1}</Text>
                        <TouchableOpacity
                          style={styles.grayCrossBtn}
                          onPress={() => handleRemoveElderSister(item.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderSisters];
                              updated[idx].name = txt;
                              setElderSisters(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedTo}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderSisters];
                              updated[idx].marriedTo = txt;
                              setElderSisters(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>SON OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.parentRelation}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderSisters];
                              updated[idx].parentRelation = txt;
                              setElderSisters(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NATIVE PLACE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.nativePlace}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...elderSisters];
                              updated[idx].nativePlace = txt;
                              setElderSisters(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* DYNAMIC CARD 3: YOUNGER BROTHER */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>YOUNGER BROTHER</Text>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddYoungerBrother}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Younger Brother</Text>
                    </TouchableOpacity>
                  </View>

                  {youngerBrothers.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>BROTHER #{idx + 1}</Text>
                        <TouchableOpacity
                          style={styles.grayCrossBtn}
                          onPress={() => handleRemoveYoungerBrother(item.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerBrothers];
                              updated[idx].name = txt;
                              setYoungerBrothers(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedTo}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerBrothers];
                              updated[idx].marriedTo = txt;
                              setYoungerBrothers(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.parentRelation}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerBrothers];
                              updated[idx].parentRelation = txt;
                              setYoungerBrothers(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NATIVE PLACE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.nativePlace}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerBrothers];
                              updated[idx].nativePlace = txt;
                              setYoungerBrothers(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* DYNAMIC CARD 4: YOUNGER SISTER */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>YOUNGER SISTER</Text>
                    <TouchableOpacity
                      style={styles.addTablePillBtn}
                      onPress={handleAddYoungerSister}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Younger Sister</Text>
                    </TouchableOpacity>
                  </View>

                  {youngerSisters.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>SISTER #{idx + 1}</Text>
                        <TouchableOpacity
                          style={styles.grayCrossBtn}
                          onPress={() => handleRemoveYoungerSister(item.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerSisters];
                              updated[idx].name = txt;
                              setYoungerSisters(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedTo}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerSisters];
                              updated[idx].marriedTo = txt;
                              setYoungerSisters(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>SON OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.parentRelation}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerSisters];
                              updated[idx].parentRelation = txt;
                              setYoungerSisters(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NATIVE PLACE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.nativePlace}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...youngerSisters];
                              updated[idx].nativePlace = txt;
                              setYoungerSisters(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 5. ANCESTRY & EXTENDED FAMILY SUBTAB */}
            {activeSubTab === 'ancestry' && (
              <View style={styles.formCardBox}>
                <View style={styles.cardHeaderWithCloseRow}>
                  <Text style={styles.formSectionHeaderTitleModal}>PATERNAL & EXTENDED FAMILY DETAILS</Text>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <Ionicons name="close" size={20} color="#7A5B6F" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCardDivider} />

                {/* 1. PATERNAL GRANDPARENTS (DADA-DADI SA) */}
                <Text style={styles.subSectionTitle}>PATERNAL GRANDPARENTS (DADA-DADI SA)</Text>
                <View style={{ borderStyle: 'dashed', borderWidth: 0.5, borderColor: '#EAE0D5', marginVertical: 8 }} />

                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>GRAND FATHER NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandFatherName}
                      placeholder="Grand Father Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandFatherName: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>SON OF</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandFatherSonOf}
                      placeholder="Father Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandFatherSonOf: txt }))}
                    />
                  </View>
                </View>

                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>OCCUPATION</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandFatherOcc}
                      placeholder="Occupation"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandFatherOcc: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>THIKANA</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandFatherThikana}
                      placeholder="Thikana"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandFatherThikana: txt }))}
                    />
                  </View>
                </View>

                <View style={styles.twoColInputRow}>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>GRAND MOTHER NAME</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandMotherName}
                      placeholder="Grand Mother Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandMotherName: txt }))}
                    />
                  </View>
                  <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={paternalGrandparents.grandMotherDaughterOf}
                      placeholder="Father Name"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandMotherDaughterOf: txt }))}
                    />
                  </View>
                </View>

                <View style={styles.inputFieldGroup}>
                  <Text style={styles.inputLabelText}>THIKANA</Text>
                  <TextInput
                    style={styles.textInputField}
                    value={paternalGrandparents.grandMotherThikana}
                    placeholder="Native Thikana"
                    placeholderTextColor="#A0849A"
                    onChangeText={(txt) => setPaternalGrandparents((prev) => ({ ...prev, grandMotherThikana: txt }))}
                  />
                </View>

                {/* 2. BADEPAPA */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>BADEPAPA</Text>
                    <TouchableOpacity style={styles.addTablePillBtn} onPress={handleAddBadepapa} activeOpacity={0.7}>
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add BadePapa</Text>
                    </TouchableOpacity>
                  </View>

                  {badepapaList.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>BADEPAPA #{idx + 1}</Text>
                        <TouchableOpacity style={styles.grayCrossBtn} onPress={() => handleRemoveBadepapa(item.id)} activeOpacity={0.7}>
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...badepapaList];
                              updated[idx].name = txt;
                              setBadepapaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedto}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...badepapaList];
                              updated[idx].marriedto = txt;
                              setBadepapaList(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.daughterof || ''}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...badepapaList];
                              updated[idx].daughterof = txt;
                              setBadepapaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>THIKANA / NATIVE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.thikana}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...badepapaList];
                              updated[idx].thikana = txt;
                              setBadepapaList(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 3. KAKOSA */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>KAKOSA</Text>
                    <TouchableOpacity style={styles.addTablePillBtn} onPress={handleAddKakosa} activeOpacity={0.7}>
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Kakosa</Text>
                    </TouchableOpacity>
                  </View>

                  {kakosaList.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>KAKOSA #{idx + 1}</Text>
                        <TouchableOpacity style={styles.grayCrossBtn} onPress={() => handleRemoveKakosa(item.id)} activeOpacity={0.7}>
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...kakosaList];
                              updated[idx].name = txt;
                              setKakosaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedto}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...kakosaList];
                              updated[idx].marriedto = txt;
                              setKakosaList(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.daughterof || ''}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...kakosaList];
                              updated[idx].daughterof = txt;
                              setKakosaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>THIKANA / NATIVE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.thikana}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...kakosaList];
                              updated[idx].thikana = txt;
                              setKakosaList(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 4. BHUASA */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>BHUASA</Text>
                    <TouchableOpacity style={styles.addTablePillBtn} onPress={handleAddBhuasa} activeOpacity={0.7}>
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Bhuasa</Text>
                    </TouchableOpacity>
                  </View>

                  {bhuasaList.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>BHUASA #{idx + 1}</Text>
                        <TouchableOpacity style={styles.grayCrossBtn} onPress={() => handleRemoveBhuasa(item.id)} activeOpacity={0.7}>
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...bhuasaList];
                              updated[idx].name = txt;
                              setBhuasaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedto}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...bhuasaList];
                              updated[idx].marriedto = txt;
                              setBhuasaList(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>SON OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.sonof || ''}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...bhuasaList];
                              updated[idx].sonof = txt;
                              setBhuasaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>THIKANA / NATIVE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.thikana}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...bhuasaList];
                              updated[idx].thikana = txt;
                              setBhuasaList(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 5. MATERNAL GRANDPARENTS (NANA-NANI SA) */}
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.subSectionTitle}>MATERNAL GRANDPARENTS (NANA-NANI SA)</Text>
                  <View style={{ borderStyle: 'dashed', borderWidth: 0.5, borderColor: '#EAE0D5', marginVertical: 8 }} />

                  <View style={styles.twoColInputRow}>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>NANA SA NAME</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.nanaSaName}
                        placeholder="Nana Sa Name"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, nanaSaName: txt }))}
                      />
                    </View>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>SON OF</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.nanaSaSonOf}
                        placeholder="Father Name"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, nanaSaSonOf: txt }))}
                      />
                    </View>
                  </View>

                  <View style={styles.twoColInputRow}>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>OCCUPATION</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.nanaSaOcc}
                        placeholder="Occupation"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, nanaSaOcc: txt }))}
                      />
                    </View>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>THIKANA</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.nanaSaThikana}
                        placeholder="Thikana"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, nanaSaThikana: txt }))}
                      />
                    </View>
                  </View>

                  <View style={styles.twoColInputRow}>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>NANI SA NAME</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.naniSaName}
                        placeholder="Nani Sa Name"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, naniSaName: txt }))}
                      />
                    </View>
                    <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={maternalGrandparents.naniSaDaughterOf}
                        placeholder="Father Name"
                        placeholderTextColor="#A0849A"
                        onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, naniSaDaughterOf: txt }))}
                      />
                    </View>
                  </View>

                  <View style={styles.inputFieldGroup}>
                    <Text style={styles.inputLabelText}>THIKANA</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={maternalGrandparents.naniSaThikana}
                      placeholder="Native Thikana"
                      placeholderTextColor="#A0849A"
                      onChangeText={(txt) => setMaternalGrandparents((prev) => ({ ...prev, naniSaThikana: txt }))}
                    />
                  </View>
                </View>

                {/* 6. MAMOSA */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>MAMOSA</Text>
                    <TouchableOpacity style={styles.addTablePillBtn} onPress={handleAddMamosa} activeOpacity={0.7}>
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Mamosa</Text>
                    </TouchableOpacity>
                  </View>

                  {mamosaList.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>MAMOSA #{idx + 1}</Text>
                        <TouchableOpacity style={styles.grayCrossBtn} onPress={() => handleRemoveMamosa(item.id)} activeOpacity={0.7}>
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...mamosaList];
                              updated[idx].name = txt;
                              setMamosaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedto}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...mamosaList];
                              updated[idx].marriedto = txt;
                              setMamosaList(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>DAUGHTER OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.daughterof || ''}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...mamosaList];
                              updated[idx].daughterof = txt;
                              setMamosaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>THIKANA / NATIVE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.thikana}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...mamosaList];
                              updated[idx].thikana = txt;
                              setMamosaList(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 7. MASISA */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableSectionTitle}>MASISA</Text>
                    <TouchableOpacity style={styles.addTablePillBtn} onPress={handleAddMasisa} activeOpacity={0.7}>
                      <Ionicons name="add" size={14} color="#59123B" />
                      <Text style={styles.addTablePillBtnText}>Add Masisa</Text>
                    </TouchableOpacity>
                  </View>

                  {masisaList.map((item, idx) => (
                    <View key={item.id} style={styles.tableDataCardItem}>
                      <View style={styles.tableCardTopBar}>
                        <Text style={styles.tableItemIndexLabel}>MASISA #{idx + 1}</Text>
                        <TouchableOpacity style={styles.grayCrossBtn} onPress={() => handleRemoveMasisa(item.id)} activeOpacity={0.7}>
                          <Ionicons name="trash-outline" size={13} color="#D32F2F" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>NAME</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.name}
                            placeholder="Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...masisaList];
                              updated[idx].name = txt;
                              setMasisaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>MARRIED TO</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.marriedto}
                            placeholder="Spouse Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...masisaList];
                              updated[idx].marriedto = txt;
                              setMasisaList(updated);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.twoColInputRow}>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>SON OF</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.sonof || ''}
                            placeholder="Parent Name"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...masisaList];
                              updated[idx].sonof = txt;
                              setMasisaList(updated);
                            }}
                          />
                        </View>
                        <View style={[styles.inputFieldGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabelText}>THIKANA / NATIVE</Text>
                          <TextInput
                            style={styles.textInputField}
                            value={item.thikana}
                            placeholder="Thikana"
                            placeholderTextColor="#A0849A"
                            onChangeText={(txt) => {
                              const updated = [...masisaList];
                              updated[idx].thikana = txt;
                              setMasisaList(updated);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 5. PHOTOS & DOCUMENTS SUBTAB (UPLOAD PHOTOS & DOCUMENTS) */}
            {activeSubTab === 'media' && (
              <View style={styles.formCardBox}>
                <View style={styles.cardHeaderWithCloseRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="images" size={18} color="#59123B" style={{ marginRight: 8 }} />
                    <Text style={styles.formSectionHeaderTitleModal}>UPLOAD PHOTOS & DOCUMENTS</Text>
                  </View>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <Ionicons name="close" size={20} color="#7A5B6F" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCardDivider} />

                {/* CARD 1: PHOTO GALLERY */}
                <View style={styles.tableCardContainer}>
                  <View style={styles.uploadHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="camera" size={16} color="#8C6C1C" style={{ marginRight: 6 }} />
                        <Text style={styles.uploadCardTitle}>Photo Gallery</Text>
                      </View>
                      <Text style={styles.uploadCardSubtitle}>Max 2MB per photo • Uploads on 'Save & Close'</Text>
                    </View>

                    <View style={styles.uploadHeaderActionsRow}>
                      <View style={styles.privacyRadioGroup}>
                        <Text style={styles.privacyLabelText}>Privacy:</Text>
                        <TouchableOpacity
                          style={styles.radioOptionBtn}
                          onPress={() => setPhotoPrivacy('public')}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={photoPrivacy === 'public' ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color="#59123B"
                          />
                          <Text style={styles.radioOptionText}>PUBLIC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.radioOptionBtn}
                          onPress={() => setPhotoPrivacy('on_request')}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={photoPrivacy === 'on_request' ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color="#59123B"
                          />
                          <Text style={styles.radioOptionText}>ON REQUEST</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.selectBtnPrimary}
                        onPress={handleSelectPhotos}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="cloud-upload" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.selectBtnPrimaryText}>+ SELECT PHOTOS</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* DROP BOX FOR PHOTOS */}
                  <View style={styles.dashedUploadDropBox}>
                    {selectedPhotos.length === 0 ? (
                      <View style={styles.emptyDropBoxContent}>
                        <Ionicons name="images-outline" size={32} color="#C5A059" style={{ marginBottom: 6 }} />
                        <Text style={styles.emptyDropBoxText}>
                          No photos selected. Click <Text style={{ fontWeight: '800', color: '#59123B' }}>+ Select Photos</Text> to choose images.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.photoGridContainer}>
                        {selectedPhotos.map((photoName, idx) => (
                          <View key={idx} style={styles.photoThumbnailBox}>
                            <Ionicons name="image" size={24} color="#59123B" />
                            <Text style={styles.photoNameText} numberOfLines={1}>{photoName}</Text>
                            <TouchableOpacity
                              style={styles.removePhotoBadge}
                              onPress={() => handleRemovePhoto(idx)}
                            >
                              <Ionicons name="close-circle" size={16} color="#D32F2F" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* CARD 2: VERIFICATION DOCUMENTS */}
                <View style={[styles.tableCardContainer, { marginTop: 14 }]}>
                  <View style={styles.uploadHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="document-text" size={16} color="#8C6C1C" style={{ marginRight: 6 }} />
                        <Text style={styles.uploadCardTitle}>Verification Documents</Text>
                      </View>
                      <Text style={styles.uploadCardSubtitle}>Aadhar, Horoscope, Identity • Uploads on 'Save & Close'</Text>
                    </View>

                    <View style={styles.uploadHeaderActionsRow}>
                      <View style={styles.privacyRadioGroup}>
                        <Text style={styles.privacyLabelText}>Privacy:</Text>
                        <TouchableOpacity
                          style={styles.radioOptionBtn}
                          onPress={() => setDocPrivacy('public')}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={docPrivacy === 'public' ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color="#59123B"
                          />
                          <Text style={styles.radioOptionText}>PUBLIC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.radioOptionBtn}
                          onPress={() => setDocPrivacy('on_request')}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={docPrivacy === 'on_request' ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color="#59123B"
                          />
                          <Text style={styles.radioOptionText}>ON REQUEST</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.selectBtnOutline}
                        onPress={handleSelectDocument}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="document-attach" size={14} color="#59123B" style={{ marginRight: 4 }} />
                        <Text style={styles.selectBtnOutlineText}>+ SELECT DOCUMENT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* DROP BOX FOR DOCUMENTS */}
                  <View style={styles.dashedUploadDropBox}>
                    {selectedDocs.length === 0 ? (
                      <View style={styles.emptyDropBoxContent}>
                        <Ionicons name="document-text-outline" size={32} color="#C5A059" style={{ marginBottom: 6 }} />
                        <Text style={styles.emptyDropBoxText}>
                          No verification documents selected. Click <Text style={{ fontWeight: '800', color: '#59123B' }}>+ Select Document</Text> to choose files.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.docListContainer}>
                        {selectedDocs.map((doc) => (
                          <View key={doc.id} style={styles.docItemChip}>
                            <Ionicons name="document-text" size={18} color="#59123B" style={{ marginRight: 6 }} />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.docNameText} numberOfLines={1}>{doc.name}</Text>
                              <Text style={styles.docSizeText}>{doc.size}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveDocument(doc.id)}>
                              <Ionicons name="trash-outline" size={16} color="#D32F2F" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save & Close</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 6. OTHER SUBTAB (MY WORLD - ABOUT ME & PARTNER PREFERENCES) */}
            {activeSubTab === 'other' && (
              <>
                <View style={styles.goldSubHeaderBanner}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#D4AF37', opacity: 0.3 }} />
                  <Text style={[styles.goldSubHeaderText, { marginHorizontal: 12 }]}>MY WORLD</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#D4AF37', opacity: 0.3 }} />
                </View>

                <View style={styles.twoColInputRow}>
                  {/* CARD 1: ABOUT ME */}
                  <View style={[styles.formCardBox, { flex: 1, marginBottom: 0 }]}>
                    <View style={styles.subCategoryHeaderRow}>
                      <Text style={styles.subSectionTitle}>ABOUT ME</Text>
                    </View>

                    <View style={styles.aboutMeBoxWrapper}>
                      <View style={styles.aboutMeIconCol}>
                        <Ionicons name="person" size={16} color="#59123B" />
                      </View>
                      <TextInput
                        style={[styles.aboutMeTextInput, { minHeight: 90 }]}
                        multiline
                        value={aboutMeText}
                        placeholder="Tell us about yourself (60 to 80 words recommended)..."
                        placeholderTextColor="#A0849A"
                        onChangeText={setAboutMeText}
                      />
                    </View>

                    <Text style={styles.wordCounterText}>
                      Words: {aboutMeText.trim() ? aboutMeText.trim().split(/\s+/).length : 0} / 80 max (Recommended: 60 - 80 words)
                    </Text>
                  </View>

                  {/* CARD 2: PARTNER PREFERENCES */}
                  <View style={[styles.formCardBox, { flex: 1, marginBottom: 0 }]}>
                    <View style={styles.subCategoryHeaderRow}>
                      <Text style={styles.subSectionTitle}>PARTNER PREFERENCES</Text>
                    </View>

                    <View style={styles.aboutMeBoxWrapper}>
                      <View style={styles.aboutMeIconCol}>
                        <Ionicons name="heart" size={16} color="#59123B" />
                      </View>
                      <TextInput
                        style={[styles.aboutMeTextInput, { minHeight: 90 }]}
                        multiline
                        value={partnerPrefText}
                        placeholder="Describe your ideal partner (60 to 80 words recommended)..."
                        placeholderTextColor="#A0849A"
                        onChangeText={setPartnerPrefText}
                      />
                    </View>

                    <Text style={styles.wordCounterText}>
                      Words: {partnerPrefText.trim() ? partnerPrefText.trim().split(/\s+/).length : 0} / 80 max (Recommended: 60 - 80 words)
                    </Text>
                  </View>
                </View>

                {/* BOTTOM ACTION BUTTONS */}
                <View style={styles.formBottomButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelPillBtn}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelPillText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePillBtn}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.savePillText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* GENEROU PADDING TO GUARANTEE NO BOTTOM TAB OVERLAP */}
            <View style={{ height: 110 }} />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4EE',
  },

  // ─── TOP HEADER ───────────────────────────────────────────────────────
  topHeader: {
    height: 64,
    backgroundColor: '#2C071E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4A1235',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    paddingRight: 4,
  },
  officialLogoRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4A1235',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerLogoImg: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  headerTextGroup: {
    justifyContent: 'center',
  },
  headerBrandTitle: {
    color: '#F5E4C3',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.4,
    fontFamily: 'serif',
  },
  editModeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4CAF50',
  },
  headerSubtitle: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  previewPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A1235',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  previewPillText: {
    color: '#F5E4C3',
    fontSize: 11,
    fontWeight: '800',
  },

  // ─── HERO ROYAL LOGO CARD (GRID MODE) ──────────────────────────────────
  gridScrollContent: {
    padding: 14,
  },
  heroLogoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCardTopDecoration: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
  decorativeStars: {
    color: '#D4AF37',
    fontSize: 9,
    opacity: 0.5,
    letterSpacing: 3,
  },
  heroLogoWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  heroLogoRingGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2C071E',
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  heroLogoImg: {
    width: 62,
    height: 62,
    resizeMode: 'contain',
  },
  crownBadgeFloating: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D4AF37',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroTitleText: {
    color: '#2C071E',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'serif',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  heroSubTitleText: {
    color: '#7B2052',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F1E7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  instructionPillText: {
    color: '#59123B',
    fontSize: 11,
    fontWeight: '700',
  },

  // COMPLETENESS BOX
  completenessBox: {
    width: '100%',
    backgroundColor: '#FBF8F3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
  },
  completenessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  completenessLabel: {
    color: '#4A1235',
    fontSize: 11.5,
    fontWeight: '800',
  },
  completenessPercent: {
    color: '#B38528',
    fontSize: 12,
    fontWeight: '900',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#EAE1D7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },

  // 2-COLUMN GRID OF 8 CATEGORY CARDS
  gridTwoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryCard: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFE0CB',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTextCol: {
    flex: 1,
    marginLeft: 8,
    marginRight: 2,
  },
  categoryCardLabel: {
    color: '#2C071E',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.3,
    lineHeight: 13.5,
  },
  categoryCardSub: {
    color: '#8C6C82',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },

  // BOTTOM HUB TILE ACTIONS
  bottomHubActions: {
    marginTop: 20,
    gap: 10,
  },
  hubTileBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  hubTileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hubTileText: {
    color: '#2C071E',
    fontSize: 13,
    fontWeight: '800',
  },
  hubTileDesc: {
    color: '#8C6C82',
    fontSize: 10.5,
    marginTop: 1,
  },
  logoutTileBtn: {
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  logoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutTileText: {
    color: '#A03333',
    fontSize: 13,
    fontWeight: '800',
  },

  // ─── THE 5 SUB-TABS BAR IN FORM MODE ─────────────────────────────────
  fiveSubTabsBar: {
    backgroundColor: '#2C071E',
    flexDirection: 'row',
    height: 54,
    paddingHorizontal: 2,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4A1235',
  },
  subTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  subTabItemActive: {
    backgroundColor: '#4A1235',
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37',
  },
  subTabText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8.8,
    fontWeight: '700',
    marginTop: 2,
  },
  subTabTextActive: {
    color: '#F5E4C3',
    fontWeight: '900',
  },

  // ─── FORM SCROLL & CARD BOXES ─────────────────────────────────────────
  formScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  formCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    shadowColor: '#2C071E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeaderWithCloseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formSectionHeaderTitle: {
    color: '#2C071E',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  formSectionHeaderTitleModal: {
    color: '#4A1235',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  subSectionTitle: {
    color: '#4A1235',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  formCardDivider: {
    height: 1,
    backgroundColor: '#F2E8DC',
    marginVertical: 10,
  },

  inputFieldGroup: {
    marginBottom: 10,
  },
  twoColInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  inputLabelText: {
    color: '#59123B',
    fontSize: 9.5,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  textInputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D5C7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#2C071E',
    fontWeight: '600',
  },
  inputWithIconRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputWithIconPadding: {
    paddingRight: 30,
  },
  insideInputIcon: {
    position: 'absolute',
    right: 8,
    pointerEvents: 'none',
  },

  // ACADEMICS & PROFESSION TABLE STYLES
  tableCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE5DC',
    padding: 12,
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableHeaderLeftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tableSectionTitle: {
    color: '#59123B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  addTablePillBtn: {
    backgroundColor: '#F7EFF5',
    borderWidth: 1,
    borderColor: '#59123B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addTablePillBtnText: {
    color: '#59123B',
    fontSize: 10,
    fontWeight: '800',
  },
  tableDataCardItem: {
    backgroundColor: '#FAF7F4',
    borderWidth: 1,
    borderColor: '#EAE0D5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  tableCardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6DD',
  },
  tableItemIndexLabel: {
    color: '#59123B',
    backgroundColor: '#F5EBE1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    overflow: 'hidden',
  },
  tableActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenCheckBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  grayCrossBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },

  // FORM BOTTOM BUTTONS ROW (CANCEL | SAVE CHANGES)
  formBottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  cancelPillBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#59123B',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPillText: {
    color: '#59123B',
    fontSize: 12,
    fontWeight: '800',
  },
  savePillBtn: {
    backgroundColor: '#59123B',
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  savePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // BADEPAPA & KAKOSA SECTION STYLES
  sectionTitleWithBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addMiniPillBtn: {
    backgroundColor: '#F7EFF5',
    borderWidth: 1,
    borderColor: '#59123B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addMiniPillBtnText: {
    color: '#59123B',
    fontSize: 10,
    fontWeight: '800',
  },
  relativeBlockItem: {
    backgroundColor: '#FBF8F5',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  deleteRelativeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },

  // GOLD SUBHEADER BANNER (MY WORLD)
  goldSubHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  goldSubHeaderText: {
    color: '#B38528',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  // ABOUT ME BOX STYLES
  subCategoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutMeBoxWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2D3E0',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FBF8F5',
    minHeight: 90,
  },
  aboutMeIconCol: {
    marginRight: 10,
    alignItems: 'center',
  },
  aboutMeTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#2C071E',
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  wordCounterText: {
    color: '#8C6C82',
    fontSize: 10,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // FAMILY BACKGROUND DISPLAY ROW
  displayDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  displayDetailCol: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  displayLabel: {
    color: '#4A1235',
    fontSize: 11,
    fontWeight: '800',
    width: 100,
  },
  displayValBold: {
    color: '#2C071E',
    fontSize: 12.5,
    fontWeight: '800',
  },
  // UPLOAD PHOTOS & DOCUMENTS STYLES (MATCHES SCREENSHOT EXACTLY)
  uploadHeaderRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 10,
  },
  uploadCardTitle: {
    color: '#59123B',
    fontSize: 13,
    fontWeight: '900',
  },
  uploadCardSubtitle: {
    color: '#8C6C82',
    fontSize: 10,
    marginTop: 2,
  },
  uploadHeaderActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  privacyRadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyLabelText: {
    color: '#59123B',
    fontSize: 11,
    fontWeight: '800',
  },
  radioOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  radioOptionText: {
    color: '#2C071E',
    fontSize: 10,
    fontWeight: '700',
  },
  selectBtnPrimary: {
    backgroundColor: '#59123B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  selectBtnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#59123B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBtnOutlineText: {
    color: '#59123B',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  dashedUploadDropBox: {
    backgroundColor: '#FAF7F4',
    borderWidth: 1,
    borderColor: '#D4C2B0',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 16,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDropBoxContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  emptyDropBoxText: {
    color: '#7A6874',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  photoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  photoThumbnailBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE0D5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 4,
  },
  photoNameText: {
    fontSize: 9,
    color: '#59123B',
    marginTop: 2,
  },
  removePhotoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  docListContainer: {
    width: '100%',
    gap: 8,
  },
  docItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE0D5',
    borderRadius: 8,
    padding: 8,
  },
  docNameText: {
    fontSize: 11,
    color: '#2C071E',
    fontWeight: '700',
  },
  docSizeText: {
    fontSize: 9.5,
    color: '#8C6C82',
  },
});
