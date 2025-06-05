import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Configurations = () => {
  const [selectedTab, setSelectedTab] = useState('District');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const districtData = [
    {id: '1', district: 'Gujrat District'},
    {id: '2', district: 'Wazirabad District'},
    {id: '3', district: 'Lahore District'},
    {id: '4', district: 'Gujranwala District'},
    {id: '5', district: 'Sheikhupura District'},
  ];

  const zoneData = [
    {id: '1', zone: 'Gujrat Zone'},
    {id: '2', zone: 'Wazirabad Zone'},
    {id: '3', zone: 'Lahore Zone'},
    {id: '4', zone: 'Gujranwala Zone'},
    {id: '5', zone: 'Sheikhupura Zone'},
  ];

  const ucData = [
    {id: '1', uc: 'UC Kalaske'},
    {id: '2', uc: 'Union council 70'},
    {id: '3', uc: 'Union council 34'},
    {id: '4', uc: 'Union council 65'},
    {id: '5', uc: 'Union council 15'},
  ];

  const donationType = [
    {id: '1', type: 'Library Fund'},
    {id: '2', type: 'Community fund'},
    {id: '3', type: 'Welfare donation'},
    {id: '4', type: 'Health Fund'},
    {id: '5', type: 'New Type'},
  ];

  // Tab buttons
  const tabs = [
    {id: 'District', icon: 'office-building', color: '#007AFF'},
    {id: 'Zone/Tehsil', icon: 'map-search', color: '#34C759'},
    {id: 'UC', icon: 'account-group', color: '#FF9500'},
    {id: 'Donation Type', icon: 'hand-heart', color: '#AF52DE'},
  ];
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBarContainer}>
        <Image
          source={require('../assets/logo-black.png')}
          style={{width: 100, height: 100}}
          tintColor={'#fff'}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Configurations</Text>
        <TouchableOpacity>
          <Icon name="account-circle" size={45} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                selectedTab === tab.id && styles.selectedTab,
                {
                  backgroundColor:
                    selectedTab === tab.id ? tab.color + '22' : '#F8F9FC',
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}>
              <Icon
                name={tab.icon}
                size={24}
                color={selectedTab === tab.id ? tab.color : '#8E8E93'}
              />
              <Text
                style={[
                  styles.tabText,
                  {color: selectedTab === tab.id ? tab.color : '#8E8E93'},
                ]}>
                {tab.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* District List */}
        {selectedTab === 'District' && (
          <>
            <Text style={styles.sectionTitle}>Configure District</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New District</Text>
              </TouchableOpacity>
            </View>
            {districtData.map(district => (
              <View key={district.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{district.district}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditModalVisible(true)}>
                    <Icon name="pencil" size={20} color="#6E11B0" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setDeleteModalVisible(true)}>
                    <Icon name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Zone List */}
        {selectedTab === 'Zone/Tehsil' && (
          <>
            <Text style={styles.sectionTitle}>Configure Zone</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New Zone</Text>
              </TouchableOpacity>
            </View>
            {zoneData.map(zone => (
              <View key={zone.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{zone.zone}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditModalVisible(true)}>
                    <Icon name="pencil" size={20} color="#6E11B0" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setDeleteModalVisible(true)}>
                    <Icon name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* UC List */}
        {selectedTab === 'UC' && (
          <>
            <Text style={styles.sectionTitle}>Configure UC</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New UC</Text>
              </TouchableOpacity>
            </View>
            {ucData.map(uc => (
              <View key={uc.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{uc.uc}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditModalVisible(true)}>
                    <Icon name="pencil" size={20} color="#6E11B0" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setDeleteModalVisible(true)}>
                    <Icon name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Donation Type List */}
        {selectedTab === 'Donation Type' && (
          <>
            <Text style={styles.sectionTitle}>Configure Donation Type</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add Donation Type</Text>
              </TouchableOpacity>
            </View>
            {donationType.map(type => (
              <View key={type.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{type.type}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditModalVisible(true)}>
                    <Icon name="pencil" size={20} color="#6E11B0" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setDeleteModalVisible(true)}>
                    <Icon name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              elevation: 10,
            }}>
            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
                padding: 6,
              }}
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Text Input */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'District' && 'Add New District'}
              {selectedTab === 'Zone/Tehsil' && 'Add New Zone'}
              {selectedTab === 'UC' && 'Add Union Council'}
              {selectedTab === 'Donation Type' && ' Add Donation Type'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={
                  selectedTab === 'District'
                    ? 'Enter District Name'
                    : selectedTab === 'Zone/Tehsil'
                    ? 'Enter Zone Name'
                    : selectedTab === 'UC'
                    ? 'Enter Union Council Name'
                    : selectedTab === 'Donation Type'
                    ? 'Enter Donation Type'
                    : ''
                }
                placeholderTextColor={'#888'}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#F8F9FC',
                }}
              />
            </View>
            {/* Add Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#6E11B0',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => {}}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                Add {selectedTab === 'District' && 'District'}
                {selectedTab === 'Zone/Tehsil' && 'Zone'}
                {selectedTab === 'UC' && 'Union Council'}
                {selectedTab === 'Donation Type' && 'Donation Type'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        transparent
        visible={!!deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              elevation: 10,
            }}>
            {/* Warning Icon */}
            <View
              style={{
                backgroundColor: '#FFF3CD',
                borderRadius: 50,
                padding: 16,
                marginBottom: 12,
              }}>
              <Icon name="alert-circle" size={40} color="#FFA500" />
            </View>
            {/* Title */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#6E11B0',
                marginBottom: 8,
                textAlign: 'center',
              }}>
              Are you sure?
            </Text>
            {/* Subtitle */}
            <Text
              style={{
                fontSize: 15,
                color: '#555',
                marginBottom: 28,
                textAlign: 'center',
              }}>
              This {selectedTab === 'District' && 'District'}
              {selectedTab === 'Zone/Tehsil' && 'Zone'}
              {selectedTab === 'UC' && 'Union Council'}
              {selectedTab === 'Donation Type' && 'Donation Type'} be
              permanently deleted.
            </Text>
            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#6E11B0',
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  // handle delete logic here
                  setDeleteModalVisible(false);
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                  Yes, delete it
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => setDeleteModalVisible(false)}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        transparent
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              elevation: 10,
            }}>
            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
                padding: 6,
              }}
              onPress={() => setEditModalVisible(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Text Input */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'District' && 'Edit District'}
              {selectedTab === 'Zone/Tehsil' && 'Edit Zone'}
              {selectedTab === 'UC' && 'Edit Union Council'}
              {selectedTab === 'Donation Type' && 'Edit Donation Type'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={
                  selectedTab === 'District'
                    ? 'Enter District Name'
                    : selectedTab === 'Zone/Tehsil'
                    ? 'Enter Zone Name'
                    : selectedTab === 'UC'
                    ? 'Enter Union Council Name'
                    : selectedTab === 'Donation Type'
                    ? 'Enter Donation Type'
                    : ''
                }
                placeholderTextColor={'#888'}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#F8F9FC',
                }}
              />
            </View>
            {/* Edit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#6E11B0',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => {}}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Configurations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  topBarContainer: {
    height: '10%',
    width: '100%',
    backgroundColor: '#6E11B0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    paddingHorizontal: '2%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  tabButton: {
    width: '48%', // Adjusted to fit two buttons per row
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10, // Space between rows
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  selectedTab: {
    borderWidth: 0.5,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 20,
  },
  addBtnContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#6E11B0',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 5,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#F8F9FC',
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});
