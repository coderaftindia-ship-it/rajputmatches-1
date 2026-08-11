import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#59123B',
  gold: '#EDB139',
  goldDark: '#CD9024',
  cream: '#F8EBD7',
  bgGray: '#EFE0CB',
  textDark: '#1F2937',
  textGray: '#4B5563',
  textLight: '#9CA3AF',
  white: '#FFFFFF',
};

const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    duration: '1 Month',
    originalPrice: '₹2,999',
    discountPrice: '₹999',
    savings: '66% OFF',
    contacts: '10 Contacts',
    recommended: false,
    color: '#94A3B8',
  },
  {
    id: 'gold',
    name: 'Gold',
    duration: '3 Months',
    originalPrice: '₹5,999',
    discountPrice: '₹1,499',
    savings: '75% OFF',
    contacts: '30 Contacts',
    recommended: false,
    color: '#F59E0B',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    duration: '6 Months',
    originalPrice: '₹12,999',
    discountPrice: '₹2,499',
    savings: '80% OFF',
    contacts: '60 Contacts',
    recommended: false,
    color: '#06B6D4',
  },
  {
    id: 'royal',
    name: 'Royal PRIME',
    duration: '12 Months',
    originalPrice: '₹21,999',
    discountPrice: '₹3,999',
    savings: '82% OFF',
    contacts: '120 Contacts',
    recommended: true,
    color: '#59123B',
  },
];

export default function UpgradeScreen() {
  const [selectedPlan, setSelectedPlan] = useState('royal');

  const handleSubscribe = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    Alert.alert(
      "Confirm Subscription",
      `Would you like to subscribe to the ${plan?.name} Plan for ${plan?.discountPrice}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed to Pay", onPress: () => Alert.alert("Success", "Thank you for upgrading! Your profile is now Premium.") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#59123B" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <Text style={styles.headerSubtitle}>Connect with your perfect match instantly</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Anniversary Discount Banner */}
        <LinearGradient
          colors={['#59123B', '#3A0B26']}
          style={styles.anniversaryBanner}
        >
          <View style={styles.bannerRow}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerAnniversaryText}>26th ANNIVERSARY SPECIAL</Text>
              <Text style={styles.bannerMainTitle}>Upto 82% Discount</Text>
              <Text style={styles.bannerSubText}>Limited period offer on all premium memberships</Text>
            </View>
            <View style={styles.crownCircle}>
              <FontAwesome5 name="crown" size={24} color={COLORS.gold} />
            </View>
          </View>
        </LinearGradient>

        {/* Plans Container */}
        <Text style={styles.sectionTitle}>Select a Membership Plan</Text>
        
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.recommended && styles.planCardSpecialBorder
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>BEST VALUE</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={styles.planNameBox}>
                  <View style={[styles.colorIndicator, { backgroundColor: plan.color }]} />
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <Text style={styles.planDuration}>{plan.duration}</Text>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.discountPriceBox}>
                  <Text style={styles.discountPrice}>{plan.discountPrice}</Text>
                  <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                </View>
                <View style={[styles.savingsBadge, { backgroundColor: plan.id === 'royal' ? '#FEF3C7' : '#EFE0CB' }]}>
                  <Text style={[styles.savingsText, { color: plan.id === 'royal' ? '#D97706' : '#59123B' }]}>
                    {plan.savings}
                  </Text>
                </View>
              </View>

              <View style={styles.planDetailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={14} color={COLORS.textGray} />
                  <Text style={styles.detailText}>{plan.contacts}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
                  <Text style={styles.detailText}>Unlimited Interests</Text>
                </View>
              </View>

            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsHeaderTitle}>Premium Privileges</Text>
          
          <View style={styles.benefitItem}>
            <View style={styles.benefitIconBox}>
              <Ionicons name="call" size={18} color="#59123B" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Direct Contact Details</Text>
              <Text style={styles.benefitSub}>View verified Phone numbers and WhatsApp details directly</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIconBox}>
              <Ionicons name="chatbubbles" size={18} color="#59123B" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Send Unlimited Messages</Text>
              <Text style={styles.benefitSub}>Initiate conversations with mutual connections immediately</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIconBox}>
              <Ionicons name="document-text" size={18} color="#59123B" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Kundali Matching</Text>
              <Text style={styles.benefitSub}>Unlock unlimited horoscope charts and matching recommendations</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIconBox}>
              <FontAwesome5 name="crown" size={14} color="#59123B" />
            </View>
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>PRIME Profile Badge</Text>
              <Text style={styles.benefitSub}>Stand out with a royal golden crown next to your name</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeBtnText}>Upgrade Now</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8EBD7',
  },
  header: {
    backgroundColor: '#59123B',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
  },
  anniversaryBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginTop: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  bannerAnniversaryText: {
    fontSize: 10,
    color: '#EDB139',
    fontWeight: '800',
    letterSpacing: 1,
  },
  bannerMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  bannerSubText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 15,
  },
  crownCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D5BF',
    padding: 16,
    position: 'relative',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#59123B',
    borderWidth: 2,
  },
  planCardSpecialBorder: {
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#59123B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },
  recommendedBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  planName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  planDuration: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE0CB',
    paddingBottom: 10,
    marginBottom: 10,
  },
  discountPriceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  planDetailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D5BF',
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  benefitsHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE0CB',
    paddingBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 12,
  },
  benefitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E6D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  benefitSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15,
  },
  subscribeBtn: {
    backgroundColor: '#59123B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#59123B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
