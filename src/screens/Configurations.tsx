import {
  Animated,
  BackHandler,
  Easing,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message';
import Sidebar from '../components/Sidebar';

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

interface DonTypes {
  _id: string;
  dontype: string;
}

const Configurations = ({navigation}: any) => {
  const [selectedTab, setSelectedTab] = useState('District');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [districts, setDistricts] = useState<Districts[]>([]);
  const [allUC, setAllUC] = useState<UC[]>([]);
  const [allZone, setAllZone] = useState<Zones[]>([]);
  const [allDonType, setAllDonType] = useState<DonTypes[]>([]);
  const [dist, setDist] = useState('');
  const [uc, setUc] = useState('');
  const [zone, setZone] = useState('');
  const [donType, setDonType] = useState('');
  const [updateDist, setUpdateDist] = useState('');
  const [updateUc, setUpdateUc] = useState('');
  const [updateZone, setUpdateZone] = useState('');
  const [updateDonType, setUpdateDonType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Array<{_id: string}>>([]);
  const [showSignOut, setShowSignOut] = useState(false);
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchZone, setSearchZone] = useState('');
  const [searchUC, setSearchUC] = useState('');
  const [searchDonType, setSearchDonType] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Get Districts
  const getAllDist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/District/getAllDist`);
      setDistricts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete District
  const deleteDist = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/District/delDist/${selected[0]._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'District deleted successfully!',
          visibilityTime: 1500,
        });
        getAllDist();
        setDeleteModalVisible(false);
        setSelected([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Update District
  const updateDistrict = async () => {
    if (!updateDist.trim()) {
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
        d =>
          d.district.trim().toLowerCase() === updateDist.trim().toLowerCase(),
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

      const res = await axios.put(
        `${BASE_URL}/District/updateDist/${selected[0]._id}`,
        {
          district: updateDist.trim(),
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'District Updated successfully!',
          visibilityTime: 1500,
        });
        setUpdateDist('');
        setEditModalVisible(false);
        setSelected([]);
        getAllDist();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Zones
  const getAllZone = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/Zone/getAllZone`);
      setAllZone(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Zone
  const deleteZone = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/Zone/delZone/${selected[0]._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Zone deleted successfully!',
          visibilityTime: 1500,
        });
        getAllZone();
        setDeleteModalVisible(false);
        setSelected([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Zone
  const editZone = async () => {
    if (!updateZone.trim()) {
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
      const exists = allZone.some(
        d => d.zname.trim().toLowerCase() === updateZone.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate District',
          text2: 'A Zone with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/Zone/updateZone/${selected[0]._id}`,
        {
          zname: updateZone.trim(),
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Zone Updated successfully!',
          visibilityTime: 1500,
        });
        setUpdateZone('');
        setEditModalVisible(false);
        setSelected([]);
        getAllZone();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get UC
  const getAllUC = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/UC/getAllUC`);
      setAllUC(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete UC
  const deleteUC = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`${BASE_URL}/UC/delUC/${selected[0]._id}`);

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'UC deleted successfully!',
          visibilityTime: 1500,
        });
        getAllUC();
        setDeleteModalVisible(false);
        setSelected([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Update UC
  const editUC = async () => {
    if (!updateUc.trim()) {
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
      const exists = allUC.some(
        d => d.uname.trim().toLowerCase() === updateUc.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate District',
          text2: 'A UC with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/UC/updateUC/${selected[0]._id}`,
        {
          uname: updateUc.trim(),
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'UC Updated successfully!',
          visibilityTime: 1500,
        });
        setUpdateUc('');
        setEditModalVisible(false);
        setSelected([]);
        getAllUC();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Donations Type
  const getAllDonType = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/donType/getAllDonType`);
      setAllDonType(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Donation Type
  const deleteDonType = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/dontype/delType/${selected[0]._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation Type deleted successfully!',
          visibilityTime: 1500,
        });
        getAllDonType();
        setDeleteModalVisible(false);
        setSelected([]);
      }
    } catch (error) {
      console.log(error);
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
        setModalVisible(false);
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
      const exists = allUC.some(
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
        setModalVisible(false);
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
      const exists = allZone.some(
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
        setModalVisible(false);
        getAllZone();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Add Donation Type
  const addDonType = async () => {
    if (!donType.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a Donation Type name.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);

      const exists = allDonType.some(
        d => d.dontype.trim().toLowerCase() === donType.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate Zone',
          text2: 'A Donation Type with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.post(`${BASE_URL}/donType/addDonType`, {
        dontype: donType.trim(),
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation Type added successfully!',
          visibilityTime: 1500,
        });
        setDonType('');
        setModalVisible(false);
        getAllDonType();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Donation Type
  const editDonType = async () => {
    if (!updateDonType.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a Donation Type name.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);

      // Check if district already exists (case-insensitive)
      const exists = allDonType.some(
        d =>
          d.dontype.trim().toLowerCase() === updateDonType.trim().toLowerCase(),
      );
      if (exists) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate District',
          text2: 'A Donation with this name already exists.',
          visibilityTime: 1500,
        });
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/dontype/updateType/${selected[0]._id}`,
        {
          dontype: updateDonType.trim(),
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation Type Updated successfully!',
          visibilityTime: 1500,
        });
        setUpdateDonType('');
        setEditModalVisible(false);
        setSelected([]);
        getAllDonType();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDist();
    getAllUC();
    getAllZone();
    getAllDonType();

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

  // Tab buttons
  const tabs = [
    {id: 'District', icon: 'office-building', color: '#007AFF'},
    {id: 'Zone/Tehsil', icon: 'map-search', color: '#34C759'},
    {id: 'UC', icon: 'account-group', color: '#FF9500'},
    {id: 'Donation Type', icon: 'hand-heart', color: '#AF52DE'},
  ];

  const filteredDist = districts.filter(dist => {
    const matchesName = dist.district
      .toLowerCase()
      .includes(searchDistrict.toLowerCase());

    return matchesName;
  });

  const filteredZone = allZone.filter(zone => {
    const matchesName = zone.zname
      .toLowerCase()
      .includes(searchZone.toLowerCase());

    return matchesName;
  });

  const filteredUC = allUC.filter(uc => {
    const matchesName = uc.uname.toLowerCase().includes(searchUC.toLowerCase());

    return matchesName;
  });

  const filteredDonType = allDonType.filter(type => {
    const matchesName = type.dontype
      .toLowerCase()
      .includes(searchDonType.toLowerCase());

    return matchesName;
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
      {/* District List */}

      {selectedTab === 'District' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>Configure District</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText}>Add New District</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchFilterContainer}>
            <TextInput
              placeholder="Search District"
              placeholderTextColor="#888"
              style={[styles.textInput, {marginBottom: 0}]}
              value={searchDistrict}
              onChangeText={setSearchDistrict}
            />
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredDist.length === 0 ? (
            <Text style={styles.noDataText}>No District found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredDist.map(district => (
                <View key={district._id} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{district.district}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setSelected([district]);
                        setUpdateDist(district.district);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelected([district]);
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

      {/* Zone List */}
      {selectedTab === 'Zone/Tehsil' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>Configure Zone</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText}>Add New Zone</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchFilterContainer}>
            <TextInput
              placeholder="Search Zone"
              placeholderTextColor="#888"
              style={[styles.textInput, {marginBottom: 0}]}
              value={searchZone}
              onChangeText={setSearchZone}
            />
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredZone.length === 0 ? (
            <Text style={styles.noDataText}>No Zone found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredZone.map(zone => (
                <View key={zone._id} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{zone.zname}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setSelected([zone]);
                        setUpdateZone(zone.zname);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelected([zone]);
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

      {/* UC List */}
      {selectedTab === 'UC' && (
        <>
          <View style={styles.addBtnContainer}>
            <Text style={styles.sectionTitle}>Configure UC</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText}>Add New UC</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchFilterContainer}>
            <TextInput
              placeholder="Search Union Council"
              placeholderTextColor="#888"
              style={[styles.textInput, {marginBottom: 0}]}
              value={searchUC}
              onChangeText={setSearchUC}
            />
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredUC.length === 0 ? (
            <Text style={styles.noDataText}>No UC found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredUC.map(uc => (
                <View key={uc._id} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{uc.uname}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setSelected([uc]);
                        setUpdateUc(uc.uname);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelected([uc]);
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

      {/* Donation Type List */}
      {selectedTab === 'Donation Type' && (
        <>
          <View style={[styles.addBtnContainer, {flexWrap: 'wrap'}]}>
            <View style={{flex: 1, paddingRight: 10}}>
              <Text
                style={[
                  styles.sectionTitle,
                  {fontSize: 14, flexShrink: 1, flexWrap: 'wrap'},
                ]}
                numberOfLines={2}
                ellipsizeMode="tail">
                Configure Donation Type
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  maxWidth: 160,
                  flexShrink: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
              onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={18} color={'#fff'} />
              <Text style={styles.btnText} numberOfLines={2}>
                Add Donation Type
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchFilterContainer}>
            <TextInput
              placeholder="Search Donation Type"
              placeholderTextColor="#888"
              style={[styles.textInput, {marginBottom: 0}]}
              value={searchDonType}
              onChangeText={setSearchDonType}
            />
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : filteredDonType.length === 0 ? (
            <Text style={styles.noDataText}>No Donation Type found</Text>
          ) : (
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {filteredDonType.map(type => (
                <View key={type._id} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{type.dontype}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setSelected([type]);
                        setUpdateDonType(type.dontype);
                      }}>
                      <Icon name="pencil" size={20} color="#6E11B0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setDeleteModalVisible(true);
                        setSelected([type]);
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

      {/* Add Modal */}
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
                value={
                  selectedTab === 'District'
                    ? dist
                    : selectedTab === 'Zone/Tehsil'
                    ? zone
                    : selectedTab === 'UC'
                    ? uc
                    : selectedTab === 'Donation Type'
                    ? donType
                    : ''
                }
                onChangeText={
                  selectedTab === 'District'
                    ? t => setDist(t)
                    : selectedTab === 'Zone/Tehsil'
                    ? t => setZone(t)
                    : selectedTab === 'UC'
                    ? t => setUc(t)
                    : selectedTab === 'Donation Type'
                    ? t => setDonType(t)
                    : () => {}
                }
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
                selectedTab === 'District' && addDist();
                selectedTab === 'Zone/Tehsil' && addZone();
                selectedTab === 'UC' && addUC();
                selectedTab === 'Donation Type' && addDonType();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
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
                  paddingVertical: 10,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  selectedTab === 'District' && deleteDist();
                  selectedTab === 'Zone/Tehsil' && deleteZone();
                  selectedTab === 'UC' && deleteUC();
                  selectedTab === 'Donation Type' && deleteDonType();
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
        onRequestClose={() => {
          setEditModalVisible(false);
          setSelected([]);
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
                setEditModalVisible(false);
                setUpdateDist('');
                setUpdateZone('');
                setUpdateUc('');
                setUpdateDonType('');
                setSelected([]);
              }}>
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
                value={
                  selectedTab === 'District'
                    ? updateDist
                    : selectedTab === 'Zone/Tehsil'
                    ? updateZone
                    : selectedTab === 'UC'
                    ? updateUc
                    : selectedTab === 'Donation Type'
                    ? updateDonType
                    : ''
                }
                onChangeText={
                  selectedTab === 'District'
                    ? t => setUpdateDist(t)
                    : selectedTab === 'Zone/Tehsil'
                    ? t => setUpdateZone(t)
                    : selectedTab === 'UC'
                    ? t => setUpdateUc(t)
                    : selectedTab === 'Donation Type'
                    ? t => setUpdateDonType(t)
                    : () => {}
                }
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
            {/* Edit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#6E11B0',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => {
                selectedTab === 'District' && updateDistrict();
                selectedTab === 'Zone/Tehsil' && editZone();
                selectedTab === 'UC' && editUC();
                selectedTab === 'Donation Type' && editDonType();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 14}}>
                Save Changes
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
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#6E11B0',
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
  searchFilterContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
});
