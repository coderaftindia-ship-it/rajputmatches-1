import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CLANS = [
  'Any Clan / Subclan',
  'Rathore',
  'Chauhan',
  'Sisodia',
  'Parmar',
  'Solanki',
  'Shekhawat',
  'Tomar',
  'Bhati',
  'Kachwaha',
  'Gehlot',
];

const MARITAL_OPTIONS = ['Any', 'Never Married', 'Single', 'Divorced', 'Widowed'];
const MANGLIK_OPTIONS = ['Any', 'Non Manglik', 'Manglik', 'Anshik Manglik'];
const CLASS_OPTIONS = ['Any Class', 'Upper Class', 'Upper Middle Class', 'Middle Class'];
const COUNTRIES = ['Any Country', 'India', 'United States', 'United Kingdom', 'Canada', 'UAE'];
const STATES = ['Any State', 'Rajasthan', 'Uttar Pradesh', 'Delhi NCR', 'Madhya Pradesh', 'Gujarat', 'Maharashtra', 'Punjab'];

interface FilterDrawerModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function FilterDrawerModal({
  visible,
  onClose,
  onApplyFilters,
}: FilterDrawerModalProps) {
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [ageMin] = useState<string>('21');
  const [ageMax] = useState<string>('45');
  const [maritalStatus, setMaritalStatus] = useState<string>('Any');
  const [selectedClan, setSelectedClan] = useState<string>('Any Clan / Subclan');
  const [manglikStatus, setManglikStatus] = useState<string>('Any');
  const [familyClass, setFamilyClass] = useState<string>('Any Class');
  const [selectedCountry, setSelectedCountry] = useState<string>('Any Country');
  const [selectedState, setSelectedState] = useState<string>('Any State');
  const [isApplying, setIsApplying] = useState(false);

  // Expanded section state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const activeFiltersCount =
    (gender !== 'Female' ? 1 : 0) +
    (selectedClan !== 'Any Clan / Subclan' ? 1 : 0) +
    (maritalStatus !== 'Any' ? 1 : 0) +
    (manglikStatus !== 'Any' ? 1 : 0) +
    (familyClass !== 'Any Class' ? 1 : 0) +
    (selectedCountry !== 'Any Country' ? 1 : 0) +
    (selectedState !== 'Any State' ? 1 : 0) || 1;

  const handleApply = () => {
    setIsApplying(true);
    const filterData = {
      gender,
      minAge: parseInt(ageMin, 10) || 21,
      maxAge: parseInt(ageMax, 10) || 45,
      gotra: selectedClan !== 'Any Clan / Subclan' ? selectedClan : undefined,
      maritalStatus: maritalStatus !== 'Any' ? maritalStatus : undefined,
      manglik: manglikStatus !== 'Any' ? manglikStatus : undefined,
      class: familyClass !== 'Any Class' ? familyClass : undefined,
      country: selectedCountry !== 'Any Country' ? selectedCountry : undefined,
      state: selectedState !== 'Any State' ? selectedState : undefined,
    };

    setTimeout(() => {
      setIsApplying(false);
      onApplyFilters(filterData);
      onClose();
    }, 200);
  };

  const handleReset = () => {
    setGender('Female');
    setMaritalStatus('Any');
    setSelectedClan('Any Clan / Subclan');
    setManglikStatus('Any');
    setFamilyClass('Any Class');
    setSelectedCountry('Any Country');
    setSelectedState('Any State');
    setExpandedSection(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdropContainer}>
        {/* Clickable Backdrop to close modal */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropOverlay} />
        </TouchableWithoutFeedback>

        {/* Right Drawer Container */}
        <View style={styles.drawerPanel}>
          {/* Header Bar */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.drawerHeaderTitle}>Filter Matches 👑</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{activeFiltersCount} Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#EDB139" />
            </TouchableOpacity>
          </View>

          {/* Drawer Body Scroll */}
          <ScrollView
            style={styles.drawerBody}
            contentContainerStyle={styles.drawerBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Looking For Gender */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="people-outline" size={14} color="#59123B" /> Looking For
              </Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, gender === 'Female' && styles.toggleBtnActive]}
                  onPress={() => setGender('Female')}
                >
                  <Text style={[styles.toggleText, gender === 'Female' && styles.toggleTextActive]}>
                    Bride (Female)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, gender === 'Male' && styles.toggleBtnActive]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={[styles.toggleText, gender === 'Male' && styles.toggleTextActive]}>
                    Groom (Male)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Clan / Subclan Selector */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <FontAwesome5 name="shield-alt" size={12} color="#59123B" /> Clan / Subclan
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('clan')}
              >
                <Text style={styles.dropdownSelectorText}>{selectedClan}</Text>
                <Ionicons
                  name={expandedSection === 'clan' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'clan' && (
                <View style={styles.expandedOptionsList}>
                  {CLANS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, selectedClan === item && styles.optionItemActive]}
                      onPress={() => {
                        setSelectedClan(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, selectedClan === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {selectedClan === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Manglik Status */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <FontAwesome5 name="sun" size={12} color="#59123B" /> Manglik Status
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('manglik')}
              >
                <Text style={styles.dropdownSelectorText}>{manglikStatus}</Text>
                <Ionicons
                  name={expandedSection === 'manglik' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'manglik' && (
                <View style={styles.expandedOptionsList}>
                  {MANGLIK_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, manglikStatus === item && styles.optionItemActive]}
                      onPress={() => {
                        setManglikStatus(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, manglikStatus === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {manglikStatus === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Marital Status */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="heart-outline" size={14} color="#59123B" /> Marital Status
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('marital')}
              >
                <Text style={styles.dropdownSelectorText}>{maritalStatus}</Text>
                <Ionicons
                  name={expandedSection === 'marital' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'marital' && (
                <View style={styles.expandedOptionsList}>
                  {MARITAL_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, maritalStatus === item && styles.optionItemActive]}
                      onPress={() => {
                        setMaritalStatus(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, maritalStatus === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {maritalStatus === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Family Class */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="business-outline" size={14} color="#59123B" /> Family Class
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('class')}
              >
                <Text style={styles.dropdownSelectorText}>{familyClass}</Text>
                <Ionicons
                  name={expandedSection === 'class' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'class' && (
                <View style={styles.expandedOptionsList}>
                  {CLASS_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, familyClass === item && styles.optionItemActive]}
                      onPress={() => {
                        setFamilyClass(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, familyClass === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {familyClass === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Country Selector */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="globe-outline" size={14} color="#59123B" /> Country
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('country')}
              >
                <Text style={styles.dropdownSelectorText}>{selectedCountry}</Text>
                <Ionicons
                  name={expandedSection === 'country' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'country' && (
                <View style={styles.expandedOptionsList}>
                  {COUNTRIES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, selectedCountry === item && styles.optionItemActive]}
                      onPress={() => {
                        setSelectedCountry(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, selectedCountry === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {selectedCountry === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Location State */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="location-outline" size={14} color="#59123B" /> State / Region
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleSection('state')}
              >
                <Text style={styles.dropdownSelectorText}>{selectedState}</Text>
                <Ionicons
                  name={expandedSection === 'state' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#59123B"
                />
              </TouchableOpacity>
              {expandedSection === 'state' && (
                <View style={styles.expandedOptionsList}>
                  {STATES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionItem, selectedState === item && styles.optionItemActive]}
                      onPress={() => {
                        setSelectedState(item);
                        setExpandedSection(null);
                      }}
                    >
                      <Text style={[styles.optionText, selectedState === item && styles.optionTextActive]}>
                        {item}
                      </Text>
                      {selectedState === item && <Ionicons name="checkmark" size={14} color="#CD9024" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Drawer Footer Actions */}
          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={14} color="#59123B" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply} disabled={isApplying}>
              {isApplying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.applyBtnText}>Apply Filters</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 5, 14, 0.55)',
  },
  backdropOverlay: {
    flex: 1,
  },
  drawerPanel: {
    width: Math.min(SCREEN_WIDTH * 0.84, 340),
    height: '100%',
    backgroundColor: '#FAF5EF',
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: '#EDB139',
  },
  drawerHeader: {
    backgroundColor: '#59123B',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#EDB139',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  activeBadge: {
    backgroundColor: 'rgba(237, 177, 57, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDB139',
  },
  activeBadgeText: {
    color: '#EDB139',
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBody: {
    flex: 1,
  },
  drawerBodyContent: {
    padding: 14,
    gap: 14,
    paddingBottom: 20,
  },
  filterSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#59123B',
    letterSpacing: 0.2,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  toggleBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#59123B',
    borderColor: '#59123B',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#59123B',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  dropdownSelector: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownSelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D232C',
  },
  expandedOptionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE0CB',
    marginTop: 4,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE0',
  },
  optionItemActive: {
    backgroundColor: '#FAF3E8',
  },
  optionText: {
    fontSize: 11,
    color: '#3D232C',
    fontWeight: '600',
  },
  optionTextActive: {
    fontWeight: '800',
    color: '#59123B',
  },
  drawerFooter: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFE0CB',
    flexDirection: 'row',
    gap: 8,
  },
  resetBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FAF5EF',
    borderWidth: 1,
    borderColor: '#EFE0CB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  resetBtnText: {
    color: '#59123B',
    fontWeight: '800',
    fontSize: 12,
  },
  applyBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#59123B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
