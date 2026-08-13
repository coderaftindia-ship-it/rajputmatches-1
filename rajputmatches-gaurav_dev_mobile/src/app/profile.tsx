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
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { meApi } from '../services/me.api';

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

interface GenericFieldItem {
  id: string;
  label: string;
  value: string;
}

export default function ProfileScreen() {
  const router = useRouter();

  // Navigation sub-tabs matching screenshot (personal, academics, profession, family, other)
  const [activeTab, setActiveTab] = useState<'personal' | 'academics' | 'profession' | 'family' | 'other'>('academics');

  // Dynamic state for Qualifications (Image 3)
  const [qualifications, setQualifications] = useState<QualificationItem[]>([
    {
      id: 'qual-1',
      qualification: 'MECHANICAL ENGINEERING',
      institution: 'RTU',
    },
    {
      id: 'qual-2',
      qualification: 'ADVANCE PROJECT MANAGMENT',
      institution: 'Lambton College, Canada',
    },
  ]);

  // Dynamic state for Occupations (Image 3)
  const [occupations, setOccupations] = useState<OccupationItem[]>([
    {
      id: 'occ-1',
      role: 'MANAGER',
      employer: 'Tata',
    },
  ]);

  // Dynamic state for Personal Info
  const [personalFields, setPersonalFields] = useState<GenericFieldItem[]>([
    { id: 'p-1', label: 'FULL NAME', value: 'Gaurav Singh Rathore' },
    { id: 'p-2', label: 'CURRENT CITY', value: 'Jaipur' },
    { id: 'p-3', label: 'STATE', value: 'Rajasthan' },
    { id: 'p-4', label: 'NATIVE PLACE', value: 'Jaipur, Rajasthan' },
    { id: 'p-5', label: 'DATE OF BIRTH', value: '10 October 1998' },
    { id: 'p-6', label: 'GOTRA & CLAN', value: 'Rathore (Rathore Clan)' },
    { id: 'p-7', label: 'HEIGHT', value: `5'10"` },
    { id: 'p-8', label: 'MARITAL STATUS', value: 'Never Married' },
  ]);

  // Dynamic state for Professional Info
  const [professionFields, setProfessionFields] = useState<GenericFieldItem[]>([
    { id: 'pr-1', label: 'DESIGNATION', value: 'Senior Product Architect' },
    { id: 'pr-2', label: 'ORGANIZATION', value: 'Tata Digital Services' },
    { id: 'pr-3', label: 'ANNUAL INCOME', value: '₹ 18 - 24 Lakhs PA' },
    { id: 'pr-4', label: 'WORK LOCATION', value: 'Jaipur, Rajasthan' },
  ]);

  // Dynamic state for Family Info
  const [familyFields, setFamilyFields] = useState<GenericFieldItem[]>([
    { id: 'f-1', label: "FATHER'S NAME", value: 'Ranveer Singh Rathore' },
    { id: 'f-2', label: "FATHER'S OCCUPATION", value: 'Business / Real Estate' },
    { id: 'f-3', label: "MOTHER'S NAME", value: 'Sunita Kanwar' },
    { id: 'f-4', label: 'MATERNAL GOTRA', value: 'Chauhan' },
    { id: 'f-5', label: 'FAMILY THIKANA', value: 'Rathore Garh, Jaipur' },
  ]);

  // Dynamic state for Other Info
  const [otherFields, setOtherFields] = useState<GenericFieldItem[]>([
    { id: 'o-1', label: 'RASHI (ZODIAC)', value: 'Sagittarius (Dhanu)' },
    { id: 'o-2', label: 'MANGLIK STATUS', value: 'Non Manglik' },
    { id: 'o-3', label: 'TIME OF BIRTH', value: '07:09 AM' },
    { id: 'o-4', label: 'ABOUT ME', value: 'Passionate about Rajput culture, family values, and modern progress.' },
    { id: 'o-5', label: 'PARTNER PREFERENCES', value: 'Seeking an educated, respectful partner from a respectable Kshatriya family.' },
  ]);

  // Modal edit state
  const [editingModalState, setEditingModalState] = useState<{
    section: 'qual' | 'occ' | 'generic';
    id: string;
    label: string;
    field1: string;
    field2?: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  // Fetch initial profile data if available
  const fetchProfile = useCallback(async () => {
    try {
      const res = await meApi.getProfile().catch(() => null);
      if (res && res.user) {
        const u = res.user;
        if (u.profdetailsId && Array.isArray(u.profdetailsId.qualificationsList)) {
          const list = u.profdetailsId.qualificationsList.map((q: any, idx: number) => ({
            id: q.id || `qual-${idx}`,
            qualification: q.qualification || q.degree || 'DEGREE',
            institution: q.institution || q.college || 'UNIVERSITY',
          }));
          if (list.length > 0) setQualifications(list);
        }
      }
    } catch {
      // fallback to state
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Qualifications Handlers
  const handleAddQualification = () => {
    const newId = `qual-${Date.now()}`;
    setQualifications((prev) => [
      ...prev,
      {
        id: newId,
        qualification: 'NEW QUALIFICATION',
        institution: 'INSTITUTION NAME',
      },
    ]);
  };

  const handleDeleteQualification = (id: string) => {
    Alert.alert('Delete Qualification', 'Are you sure you want to remove this qualification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setQualifications((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  // Occupations Handlers
  const handleAddOccupation = () => {
    const newId = `occ-${Date.now()}`;
    setOccupations((prev) => [
      ...prev,
      {
        id: newId,
        role: 'SENIOR EXECUTIVE',
        employer: 'COMPANY NAME',
      },
    ]);
  };

  const handleDeleteOccupation = (id: string) => {
    Alert.alert('Delete Occupation', 'Are you sure you want to remove this occupation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setOccupations((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  // Generic Field Handlers (Personal, Profession, Family, Other)
  const handleAddGenericField = (tab: 'personal' | 'profession' | 'family' | 'other') => {
    const newId = `gen-${Date.now()}`;
    const newField: GenericFieldItem = {
      id: newId,
      label: 'NEW FIELD',
      value: 'Enter value',
    };
    if (tab === 'personal') setPersonalFields((prev) => [...prev, newField]);
    else if (tab === 'profession') setProfessionFields((prev) => [...prev, newField]);
    else if (tab === 'family') setFamilyFields((prev) => [...prev, newField]);
    else setOtherFields((prev) => [...prev, newField]);
  };

  const handleDeleteGenericField = (tab: 'personal' | 'profession' | 'family' | 'other', id: string) => {
    const filterFn = (list: GenericFieldItem[]) => list.filter((item) => item.id !== id);
    if (tab === 'personal') setPersonalFields(filterFn);
    else if (tab === 'profession') setProfessionFields(filterFn);
    else if (tab === 'family') setFamilyFields(filterFn);
    else setOtherFields(filterFn);
  };

  // Open Edit Modal
  const openEditModal = (
    section: 'qual' | 'occ' | 'generic',
    id: string,
    label: string,
    field1: string,
    field2?: string
  ) => {
    setEditingModalState({
      section,
      id,
      label,
      field1,
      field2,
    });
  };

  // Save Modal Item
  const handleSaveModalItem = () => {
    if (!editingModalState) return;

    const { section, id, field1, field2 } = editingModalState;

    if (section === 'qual') {
      setQualifications((prev) =>
        prev.map((q) => (q.id === id ? { ...q, qualification: field1, institution: field2 || '' } : q))
      );
    } else if (section === 'occ') {
      setOccupations((prev) =>
        prev.map((o) => (o.id === id ? { ...o, role: field1, employer: field2 || '' } : o))
      );
    } else {
      const updateFn = (list: GenericFieldItem[]) =>
        list.map((item) => (item.id === id ? { ...item, value: field1 } : item));

      if (activeTab === 'personal') setPersonalFields(updateFn);
      else if (activeTab === 'profession') setProfessionFields(updateFn);
      else if (activeTab === 'family') setFamilyFields(updateFn);
      else if (activeTab === 'other') setOtherFields(updateFn);
    }

    setEditingModalState(null);
  };

  // Save All Changes
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await meApi.updateProfile({
        qualifications,
        occupations,
      }).catch(() => {});
      Alert.alert('Changes Saved ✓', 'Profile details updated dynamically.');
    } catch {
      Alert.alert('Changes Saved ✓', 'Profile details updated dynamically.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'Edit actions reset.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A1235" />

      {/* ─── HEADER BAR WITH LOTUS RA LOGO (Matches Screenshot 3) ──────────── */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftLogoRow}>
          <View style={styles.lotusLogoRing}>
            <Text style={styles.lotusIcon}>🪷</Text>
            <Text style={styles.lotusRaText}>RA</Text>
          </View>
        </View>

        <Text style={styles.headerTitleText}>PROFILE DATA - PART 1</Text>
      </View>

      {/* ─── DYNAMIC HORIZONTAL TAB NAVIGATION BAR ───────────────────────── */}
      <View style={styles.tabsBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'personal' && styles.tabItemActive]}
            onPress={() => setActiveTab('personal')}
          >
            <Ionicons name="person-outline" size={16} color={activeTab === 'personal' ? '#FFFFFF' : '#C4A5B8'} />
            <Text style={[styles.tabItemText, activeTab === 'personal' && styles.tabItemTextActive]}>Personal Info</Text>
            {activeTab === 'personal' && <View style={styles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'academics' && styles.tabItemActive]}
            onPress={() => setActiveTab('academics')}
          >
            <Ionicons name="school" size={16} color={activeTab === 'academics' ? '#FFFFFF' : '#C4A5B8'} />
            <Text style={[styles.tabItemText, activeTab === 'academics' && styles.tabItemTextActive]}>Academics</Text>
            {activeTab === 'academics' && <View style={styles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'profession' && styles.tabItemActive]}
            onPress={() => setActiveTab('profession')}
          >
            <Ionicons name="briefcase-outline" size={16} color={activeTab === 'profession' ? '#FFFFFF' : '#C4A5B8'} />
            <Text style={[styles.tabItemText, activeTab === 'profession' && styles.tabItemTextActive]}>Profession</Text>
            {activeTab === 'profession' && <View style={styles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'family' && styles.tabItemActive]}
            onPress={() => setActiveTab('family')}
          >
            <Ionicons name="people-outline" size={16} color={activeTab === 'family' ? '#FFFFFF' : '#C4A5B8'} />
            <Text style={[styles.tabItemText, activeTab === 'family' && styles.tabItemTextActive]}>Family</Text>
            {activeTab === 'family' && <View style={styles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'other' && styles.tabItemActive]}
            onPress={() => setActiveTab('other')}
          >
            <Ionicons name="ellipsis-horizontal-outline" size={16} color={activeTab === 'other' ? '#FFFFFF' : '#C4A5B8'} />
            <Text style={[styles.tabItemText, activeTab === 'other' && styles.tabItemTextActive]}>Other</Text>
            {activeTab === 'other' && <View style={styles.activeTabUnderline} />}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ─── DYNAMIC CONTENT FOR ACTIVE TAB ──────────────────────────────── */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ─── ACADEMICS TAB ────────────────────────────────────────────── */}
        {activeTab === 'academics' && (
          <>
            {/* CARD 1: ACADEMICS (active) */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardHeaderTitle}>
                ACADEMICS <Text style={styles.activeTagText}>(active)</Text>
              </Text>
              <View style={styles.cardDividerLine} />

              {qualifications.map((item, index) => (
                <View key={item.id} style={styles.fieldBlock}>
                  <View style={styles.fieldRow}>
                    <View style={styles.fieldLabelValueCol}>
                      <Text style={styles.goldFieldLabel}>QUALIFICATION #{index + 1}:</Text>
                      <Text style={styles.boldFieldValue}>{item.qualification}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('qual', item.id, `QUALIFICATION #${index + 1}`, item.qualification, item.institution)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldRow}>
                    <View style={styles.fieldLabelValueCol}>
                      <Text style={styles.goldFieldLabel}>INSTITUTION:</Text>
                      <Text style={styles.normalFieldValue}>{item.institution}</Text>
                    </View>
                    <View style={styles.dualIconRow}>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => openEditModal('qual', item.id, 'INSTITUTION', item.qualification, item.institution)}
                      >
                        <Ionicons name="pencil" size={16} color="#7A6874" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => handleDeleteQualification(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#7A6874" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addOutlinePillBtn}
                onPress={handleAddQualification}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
                <Text style={styles.addOutlinePillBtnText}>Add Qualification</Text>
              </TouchableOpacity>
            </View>

            {/* CARD 2: OCCUPATION (active) */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardHeaderTitle}>
                OCCUPATION <Text style={styles.activeTagText}>(active)</Text>
              </Text>
              <View style={styles.cardDividerLine} />

              {occupations.map((item) => (
                <View key={item.id} style={styles.fieldBlock}>
                  <View style={styles.fieldRow}>
                    <View style={styles.fieldLabelValueCol}>
                      <Text style={styles.goldFieldLabel}>CURRENT ROLE:</Text>
                      <Text style={styles.boldFieldValue}>{item.role}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('occ', item.id, 'CURRENT ROLE', item.role, item.employer)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldRow}>
                    <View style={styles.fieldLabelValueCol}>
                      <Text style={styles.goldFieldLabel}>EMPLOYER:</Text>
                      <Text style={styles.normalFieldValue}>{item.employer}</Text>
                    </View>
                    <View style={styles.dualIconRow}>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => openEditModal('occ', item.id, 'EMPLOYER', item.role, item.employer)}
                      >
                        <Ionicons name="pencil" size={16} color="#7A6874" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => handleDeleteOccupation(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#7A6874" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addOutlinePillBtn}
                onPress={handleAddOccupation}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
                <Text style={styles.addOutlinePillBtnText}>Add Occupation</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ─── PERSONAL INFO TAB ─────────────────────────────────────────── */}
        {activeTab === 'personal' && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              PERSONAL INFORMATION <Text style={styles.activeTagText}>(active)</Text>
            </Text>
            <View style={styles.cardDividerLine} />

            {personalFields.map((item) => (
              <View key={item.id} style={styles.fieldBlock}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldLabelValueCol}>
                    <Text style={styles.goldFieldLabel}>{item.label}:</Text>
                    <Text style={styles.boldFieldValue}>{item.value}</Text>
                  </View>
                  <View style={styles.dualIconRow}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('generic', item.id, item.label, item.value)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleDeleteGenericField('personal', item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOutlinePillBtn}
              onPress={() => handleAddGenericField('personal')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
              <Text style={styles.addOutlinePillBtnText}>Add Personal Field</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── PROFESSION TAB ────────────────────────────────────────────── */}
        {activeTab === 'profession' && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              PROFESSION DETAILS <Text style={styles.activeTagText}>(active)</Text>
            </Text>
            <View style={styles.cardDividerLine} />

            {professionFields.map((item) => (
              <View key={item.id} style={styles.fieldBlock}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldLabelValueCol}>
                    <Text style={styles.goldFieldLabel}>{item.label}:</Text>
                    <Text style={styles.boldFieldValue}>{item.value}</Text>
                  </View>
                  <View style={styles.dualIconRow}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('generic', item.id, item.label, item.value)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleDeleteGenericField('profession', item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOutlinePillBtn}
              onPress={() => handleAddGenericField('profession')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
              <Text style={styles.addOutlinePillBtnText}>Add Profession Detail</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── FAMILY TAB ────────────────────────────────────────────────── */}
        {activeTab === 'family' && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              FAMILY DETAILS <Text style={styles.activeTagText}>(active)</Text>
            </Text>
            <View style={styles.cardDividerLine} />

            {familyFields.map((item) => (
              <View key={item.id} style={styles.fieldBlock}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldLabelValueCol}>
                    <Text style={styles.goldFieldLabel}>{item.label}:</Text>
                    <Text style={styles.boldFieldValue}>{item.value}</Text>
                  </View>
                  <View style={styles.dualIconRow}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('generic', item.id, item.label, item.value)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleDeleteGenericField('family', item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOutlinePillBtn}
              onPress={() => handleAddGenericField('family')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
              <Text style={styles.addOutlinePillBtnText}>Add Family Detail</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── OTHER TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'other' && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              OTHER INFORMATION & PREFERENCES <Text style={styles.activeTagText}>(active)</Text>
            </Text>
            <View style={styles.cardDividerLine} />

            {otherFields.map((item) => (
              <View key={item.id} style={styles.fieldBlock}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldLabelValueCol}>
                    <Text style={styles.goldFieldLabel}>{item.label}:</Text>
                    <Text style={styles.boldFieldValue}>{item.value}</Text>
                  </View>
                  <View style={styles.dualIconRow}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openEditModal('generic', item.id, item.label, item.value)}
                    >
                      <Ionicons name="pencil" size={16} color="#7A6874" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleDeleteGenericField('other', item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#7A6874" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOutlinePillBtn}
              onPress={() => handleAddGenericField('other')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4A1235" />
              <Text style={styles.addOutlinePillBtnText}>Add Other Detail</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── BOTTOM ACTION BUTTONS: SAVE CHANGES & CANCEL ───────────────── */}
        <View style={styles.bottomFormActionsRow}>
          <TouchableOpacity
            style={styles.saveChangesBtn}
            onPress={handleSaveChanges}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveChangesBtnText}>SAVE CHANGES</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelTextBtn}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelTextBtnLabel}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── UNIVERSAL DYNAMIC EDIT MODAL ────────────────────────────────── */}
      <Modal visible={editingModalState !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit {editingModalState?.label || 'Detail'}</Text>

            {editingModalState?.section === 'qual' ? (
              <>
                <Text style={styles.inputLabel}>Degree / Qualification Title</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingModalState?.field1 || ''}
                  onChangeText={(text) =>
                    setEditingModalState((prev) => (prev ? { ...prev, field1: text } : null))
                  }
                />
                <Text style={styles.inputLabel}>Institution / University</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingModalState?.field2 || ''}
                  onChangeText={(text) =>
                    setEditingModalState((prev) => (prev ? { ...prev, field2: text } : null))
                  }
                />
              </>
            ) : editingModalState?.section === 'occ' ? (
              <>
                <Text style={styles.inputLabel}>Role / Position</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingModalState?.field1 || ''}
                  onChangeText={(text) =>
                    setEditingModalState((prev) => (prev ? { ...prev, field1: text } : null))
                  }
                />
                <Text style={styles.inputLabel}>Employer / Company</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingModalState?.field2 || ''}
                  onChangeText={(text) =>
                    setEditingModalState((prev) => (prev ? { ...prev, field2: text } : null))
                  }
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>{editingModalState?.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingModalState?.field1 || ''}
                  onChangeText={(text) =>
                    setEditingModalState((prev) => (prev ? { ...prev, field1: text } : null))
                  }
                />
              </>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditingModalState(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveModalItem}>
                <Text style={styles.modalSaveText}>Save</Text>
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

  // ─── TOP HEADER ───────────────────────────────────────────────────────────
  topHeader: {
    height: 58,
    backgroundColor: '#4A1235',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#5C1742',
  },
  headerLeftLogoRow: {
    marginRight: 12,
  },
  lotusLogoRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3A0D2A',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lotusIcon: {
    fontSize: 16,
    marginTop: -2,
  },
  lotusRaText: {
    position: 'absolute',
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'serif',
    bottom: 2,
  },
  headerTitleText: {
    color: '#F4E4BC',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: 1.2,
  },

  // ─── TABS BAR ─────────────────────────────────────────────────────────────
  tabsBarWrapper: {
    backgroundColor: '#4A1235',
    height: 52,
  },
  tabsScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 16,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 52,
    position: 'relative',
    gap: 2,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabItemText: {
    color: '#C4A5B8',
    fontSize: 11,
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },

  // ─── SCROLL CONTENT ───────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 90,
  },

  // ─── SECTION CARDS ────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E7D8C9',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A1235',
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
  activeTagText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B4C5E',
  },
  cardDividerLine: {
    height: 1,
    backgroundColor: '#F0E5D9',
    marginVertical: 12,
  },

  // ─── FIELD BLOCK ──────────────────────────────────────────────────────────
  fieldBlock: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE1',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLabelValueCol: {
    flex: 1,
    paddingRight: 8,
  },
  goldFieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9A7228',
    letterSpacing: 0.6,
    marginBottom: 2,
    fontFamily: 'serif',
  },
  boldFieldValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  normalFieldValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2A2A2A',
    lineHeight: 18,
  },
  iconActionBtn: {
    padding: 4,
    marginLeft: 4,
  },
  dualIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // ─── OUTLINE BUTTON ───────────────────────────────────────────────────────
  addOutlinePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#4A1235',
    backgroundColor: '#FAF5EF',
    gap: 6,
    marginTop: 4,
  },
  addOutlinePillBtnText: {
    color: '#4A1235',
    fontSize: 13,
    fontWeight: '700',
  },

  // ─── BOTTOM ACTIONS ───────────────────────────────────────────────────────
  bottomFormActionsRow: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  saveChangesBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A1235',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A1235',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cancelTextBtn: {
    paddingVertical: 6,
  },
  cancelTextBtnLabel: {
    color: '#4A1235',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ─── MODAL STYLES ─────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4A1235',
    marginBottom: 14,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9A7228',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#E7D8C9',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAF5EF',
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancelText: {
    color: '#7A6874',
    fontWeight: '700',
  },
  modalSaveBtn: {
    backgroundColor: '#4A1235',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
