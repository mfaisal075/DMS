import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Users = () => {
  const [selectedTab, setSelectedTab] = useState('Roles');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data for each category
  const rolesData = [
    {id: '1', name: 'Administrator', description: 'Full system access'},
    {id: '2', name: 'Manager', description: 'Manage donations & users'},
    {id: '3', name: 'Viewer', description: 'Read-only access'},
  ];

  const usersData = [
    {
      id: '1',
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      role: 'Administrator',
    },
    {id: '2', name: 'Fatima Ali', email: 'fatima@example.com', role: 'Manager'},
    {
      id: '3',
      name: 'Zainab Hassan',
      email: 'zainab@example.com',
      role: 'Viewer',
    },
    {id: '4', name: 'Bilal Ahmed', email: 'bilal@example.com', role: 'Manager'},
  ];

  const donorsData = [
    {
      id: '1',
      name: 'Rashid Latif',
      contact: '0321-1234567',
      donations: 'PKR 15,000',
    },
    {
      id: '2',
      name: 'Asghar Ali',
      contact: '0315-7654321',
      donations: 'PKR 25,000',
    },
    {
      id: '3',
      name: 'Junaid Ilyas',
      contact: '0300-1122334',
      donations: 'PKR 10,000',
    },
    {
      id: '4',
      name: 'Babar Rehman',
      contact: '0333-9988776',
      donations: 'PKR 30,000',
    },
  ];

  // Tab buttons
  const tabs = [
    {id: 'Roles', icon: 'account-key', color: '#FF6B6B'},
    {id: 'System Users', icon: 'account-cog', color: '#4ECDC4'},
    {id: 'Donors', icon: 'account-heart', color: '#FFD166'},
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
        <Text style={styles.heading}>Users</Text>
        <TouchableOpacity>
          <Icon name="account-circle" size={45} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
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

      {/* Content Area */}
      <ScrollView style={styles.contentContainer}>
        {/* Roles List */}
        {selectedTab === 'Roles' && (
          <>
            <Text style={styles.sectionTitle}>User Roles</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New Role</Text>
              </TouchableOpacity>
            </View>
            {rolesData.map(role => (
              <View key={role.id} style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{role.name}</Text>
                  <Text style={styles.itemSubtitle}>{role.description}</Text>
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

        {/* System Users List */}
        {selectedTab === 'System Users' && (
          <>
            <Text style={styles.sectionTitle}>All Users</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New User</Text>
              </TouchableOpacity>
            </View>
            {usersData.map(user => (
              <View key={user.id} style={styles.listItem}>
                <View style={styles.avatar}>
                  <Icon name="account-circle" size={40} color="#6E11B0" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{user.name}</Text>
                  <Text style={styles.itemSubtitle}>{user.email}</Text>
                  <Text style={styles.itemRole}>{user.role}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setViewModalVisible(true)}>
                    <Icon name="eye" size={20} color="#4ECDC4" />
                  </TouchableOpacity>
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

        {/* Donors List */}
        {selectedTab === 'Donors' && (
          <>
            <Text style={styles.sectionTitle}>Donors</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New Donor</Text>
              </TouchableOpacity>
            </View>
            {donorsData.map(donor => (
              <View key={donor.id} style={styles.listItem}>
                <View style={styles.avatar}>
                  <Icon name="office-building" size={35} color="#6E11B0" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{donor.name}</Text>
                  <Text style={styles.itemSubtitle}>{donor.contact}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setViewModalVisible(true)}>
                    <Icon name="eye" size={20} color="#4ECDC4" />
                  </TouchableOpacity>
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
              {selectedTab === 'Roles' && 'Add New Role'}
              {selectedTab === 'System Users' && 'Add New User'}
              {selectedTab === 'Donors' && 'Add New Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={
                  selectedTab === 'Roles'
                    ? 'Enter Role Name'
                    : selectedTab === 'System Users'
                    ? 'Enter User Name'
                    : selectedTab === 'Donors'
                    ? 'Enter Donor Name'
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
                Add {selectedTab === 'Roles' && 'Role'}
                {selectedTab === 'System Users' && 'User'}
                {selectedTab === 'Donors' && 'Doner'}
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
              This {selectedTab === 'Roles' && 'Role'}
              {selectedTab === 'System Users' && 'User'}
              {selectedTab === 'Donors' && 'Donor'} be permanently deleted.
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
              {selectedTab === 'Roles' && 'Edit Role'}
              {selectedTab === 'System Users' && 'Edit User'}
              {selectedTab === 'Donors' && 'Edit Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={
                  selectedTab === 'Roles'
                    ? 'Enter Role Name'
                    : selectedTab === 'System Users'
                    ? 'Enter User Name'
                    : selectedTab === 'Donors'
                    ? 'Enter Donor Name'
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

      {/* View Modal */}
      <Modal
        transparent
        visible={viewModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setViewModalVisible(false);
        }}>
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
              alignItems: 'center',
              position: 'relative',
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
              onPress={() => {
                setViewModalVisible(false);
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Heading with Check Icon */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Icon
                name="check-circle"
                size={26}
                color="#4ECDC4"
                style={{marginRight: 8}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#6E11B0',
                  textAlign: 'center',
                }}>
                {selectedTab === 'Donors'
                  ? 'Donor Details'
                  : selectedTab === 'System Users'
                  ? 'User Details'
                  : selectedTab === 'Roles'
                  ? 'Role Details'
                  : 'Details'}
              </Text>
            </View>
            {/* Profile Picture */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 20,
                borderRadius: 50,
                overflow: 'hidden',
                width: 80,
                height: 80,
                backgroundColor: '#F0E6FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://randomuser.me/api/portraits/men/75.jpg',
                }}
                style={{width: 80, height: 80}}
                resizeMode="cover"
              />
            </View>
            {/* Dummy Data */}
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#6E11B0',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Name: <Text style={{color: '#333'}}>M Adan Hunjra</Text>
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>
                  Contact:
                </Text>{' '}
                576890876
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>
                  Address:
                </Text>{' '}
                Kalasky
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>
                  District:
                </Text>{' '}
                Gujranwala District
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>Zone:</Text>{' '}
                Gujranwala Zone
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>UC:</Text> UC
                4
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Users;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 20,
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
  itemSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemRole: {
    fontSize: 12,
    color: '#6E11B0',
    fontWeight: '600',
    marginTop: 4,
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
});
