import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message';
import {Animated, Easing, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Sidebar from '../components/Sidebar';

interface Roles {
  _id: string;
  role: string;
}

interface Districts {
  _id: string;
  district: string;
}

interface UC {
  _id: string;
  uname: string;
}

interface Zones {
  _id: string;
  zname: string;
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

interface UpdateUser {
  name: string;
  email: string;
  contact: string;
  cnic: string;
  img: string;
}

const initialUpdateUserForm: UpdateUser = {
  name: '',
  email: '',
  contact: '',
  cnic: '',
  img: '',
};

interface Donors {
  _id: string;
  name: string;
  contact: string;
  address: string;
  districtId: {
    _id: string;
    district: string;
  };
  zoneId: {
    _id: string;
    zname: string;
  };
  ucId: {
    _id: string;
    uname: string;
  };
}

interface AddDonor {
  name: string;
  contact: string;
  address: string;
}

const initialAddDonorForm: AddDonor = {
  address: '',
  contact: '',
  name: '',
};

const Users = ({navigation}: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [distValue, setDistValue] = useState<string | null>(null);
  const [distOpen, setDistOpen] = useState(false);
  const [ucOpen, setUCOpen] = useState(false);
  const [ucValue, setUCValue] = useState<string | null>(null);
  const [zoneValue, setZoneValue] = useState<string | null>(null);
  const [zoneOpen, setZoneOpen] = useState(false);
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
  const [updateForm, setUpdateForm] = useState<UpdateUser>(
    initialUpdateUserForm,
  );
  const [selectedUserID, setSelectedUserID] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<Donors[]>([]);
  const [addDonorForm, setAddDonorForm] =
    useState<AddDonor>(initialAddDonorForm);
  const [rolesData, setRolesData] = useState<Roles[]>([]);
  const [usersData, setUsersData] = useState<SystemUsers[]>([]);
  const [donors, setDonors] = useState<Donors[]>([]);
  const [dist, setDist] = useState('');
  const [zone, setZone] = useState('');
  const [uc, setUc] = useState('');
  const [donorAddModal, setDonorAddModal] = useState('');
  const [updateDonorForm, setDonorUpdateForm] =
    useState<AddDonor>(initialAddDonorForm);
  const [searchName, setSearchName] = useState('');
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const [roleFilterValue, setRoleFilterValue] = useState<string | null>(null);
  const [searchDonor, setSearchDonor] = useState('');
  const [distFilterOpen, setDistFilterOpen] = useState(false);
  const [distFilterValue, setDistFilterValue] = useState<string | null>(null);
  const [ucFilterOpen, setUcFilterOpen] = useState(false);
  const [ucFilterValue, setUcFilterValue] = useState<string | null>(null);
  const [zoneFilterOpen, setZoneFilterOpen] = useState(false);
  const [zoneFilterValue, setZoneFilterValue] = useState<string | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const userOnChange = async (field: keyof AddUser, value: string) => {
    setAddUserForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateOnChange = async (field: keyof UpdateUser, value: string) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const donorOnChange = async (field: keyof AddDonor, value: string) => {
    setAddDonorForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const donorUpdateOnChange = async (field: keyof AddDonor, value: string) => {
    setDonorUpdateForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Roles DropDown Picker
  const [roles, setRoles] = useState<Roles[]>([]);
  const transformedRoles = roles.map(role => ({
    label: role.role,
    value: role._id,
  }));

  // District Dropdown
  const [districts, setDistricts] = useState<Districts[]>([]);
  const transformedDist = districts.map(dist => ({
    label: dist.district,
    value: dist._id,
  }));

  // UC Dropdown
  const [ucItems, setUCItems] = useState<UC[]>([]);
  const transformedUC = ucItems.map(uc => ({
    label: uc.uname,
    value: uc._id,
  }));

  // Zone Dropdown
  const [zoneItems, setZoneItems] = useState<Zones[]>([]);
  const transformedZone = zoneItems.map(zone => ({
    label: zone.zname,
    value: zone._id,
  }));

  //Pick Image
  const pickImage = async () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
    };

    const result = await launchImageLibrary(options);

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      console.log('Image URI:', image.uri);
      return image; // Return the image object
    } else {
      console.log('Image not selected');
      return null;
    }
  };

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
  //Get Districts
  const getAllDist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/District/getAllDist`);
      setDistricts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // Get UC
  const getAllUC = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/UC/getAllUC`);
      setUCItems(res.data);
    } catch (error) {}
  };
  // Get Zones
  const getAllZone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Zone/getAllZone`);

      setZoneItems(res.data);
    } catch (error) {
      console.log(error);
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
  // Update User
  const updateUser = async () => {
    // Validation checks
    if (
      !updateForm.name.trim() ||
      !updateForm.email.trim() ||
      !updateForm.contact.trim() ||
      !updateForm.cnic.trim() ||
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
    if (!emailRegex.test(updateForm.email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/SystemUser/EditUserById/${selectedUserID}`,
        {
          name: updateForm.name.trim(),
          email: updateForm.email.trim(),
          contact: updateForm.contact,
          cnic: updateForm.cnic,
          roleId: value,
          img: updateForm.img,
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User updated successfully!',
          visibilityTime: 1500,
        });
        setUpdateForm(initialUpdateUserForm);
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

  // Get Donors
  const getDonors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/Donor/getDonors`);
      setDonors(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Delete Donor
  const deleteDonor = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/Donor/delDonor/${selectedDonor[0]?._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donor deleted successfully!',
          visibilityTime: 1500,
        });
        getDonors();
        setSelectedDonor([]);
        setDeleteModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Add Donor
  const addDonor = async () => {
    if (
      !addDonorForm.name.trim() ||
      !addDonorForm.contact.trim() ||
      !addDonorForm.address.trim() ||
      !distValue ||
      !zoneValue ||
      !ucValue
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields and select District, Zone, and UC.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/Donor/addDonor`, {
        name: addDonorForm.name.trim(),
        contact: addDonorForm.contact.trim(),
        address: addDonorForm.address.trim(),
        districtId: distValue,
        zoneId: zoneValue,
        ucId: ucValue,
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donor added successfully!',
          visibilityTime: 1500,
        });
        setAddDonorForm(initialAddDonorForm);
        setDistValue(null);
        setZoneValue(null);
        setUCValue(null);
        setAddModalVisible('');
        getDonors();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data?.message || 'Failed to add donor.',
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
          'Failed to add donor.',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  // Add District
  const addDist = async () => {
    if (!dist.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a district name.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      // Check if district already exists (case-insensitive)
      const exists = districts.some(
        d => d.district.trim().toLowerCase() === dist.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate District',
          text2: 'A district with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.post(`${BASE_URL}/District/addDist`, {
        district: dist.trim(),
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'District added successfully!',
          visibilityTime: 1500,
        });
        setDist('');
        setDonorAddModal('');
        getAllDist();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Add UC
  const addUC = async () => {
    if (!uc.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a UC name.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      // Check if district already exists (case-insensitive)
      const exists = ucItems.some(
        d => d.uname.trim().toLowerCase() === uc.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate UC',
          text2: 'A UC with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.post(`${BASE_URL}/UC/addUC`, {
        uname: uc.trim(),
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'UC added successfully!',
          visibilityTime: 1500,
        });
        setUc('');
        setDonorAddModal('');
        getAllUC();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Add Zone
  const addZone = async () => {
    if (!zone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a Zone name.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      // Check if district already exists (case-insensitive)
      const exists = zoneItems.some(
        d => d.zname.trim().toLowerCase() === zone.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate Zone',
          text2: 'A Zone with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.post(`${BASE_URL}/Zone/addZone`, {
        zname: zone.trim(),
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Zone added successfully!',
          visibilityTime: 1500,
        });
        setZone('');
        setDonorAddModal('');
        getAllZone();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //Update Donor
  const updateDonor = async () => {
    if (
      !updateDonorForm.name.trim() ||
      !updateDonorForm.contact.trim() ||
      !updateDonorForm.address.trim() ||
      !distValue ||
      !zoneValue ||
      !ucValue
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields and select District, Zone, and UC.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/Donor/updateDonor/${selectedDonor[0]._id}`,
        {
          address: updateDonorForm.address.trim(),
          contact: updateDonorForm.contact,
          districtId: distValue,
          name: updateDonorForm.name.trim(),
          ucId: ucValue,
          zoneId: zoneValue,
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donor added successfully!',
          visibilityTime: 1500,
        });
        setDonorUpdateForm(initialAddDonorForm);
        setDistValue(null);
        setZoneValue(null);
        setUCValue(null);
        setAddModalVisible('');
        getDonors();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data?.message || 'Failed to add donor.',
          visibilityTime: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Tab buttons
  const tabs = [
    {id: 'Roles', icon: 'account-key', color: '#FF6B6B'},
    {id: 'Users', icon: 'account-cog', color: '#4ECDC4'},
    {id: 'Donors', icon: 'account-heart', color: '#FFD166'},
  ];

  useEffect(() => {
    getAllRoles();
    getUsers();
    getDonors();
    getAllDist();
    getAllUC();
    getAllZone();

    // Handle Back Press
    const handleBack = () => {
      navigation.navigate('Dashboard');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => backHandler.remove();
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

  const filteredUsers = usersData.filter(user => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchesRole =
      !roleFilterValue || user.roleId?._id === roleFilterValue;

    return matchesName && matchesRole;
  });

  const filteredDonors = donors.filter(donor => {
    const matchesName = donor.name
      .toLowerCase()
      .includes(searchDonor.toLowerCase());

    const matchesDist =
      !distFilterValue || donor.districtId?._id === distFilterValue;

    const matchesZone =
      !zoneFilterValue || donor.zoneId?._id === distFilterValue;
    const matchesUC = !ucFilterValue || donor.ucId?._id === ucFilterValue;

    return matchesName && matchesDist && matchesZone && matchesUC;
  });

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
          <Icon name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require('../assets/logo-black.png')}
          style={{width: 100, height: 100}}
          tintColor={'#fff'}
          resizeMode="contain"
        />

        {/* User Icon with Sign Out Dropdown */}
        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => setShowSignOut(prev => !prev)}>
            <Icon name="account-circle" size={45} color="#fff" />
          </TouchableOpacity>
          {showSignOut && (
            <View
              style={{
                position: 'absolute',
                top: 50,
                right: 0,
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 8,
                paddingVertical: 8,
                minWidth: 140,
                alignItems: 'flex-start',
                zIndex: 9999,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  width: '100%',
                }}
                onPress={() => {
                  setShowSignOut(false);
                  navigation.replace('Login');
                }}>
                <Icon
                  name="logout"
                  size={22}
                  color="#6E11B0"
                  style={{marginRight: 10}}
                />
                <Text
                  style={{color: '#6E11B0', fontWeight: '600', fontSize: 15}}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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

      {/* Roles List */}
      {selectedTab === 'Roles' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>User Roles</Text>
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
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {rolesData.map(role => (
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
              ))}
            </ScrollView>
          )}
        </>
      )}

      {/* Users List */}
      {selectedTab === 'Users' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>All Users</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible('User')}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText}>Add New User</Text>
            </TouchableOpacity>
          </View>
          {/* Filters */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              paddingHorizontal: '6%',
            }}>
            {/* Search by Name */}
            <View style={{flex: 1, marginRight: 8}}>
              <TextInput
                placeholder="Search by Name"
                placeholderTextColor="#888"
                style={[styles.textInput, {marginBottom: 0}]}
                value={searchName}
                onChangeText={setSearchName}
              />
            </View>
            {/* Search by Role */}
            <View style={{flex: 1}}>
              <DropDownPicker
                open={roleFilterOpen}
                value={roleFilterValue}
                items={transformedRoles}
                setOpen={setRoleFilterOpen}
                setValue={setRoleFilterValue}
                placeholder="Filter by Role"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 14,
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
                  zIndex: 1002,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
                containerStyle={{zIndex: 1002}}
                onChangeValue={val => setRoleFilterValue(val)}
              />
            </View>
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredUsers.length === 0 ? (
            <Text style={styles.noDataText}>No Users found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredUsers.map(user => (
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
                      onPress={() => {
                        setAddModalVisible('updateUser');
                        setUpdateForm({
                          name: user.name,
                          email: user.email,
                          contact: user.contact,
                          cnic: user.cnic,
                          img: user.img,
                        });
                        setValue(user.roleId?._id);
                        setSelectedUserID(user._id);
                      }}>
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
              ))}
            </ScrollView>
          )}
        </>
      )}

      {/* Donors List */}
      {selectedTab === 'Donors' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>Donors</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible('Donor')}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText}>Add New Donor</Text>
            </TouchableOpacity>
          </View>
          {/* Filters for Donors */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              paddingHorizontal: '6%',
              marginBottom: 10,
              zIndex: 1003, // Highest zIndex for District filter
            }}>
            {/* Search by Donor Name */}
            <View style={{flex: 1, marginRight: 8}}>
              <TextInput
                placeholder="Search by Donor Name"
                placeholderTextColor="#888"
                style={[styles.textInput, {marginBottom: 0}]}
                value={searchDonor}
                onChangeText={setSearchDonor}
              />
            </View>
            {/* Search by District */}
            <View style={{flex: 1, zIndex: 1003}}>
              <DropDownPicker
                open={distFilterOpen}
                value={distFilterValue}
                items={transformedDist}
                setOpen={setDistFilterOpen}
                setValue={setDistFilterValue}
                placeholder="Filter by District"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 14,
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
                  zIndex: 1003,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 14,
                  color: '#222',
                  overflow: 'hidden',
                }}
                containerStyle={{zIndex: 1003}}
                onChangeValue={val => setDistFilterValue(val)}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: '6%',
              marginBottom: 10,
              zIndex: 1002, // Lower than District, higher than UC
            }}>
            {/* Search by Zone */}
            <View style={{flex: 1, marginRight: 8, zIndex: 1002}}>
              <DropDownPicker
                open={zoneFilterOpen}
                value={zoneFilterValue}
                items={transformedZone}
                setOpen={setZoneFilterOpen}
                setValue={setZoneFilterValue}
                placeholder="Filter by Zone"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 14,
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
                  zIndex: 1002,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 14,
                  color: '#222',
                  overflow: 'hidden',
                }}
                containerStyle={{zIndex: 1002}}
                onChangeValue={val => setZoneFilterValue(val)}
              />
            </View>
            {/* Search by UC */}
            <View style={{flex: 1, zIndex: 1001}}>
              <DropDownPicker
                open={ucFilterOpen}
                value={ucFilterValue}
                items={transformedUC}
                setOpen={setUcFilterOpen}
                setValue={setUcFilterValue}
                placeholder="Filter by UC"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 14,
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
                  zIndex: 1001,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 14,
                  color: '#222',
                  overflow: 'hidden',
                }}
                containerStyle={{zIndex: 1001}}
                onChangeValue={val => setUcFilterValue(val)}
              />
            </View>
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredDonors.length === 0 ? (
            <Text style={styles.noDataText}>No Donor found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredDonors.map(donor => (
                <View key={donor._id} style={styles.listItem}>
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
                      onPress={() => {
                        setViewModalVisible(true);
                        setSelectedDonor([donor]);
                      }}>
                      <Icon name="eye" size={20} color="#4ECDC4" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setAddModalVisible('UpdateDonor');
                        setDonorUpdateForm({
                          name: donor.name,
                          address: donor.address,
                          contact: donor.contact,
                        });
                        setSelectedDonor([donor]);
                        setDistValue(donor.districtId?._id);
                        setUCValue(donor.ucId?._id);
                        setZoneValue(donor.zoneId?._id);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelectedDonor([donor]);
                      }}>
                      <Icon name="delete" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}

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
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'Roles' && 'Add New Role'}
              {selectedTab === 'Users' && 'Add New User'}
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
                  fontSize: 14,
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
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                Add {selectedTab === 'Roles' && 'Role'}
                {selectedTab === 'Users' && 'User'}
                {selectedTab === 'Donors' && 'Doner'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Users */}
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
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'Users' && 'Add New User'}
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
                    fontSize: 14,
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
                    fontSize: 14,
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  addUser();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                  Add User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => setAddModalVisible('')}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 14}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Donor */}
      <Modal
        transparent
        visible={addModalVisible === 'Donor'}
        animationType="fade"
        onRequestClose={() => {
          setAddModalVisible('');
          setDistValue(null);
          setUCValue(null);
          setZoneValue(null);
          setAddDonorForm(initialAddDonorForm);
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
                setAddDonorForm(initialAddDonorForm);
                setDistValue(null);
                setUCValue(null);
                setZoneValue(null);
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'Users' && 'Add New User'}
              {selectedTab === 'Donors' && 'Add New Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter Name'}
                value={addDonorForm.name}
                onChangeText={t => donorOnChange('name', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Enter Contact'}
                value={addDonorForm.contact}
                onChangeText={t => donorOnChange('contact', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
                keyboardType="number-pad"
              />
              <TextInput
                placeholder={'Enter Address'}
                value={addDonorForm.address}
                onChangeText={t => donorOnChange('address', t)}
                placeholderTextColor={'#888'}
                style={[
                  styles.textInput,
                  {
                    height: 100,
                    textAlignVertical: 'top',
                  },
                ]}
                multiline
                numberOfLines={4}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                <View
                  style={[styles.dropDownContainer, {flex: 1, marginRight: 8}]}>
                  <DropDownPicker
                    open={distOpen}
                    value={distValue}
                    items={transformedDist}
                    setOpen={setDistOpen}
                    setValue={setDistValue}
                    placeholder="Select District"
                    placeholderStyle={{
                      color: '#888',
                      fontSize: 14,
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
                      zIndex: 1001,
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#6E11B0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setDonorAddModal('District');
                  }}>
                  <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                <View
                  style={[styles.dropDownContainer, {flex: 1, marginRight: 8}]}>
                  <DropDownPicker
                    open={ucOpen}
                    value={ucValue}
                    items={transformedUC}
                    setOpen={setUCOpen}
                    setValue={setUCValue}
                    placeholder="Select UC"
                    placeholderStyle={{
                      color: '#888',
                      fontSize: 14,
                    }}
                    ArrowUpIconComponent={() => (
                      <Icon name="chevron-up" size={25} color="#6E11B0" />
                    )}
                    ArrowDownIconComponent={() => (
                      <Icon name="chevron-down" size={25} color="#6E11B0" />
                    )}
                    style={[
                      styles.dropDown,
                      {
                        zIndex: 999,
                      },
                    ]}
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
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#6E11B0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setDonorAddModal('UC');
                  }}>
                  <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={[styles.dropDownContainer, {flex: 1, marginRight: 8}]}>
                  <DropDownPicker
                    open={zoneOpen}
                    value={zoneValue}
                    items={transformedZone}
                    setOpen={setZoneOpen}
                    setValue={setZoneValue}
                    setItems={setZoneItems}
                    placeholder="Select Zone"
                    placeholderStyle={{
                      color: '#888',
                      fontSize: 14,
                    }}
                    ArrowUpIconComponent={() => (
                      <Icon name="chevron-up" size={25} color="#6E11B0" />
                    )}
                    ArrowDownIconComponent={() => (
                      <Icon name="chevron-down" size={25} color="#6E11B0" />
                    )}
                    style={[
                      styles.dropDown,
                      {
                        zIndex: 999,
                      },
                    ]}
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
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#6E11B0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setDonorAddModal('Zone');
                  }}>
                  <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  addDonor();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                  Add Donor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => {
                  setAddModalVisible('');
                  setAddDonorForm(initialAddDonorForm);
                  setDistValue(null);
                  setUCValue(null);
                  setZoneValue(null);
                }}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 14}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update User */}
      <Modal
        transparent
        visible={addModalVisible === 'updateUser'}
        animationType="fade"
        onRequestClose={() => {
          setAddModalVisible('');
          setUpdateForm(initialUpdateUserForm);
          setSelectedUserID('');
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
                setUpdateForm(initialUpdateUserForm);
                setSelectedUserID('');
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'Users' && 'Edit System User'}
              {selectedTab === 'Donors' && 'Add New Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Full Name'}
                value={updateForm.name}
                onChangeText={t => updateOnChange('name', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Email'}
                value={updateForm.email}
                onChangeText={t => updateOnChange('email', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Contact'}
                value={updateForm.contact}
                onChangeText={t => updateOnChange('contact', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'CNIC'}
                value={updateForm.cnic}
                onChangeText={t => updateOnChange('cnic', t)}
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
                    fontSize: 14,
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  updateUser();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                  Update User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => {
                  setAddModalVisible('');
                  setUpdateForm(initialUpdateUserForm);
                  setSelectedUserID('');
                }}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Donor */}
      <Modal
        transparent
        visible={addModalVisible === 'UpdateDonor'}
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
                setDonorUpdateForm(initialAddDonorForm);
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              Edit Donor
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter Name'}
                value={updateDonorForm.name}
                onChangeText={t => donorUpdateOnChange('name', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
              />
              <TextInput
                placeholder={'Enter Contact'}
                value={updateDonorForm.contact}
                onChangeText={t => donorUpdateOnChange('contact', t)}
                placeholderTextColor={'#888'}
                style={styles.textInput}
                keyboardType="number-pad"
              />
              <TextInput
                placeholder={'Enter Address'}
                value={updateDonorForm.address}
                onChangeText={t => donorUpdateOnChange('address', t)}
                placeholderTextColor={'#888'}
                style={[
                  styles.textInput,
                  {
                    height: 100,
                    textAlignVertical: 'top',
                  },
                ]}
                multiline
                numberOfLines={4}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                <View style={styles.dropDownContainer}>
                  <DropDownPicker
                    open={distOpen}
                    value={distValue}
                    items={transformedDist}
                    setOpen={setDistOpen}
                    setValue={setDistValue}
                    placeholder="Select District"
                    placeholderStyle={{
                      color: '#888',
                      fontSize: 14,
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
                      zIndex: 1001,
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                <View
                  style={[styles.dropDownContainer, {flex: 1, marginRight: 8}]}>
                  <DropDownPicker
                    open={ucOpen}
                    value={ucValue}
                    items={transformedUC}
                    setOpen={setUCOpen}
                    setValue={setUCValue}
                    placeholder="Select UC"
                    placeholderStyle={{
                      color: '#888',
                      fontSize: 14,
                    }}
                    ArrowUpIconComponent={() => (
                      <Icon name="chevron-up" size={25} color="#6E11B0" />
                    )}
                    ArrowDownIconComponent={() => (
                      <Icon name="chevron-down" size={25} color="#6E11B0" />
                    )}
                    style={[
                      styles.dropDown,
                      {
                        zIndex: 999,
                      },
                    ]}
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
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={[styles.dropDownContainer, {flex: 1, marginRight: 8}]}>
                  <DropDownPicker
                    open={zoneOpen}
                    value={zoneValue}
                    items={transformedZone}
                    setOpen={setZoneOpen}
                    setValue={setZoneValue}
                    setItems={setZoneItems}
                    placeholder="Select Zone"
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
                    style={[
                      styles.dropDown,
                      {
                        zIndex: 999,
                      },
                    ]}
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
                    }}
                    listItemContainerStyle={{
                      height: 45,
                    }}
                    listItemLabelStyle={{
                      fontSize: 14,
                      color: '#222',
                      overflow: 'hidden',
                    }}
                  />
                </View>
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  updateDonor();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => {
                  setAddModalVisible('');
                  setDonorUpdateForm(initialAddDonorForm);
                  setDistValue(null);
                  setUCValue(null);
                  setZoneValue(null);
                }}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 14}}>
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
                fontSize: 18,
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
                fontSize: 13,
                color: '#555',
                marginBottom: 28,
                textAlign: 'center',
              }}>
              This {selectedTab === 'Roles' && 'Role'}
              {selectedTab === 'Users' && 'User'}
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  selectedTab === 'Roles' && deleteRole();
                  selectedTab === 'Users' && deleteUser();
                  selectedTab === 'Donors' && deleteDonor();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                  Yes, delete it
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F6FB',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
                onPress={() => setDeleteModalVisible(false)}>
                <Text
                  style={{color: '#6E11B0', fontWeight: '700', fontSize: 14}}>
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
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              {selectedTab === 'Roles' && 'Edit Role'}
              {selectedTab === 'Users' && 'Edit User'}
              {selectedTab === 'Donors' && 'Edit Donor'}
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={
                  selectedTab === 'Roles'
                    ? 'Enter Role Name'
                    : selectedTab === 'Users'
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
          {selectedTab === 'Users' && (
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
                    fontSize: 16,
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
                    fontSize: 16,
                    color: '#6E11B0',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  Name:{' '}
                  <Text style={{color: '#333'}}>{selectedUser[0]?.name}</Text>
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>
                    Contact:
                  </Text>{' '}
                  {selectedUser[0]?.contact}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>
                    Email:
                  </Text>{' '}
                  {selectedUser[0]?.email}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>CNIC:</Text>{' '}
                  {selectedUser[0]?.cnic}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>Role:</Text>{' '}
                  {selectedUser[0]?.roleId?.role
                    ? selectedUser[0]?.roleId?.role
                    : 'User'}
                </Text>
              </View>
            </View>
          )}
          {selectedTab === 'Donors' && (
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
                  setSelectedDonor([]);
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
                    fontSize: 16,
                    color: '#6E11B0',
                    textAlign: 'center',
                  }}>
                  Donor Details
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
                    uri: 'https://randomuser.me/api/portraits/men/1.jpg',
                  }}
                  style={{width: 80, height: 80}}
                  resizeMode="cover"
                />
              </View>

              <View style={{width: '100%'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#6E11B0',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  Name:{' '}
                  <Text style={{color: '#333'}}>{selectedDonor[0]?.name}</Text>
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>
                    Contact:
                  </Text>{' '}
                  {selectedDonor[0]?.contact}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>
                    Address:
                  </Text>{' '}
                  {selectedDonor[0]?.address}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>
                    District:
                  </Text>{' '}
                  {selectedDonor[0]?.districtId?.district
                    ? selectedDonor[0]?.districtId?.district
                    : 'N/A'}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>Zone:</Text>{' '}
                  {selectedDonor[0]?.zoneId?.zname
                    ? selectedDonor[0]?.zoneId?.zname
                    : 'N/A'}
                </Text>
                <Text style={{fontSize: 13, color: '#555', marginBottom: 6}}>
                  <Text style={{fontWeight: 'bold', color: '#666'}}>UC:</Text>{' '}
                  {selectedDonor[0]?.ucId?.uname
                    ? selectedDonor[0]?.ucId?.uname
                    : 'N/A'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Add District, Zone and UC Modal */}
      <Modal
        transparent
        visible={donorAddModal === 'District'}
        animationType="fade"
        onRequestClose={() => setDonorAddModal('')}>
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
              onPress={() => setDonorAddModal('')}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Text Input */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              Add New District
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter District Name'}
                value={dist}
                onChangeText={setDist}
                placeholderTextColor={'#888'}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
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
                addDist();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                Add District
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={donorAddModal === 'UC'}
        animationType="fade"
        onRequestClose={() => setDonorAddModal('')}>
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
              onPress={() => setDonorAddModal('')}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Text Input */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              Add Union Council
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter District Name'}
                value={uc}
                onChangeText={setUc}
                placeholderTextColor={'#888'}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
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
                addUC();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                Add Union Council
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={donorAddModal === 'Zone'}
        animationType="fade"
        onRequestClose={() => setDonorAddModal('')}>
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
              onPress={() => setDonorAddModal('')}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            {/* Text Input */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 20,
                color: '#6E11B0',
              }}>
              Add New Zone
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter District Name'}
                value={zone}
                onChangeText={setZone}
                placeholderTextColor={'#888'}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
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
                addZone();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                Add Zone
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sidebar Component */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
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
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#6E11B0',
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
    fontSize: 14,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '6%',
    paddingTop: 15,
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
    fontSize: 12,
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
    fontSize: 14,
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
