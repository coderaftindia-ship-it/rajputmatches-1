import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FilterDrawerModal } from '../components/filter-drawer-modal';

export default function FiltersScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setModalVisible(false);
    router.replace('/explore');
  };

  const handleApply = (filters: any) => {
    setModalVisible(false);
    router.replace({
      pathname: '/explore',
      params: { appliedFilters: JSON.stringify(filters) },
    });
  };

  return (
    <View style={styles.container}>
      <FilterDrawerModal
        visible={modalVisible}
        onClose={handleClose}
        onApplyFilters={handleApply}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(20, 5, 14, 0.4)',
  },
});
