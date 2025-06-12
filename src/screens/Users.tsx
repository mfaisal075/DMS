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
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message';
import {Animated, Easing, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Roles {
  _id: string;
  role: string;
}

interface SystemUsers {
  _id: string;
  name: string;
  email: string;
  roleId: {
    _id: string;
    role: string;
  };
  img: string;
  cnic: string;
  contact: string;
}

interface AddUser {
  name: string;
  email: string;
  contact: string;
  cnic: string;
  password: string;
  confirmPassword: string;
  img: string;
}

const initialAddUserForm: AddUser = {
  name: '',
  email: '',
  contact: '',
  cnic: '',
  password: '',
  confirmPassword: '',
  img: '',
};

const Users = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Roles');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState('');
  const [updateRole, setUpdateRole] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | ''>('');
  const [selectedUser, setSelectedUser] = useState<SystemUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState('');
  const [addUserForm, setAddUserForm] = useState<AddUser>(initialAddUserForm);

  const [rolesData, setRolesData] = useState<Roles[]>([]);
  const [usersData, setUsersData] = useState<SystemUsers[]>([]);

  const userOnChange = async (field: keyof AddUser, value: string) => {
    setAddUserForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const [roles, setRoles] = useState<Roles[]>([]);
  const transformedRoles = roles.map(role => ({
    label: role.role,
    value: role._id,
  }));

  // Get Roles
  const getAllRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/Role/getAllRoles`);
      setRolesData(res.data);
      setRoles(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Add Role
  const addRole = async () => {
    if (!role) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a role name.',
        visibilityTime: 1500,
      });
      return;
    }

    // Check if role already exists (case-insensitive)
    const exists = rolesData.some(
      r => r.role.trim().toLowerCase() === role.trim().toLowerCase(),
    );
    if (exists) {
      Toast.show({
        type: 'error',
        text1: 'Duplicate Role',
        text2: 'A role with this name already exists.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/Role/addRole`, {
        role: role.trim(),
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Role added successfully!',
          visibilityTime: 1500,
        });
        setRole('');
        setModalVisible(false);
        getAllRoles();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Delete Role
  const deleteRole = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/Role/delRole/${selectedRole}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Role deleted successfully!',
          visibilityTime: 1500,
        });
        getAllRoles();
        setSelectedRole('');
        setDeleteModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Update Role
  const editRole = async () => {
    if (!updateRole) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a role name.',
        visibilityTime: 1500,
      });
      return;
    }

    // Check if role already exists (case-insensitive)
    const exists = rolesData.some(
      r => r.role.trim().toLowerCase() === updateRole.trim().toLowerCase(),
    );
    if (exists) {
      Toast.show({
        type: 'error',
        text1: 'Duplicate Role',
        text2: 'A role with this name already exists.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/Role/updatRole/${selectedRole}`,
        {
          role: updateRole.trim(),
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Role updated successfully!',
          visibilityTime: 1500,
        });
      }

      getAllRoles();
      setUpdateRole(''), setSelectedRole('');
      setEditModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Users
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/SystemUser/getUser`);
      setUsersData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Delete User
  const deleteUser = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/SystemUser/delUser/${selectedUser[0]?._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Role deleted successfully!',
          visibilityTime: 1500,
        });
        getUsers();
        setSelectedUser([]);
        setDeleteModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Add System User
  const addUser = async () => {
    // Validation checks
    if (
      !addUserForm.name.trim() ||
      !addUserForm.email.trim() ||
      !addUserForm.contact.trim() ||
      !addUserForm.cnic.trim() ||
      !addUserForm.password.trim() ||
      !addUserForm.confirmPassword.trim() ||
      !value
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields and select a role.',
        visibilityTime: 1500,
      });
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addUserForm.email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
        visibilityTime: 1500,
      });
      return;
    }

    // Password match check
    if (addUserForm.password.trim() !== addUserForm.confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/SystemUser/addUser`, {
        name: addUserForm.name.trim(),
        email: addUserForm.email.trim(),
        contact: addUserForm.contact.trim(),
        cnic: addUserForm.cnic.trim(),
        password: addUserForm.password.trim(),
        confirmPassword: addUserForm.confirmPassword.trim(),
        roleId: value,
        img: addUserForm.img,
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User added successfully!',
          visibilityTime: 1500,
        });
        setAddUserForm(initialAddUserForm);
        setAddModalVisible('');
        getUsers();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data?.message || 'Failed to add user.',
          visibilityTime: 1500,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to add user.',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for each category

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

  useEffect(() => {
    getAllRoles();
    getUsers();
  }, []);

  const LoadingSpinner = () => {
    const spinValue = new Animated.Value(0);

    useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }, []);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSquare}>
          <Animated.View
            style={[styles.dashedCircle, {transform: [{rotate: spin}]}]}
          />
        </View>
      </View>
    );
  };

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
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{paddingBottom: 40}}>
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
            {loading ? (
              <LoadingSpinner />
            ) : rolesData.length === 0 ? (
              <Text style={styles.noDataText}>No roles found</Text>
            ) : (
              rolesData.map(role => (
                <View key={role._id} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{role.role}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedRole(role._id);
                        setUpdateRole(role.role);
                        setEditModalVisible(true);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedRole(role._id);
                        setDeleteModalVisible(true);
                      }}>
                      <Icon name="delete" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* System Users List */}
        {selectedTab === 'System Users' && (
          <>
            <Text style={styles.sectionTitle}>All Users</Text>
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddModalVisible('User')}>
                <Icon name="plus" size={18} color={'#fff'} />
                <Text style={styles.btnText}>Add New User</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <LoadingSpinner />
            ) : rolesData.length === 0 ? (
              <Text style={styles.noDataText}>No Users found</Text>
            ) : (
              usersData.map(user => (
                <View key={user._id} style={styles.listItem}>
                  <View style={styles.avatar}>
                    <Icon name="account-circle" size={40} color="#6E11B0" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{user.name}</Text>
                    <Text style={styles.itemSubtitle}>{user.email}</Text>

                    <Text style={styles.itemRole}>
                      {user.roleId && user.roleId.role
                        ? user.roleId.role
                        : 'User'}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedUser([user]);
                        setViewModalVisible(true);
                      }}>
                      <Icon name="eye" size={20} color="#4ECDC4" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setEditModalVisible(true)}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelectedUser([user]);
                      }}>
                      <Icon name="delete" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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

      {/* Add Role Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Toast />
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
                    : selectedTab === 'Donors'
                    ? 'Enter Donor Name'
                    : ''
                }
                value={selectedTab === 'Roles' ? role : ''}
                onChangeText={selectedTab === 'Roles' ? setRole : () => {}}
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
              onPress={() => {
                selectedTab === 'Roles' && addRole();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                Add {selectedTab === 'Roles' && 'Role'}
                {selectedTab === 'System Users' && 'User'}
                {selectedTab === 'Donors' && 'Doner'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add System Users */}
      <Modal
        transparent
        visible={addModalVisible === 'User'}
        animationType="fade"
        onRequestClose={() => setAddModalVisible('')}>
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
              onPress={() => {
                setAddModalVisible('');
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'System Users' && 'Add New User'}
              {selectedTab === 'Donors' && 'Add New Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter Name'}
                value={addUserForm.name}
                onChangeText={t => userOnChange('name', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Enter Email'}
                value={addUserForm.email}
                onChangeText={t => userOnChange('email', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Enter Contact'}
                value={addUserForm.contact}
                onChangeText={t => userOnChange('contact', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Enter CNIC'}
                value={addUserForm.cnic}
                onChangeText={t => userOnChange('cnic', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TouchableOpacity
                style={[
                  styles.textInput,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 15,
                    backgroundColor: '#F8F9FC',
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  // TODO: Implement file picker logic here
                }}>
                <Text
                  style={{
                    color: addUserForm.img ? '#222' : '#888',
                    fontSize: 16,
                  }}>
                  {addUserForm.img ? 'File Selected' : 'Choose File'}
                </Text>
                <Icon name="file-upload" size={22} color="#6E11B0" />
              </TouchableOpacity>
              <TextInput
                placeholder={'Enter Password'}
                value={addUserForm.password}
                onChangeText={t => userOnChange('password', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Confirm Password'}
                value={addUserForm.confirmPassword}
                onChangeText={t => userOnChange('confirmPassword', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <View style={[styles.dropDownContainer, {width: '100%'}]}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={transformedRoles}
                  setOpen={setOpen}
                  setValue={setValue}
                  placeholder="Select Role"
                  placeholderStyle={{
                    color: '#888',
                    fontSize: 16,
                  }}
                  ArrowUpIconComponent={() => (
                    <Icon name="chevron-up" size={25} color="#6E11B0" />
                  )}
                  ArrowDownIconComponent={() => (
                    <Icon name="chevron-down" size={25} color="#6E11B0" />
                  )}
                  style={styles.dropDown}
                  textStyle={{
                    fontSize: 14,
                    color: '#222',
                  }}
                  labelProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  dropDownContainerStyle={{
                    borderRadius: 12,
                    maxHeight: 200,
                    zIndex: 1000,
                  }}
                  listItemContainerStyle={{
                    height: 45,
                  }}
                  listItemLabelStyle={{
                    fontSize: 16,
                    color: '#222',
                    overflow: 'hidden',
                  }}
                />
              </View>
            </View>
            {/* Buttons Row */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  addUser();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                  Add User
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
                onPress={() => setAddModalVisible('')}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
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
                  selectedTab === 'Roles' && deleteRole();
                  selectedTab === 'System Users' && deleteUser();
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
        animationType="fade"
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
                value={selectedTab === 'Roles' ? updateRole : ''}
                onChangeText={
                  selectedTab === 'Roles' ? setUpdateRole : () => {}
                }
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
              onPress={() => {
                selectedTab === 'Roles' && editRole();
              }}>
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
        animationType="fade"
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
                setSelectedUser([]);
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
                User Details
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
                  uri: selectedUser[0]?.img
                    ? selectedUser[0]?.img
                    : 'https://randomuser.me/api/portraits/men/1.jpg',
                }}
                style={{width: 80, height: 80}}
                resizeMode="cover"
              />
            </View>

            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#6E11B0',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Name:{' '}
                <Text style={{color: '#333'}}>{selectedUser[0]?.name}</Text>
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>
                  Contact:
                </Text>{' '}
                {selectedUser[0]?.contact}
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>Email:</Text>{' '}
                {selectedUser[0]?.email}
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>CNIC:</Text>{' '}
                {selectedUser[0]?.cnic}
              </Text>
              <Text style={{fontSize: 15, color: '#555', marginBottom: 6}}>
                <Text style={{fontWeight: 'bold', color: '#666'}}>Role:</Text>{' '}
                {selectedUser[0]?.roleId?.role
                  ? selectedUser[0]?.roleId?.role
                  : 'User'}
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

  //Loading Component
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSquare: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  dashedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 7,
    borderColor: '#6E11B0',
    ...Platform.select({
      ios: {
        borderStyle: 'dashed',
      },
      android: {
        borderStyle: 'dotted',
      },
    }),
  },
  noDataText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FC',
    marginBottom: 15,
  },
  dropDownContainer: {
    width: '100%',
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
  },
});
