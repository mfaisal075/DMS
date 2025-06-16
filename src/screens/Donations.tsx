import {
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
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message';
import {Animated} from 'react-native';

interface Donation {
  _id: string;
  donor: {
    _id: string;
    name: string;
    contact: string;
    address: string;
  };
  receiptNumber: string;
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
  amount: string;
  date: string;
  remarks: string;
  paymentMode: string;
  donationType: {
    _id: string;
    dontype: string;
  };
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

interface DonTypes {
  _id: string;
  dontype: string;
}

interface Donors {
  _id: string;
  name: string;
  contact: string;
  address: string;
  ucId: {
    _id: string;
    uname: string;
  };
  districtId: {
    _id: string;
    district: string;
  };
  zoneId: {
    _id: string;
    zname: string;
  };
}

interface ReceiveDonation {
  amount: string;
  paymentMode: string;
  date: Date;
  remarks: string;
}

const initialDonationForm: ReceiveDonation = {
  amount: '',
  date: new Date(),
  paymentMode: '',
  remarks: '',
};

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

const Donations = ({navigation}: any) => {
  const [selectedTab, setSelectedTab] = useState('All Donations');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDon, setSelectedDon] = useState<Donation[]>([]);
  const [searchDonor, setSearchDonor] = useState('');
  const [distFilterOpen, setDistFilterOpen] = useState(false);
  const [distFilterValue, setDistFilterValue] = useState<string | null>(null);
  const [ucFilterOpen, setUCFilterOpen] = useState(false);
  const [ucFilterValue, setUCFilterValue] = useState<string | null>(null);
  const [zoneFilterOpen, setZoneFilterOpen] = useState(false);
  const [zoneFilterValue, setZoneFilterValue] = useState<string | null>(null);
  const [donTypeFilterOpen, setDonTypeFilterOpen] = useState(false);
  const [donTypeFilterValue, setDonTypeFilterValue] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [searchDonors, setSearchDonors] = useState('');
  const [donors, setDonors] = useState<[]>([]);
  const [donForm, setDonForm] = useState<ReceiveDonation>(initialDonationForm);
  const [addDonorForm, setAddDonorForm] =
    useState<AddDonor>(initialAddDonorForm);
  const [ucValue, setUCValue] = useState<string | null>(null);
  const [distValue, setDistValue] = useState<string | null>(null);
  const [zoneValue, setZoneValue] = useState<string | null>(null);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [ucOpen, setUCOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);
  const [dist, setDist] = useState('');
  const [uc, setUc] = useState('');
  const [zone, setZone] = useState('');
  const [donorAddModal, setDonorAddModal] = useState('');

  // District Dropdown
  const [districts, setDistricts] = useState<Districts[]>([]);
  const transformedDist = districts.map(dist => ({
    label: dist.district,
    value: dist._id,
  }));

  const donorOnChange = async (field: keyof AddDonor, value: string) => {
    setAddDonorForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const donFormOnChange = (
    field: keyof ReceiveDonation,
    value: string | Date,
  ) => {
    setDonForm(prev => ({
      ...prev,
      [field]: value,
    }));
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

  // Donation Type Dropdown
  const [allDonType, setAllDonType] = useState<DonTypes[]>([]);
  const transformedDonType = allDonType.map(type => ({
    label: type.dontype,
    value: type._id,
  }));

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

  // Get Donations Type
  const getAllDonType = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donType/getAllDonType`);
      setAllDonType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get All Donations
  const getReceivedDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/Donation/getReceivedDonations`);
      setDonations(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Donation
  const deleteDonation = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/Donation/delDonation/${selectedDon[0]._id}`,
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation deleted successfully!',
          visibilityTime: 1500,
        });
        getReceivedDonations();
        setModalVisible('');
        setSelectedDon([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Donors
  const getDonors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Donor/getDonors`);
      setDonors(res.data);
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
        setModalVisible('');
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

  // Rceive Donation
  const receiveDonation = async () => {
    if (!selectedDonor[0]?._id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a donor.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!value) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a donation type.',
        visibilityTime: 1500,
      });
      return;
    }
    if (
      !donForm.amount ||
      isNaN(Number(donForm.amount)) ||
      Number(donForm.amount) <= 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid amount.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!donForm.paymentMode || donForm.paymentMode.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a payment mode.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!donForm.date) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a date.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/Donation/receiveDonation`, {
        address: selectedDonor[0]?.address,
        amount: donForm.amount,
        contact: selectedDonor[0]?.contact,
        date: donForm.date,
        donationType: value,
        donorId: selectedDonor[0]?._id,
        name: selectedDonor[0]?.name,
        paymentMode: donForm.paymentMode,
        remarks: donForm.remarks,
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation received successfully!',
          visibilityTime: 1500,
        });
        getReceivedDonations();
        setSelectedDonor([]);
        setDonForm(initialDonationForm);
        setSearchDonor('');
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to receive donation.',
        visibilityTime: 1500,
      });
      console.log(err);
    }
  };

  useEffect(() => {
    getDonors();
    getReceivedDonations();
    getAllDist();
    getAllDonType();
    getAllUC();
    getAllZone();
  }, []);

  const [items, setItems] = useState([
    {label: 'Donation type 1', value: 1},
    {label: 'Donation type 22', value: 2},
    {label: 'Donation type 3', value: 3},
    {label: 'Education fund', value: 4},
    {label: 'Donation type 5', value: 5},
    {label: 'Health Fund', value: 6},
    {label: 'New type', value: 7},
  ]);

  // Tab buttons
  const tabs = [
    {id: 'All Donations', icon: 'charity', color: '#4ECDC4'},
    {id: 'Receive Donations', icon: 'hand-heart', color: '#FFD166'},
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

  // Converts a number (e.g. 1234) to words (e.g. "One Thousand Two Hundred Thirty Four")
  function numberToWords(num: number): string {
    if (isNaN(num) || num === 0) return 'Zero';

    const belowTwenty = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    function helper(n: number): string {
      if (n === 0) return '';
      if (n < 20) return belowTwenty[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
      if (n < 1000)
        return belowTwenty[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
      for (let i = 0, unit = 1000; i < thousands.length; i++, unit *= 1000) {
        if (n < unit * 1000) {
          return (
            helper(Math.floor(n / unit)) + thousands[i] + ' ' + helper(n % unit)
          );
        }
      }
      return '';
    }

    return helper(num).replace(/\s+/g, ' ').trim();
  }

  // Spinner
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

  const filteredDonations = donations.filter(don => {
    const matchesName = don?.donor?.name
      .toLowerCase()
      .includes(searchDonor.toLowerCase());

    const matchesType =
      !donTypeFilterValue || don?.donationType?._id === donTypeFilterValue;

    const matchesDist =
      !distFilterValue || don?.districtId?._id === distFilterValue;

    const matchesZone =
      !zoneFilterValue || don?.zoneId?._id === zoneFilterValue;

    const matchesUC = !ucFilterValue || don?.ucId?._id === ucFilterValue;

    return (
      matchesName && matchesType && matchesDist && matchesZone && matchesUC
    );
  });

  // State for donor search dropdown visibility
  const [showDonorSearch, setShowDonorSearch] = useState(false);

  // State for selected donor in "Receive Donations"
  const [selectedDonor, setSelectedDonor] = useState<Donors[]>([]);

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
        <Text style={styles.heading}>Donations</Text>
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
      {selectedTab === 'All Donations' && (
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: 'transparent',
              width: '90%',
              marginVertical: 10,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => setFiltersExpanded(!filtersExpanded)}>
              <Text style={styles.filterHeaderText}>Filters</Text>
              <Icon
                name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#6E11B0"
              />
            </TouchableOpacity>
            {filtersExpanded && (
              <>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.textInput, {width: '100%'}]}
                    placeholder="Search  Name"
                    placeholderTextColor={'#666'}
                    value={searchDonor}
                    onChangeText={setSearchDonor}
                  />
                </View>
                <View style={styles.row}>
                  <View style={[styles.dropDownContainer, {width: '48%'}]}>
                    <DropDownPicker
                      open={donTypeFilterOpen}
                      value={donTypeFilterValue}
                      items={transformedDonType}
                      setOpen={setDonTypeFilterOpen}
                      setValue={setDonTypeFilterValue}
                      placeholder="Donations By Type"
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
                  <View style={[styles.dropDownContainer, {width: '48%'}]}>
                    <DropDownPicker
                      open={distFilterOpen}
                      value={distFilterValue}
                      items={transformedDist}
                      setOpen={setDistFilterOpen}
                      setValue={setDistFilterValue}
                      placeholder="Donations By District"
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
                        zIndex: 1001,
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
                <View style={styles.row}>
                  <View style={[styles.dropDownContainer, {width: '48%'}]}>
                    <DropDownPicker
                      open={zoneFilterOpen}
                      value={zoneFilterValue}
                      items={transformedZone}
                      setOpen={setZoneFilterOpen}
                      setValue={setZoneFilterValue}
                      placeholder="Donations By Zone"
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
                        fontSize: 16,
                        color: '#222',
                        overflow: 'hidden',
                      }}
                    />
                  </View>
                  <View style={[styles.dropDownContainer, {width: '48%'}]}>
                    <DropDownPicker
                      open={ucFilterOpen}
                      value={ucFilterValue}
                      items={transformedUC}
                      setOpen={setUCFilterOpen}
                      setValue={setUCFilterValue}
                      placeholder="Donations By UC"
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
                        fontSize: 16,
                        color: '#222',
                        overflow: 'hidden',
                      }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
          <Text style={[styles.sectionTitle, {paddingHorizontal: '5%'}]}>
            All Users
          </Text>
          <View style={{flex: 1}}>
            <ScrollView
              style={styles.listContainer}
              contentContainerStyle={{paddingBottom: 40}}>
              {loading ? (
                <LoadingSpinner />
              ) : filteredDonations.length === 0 ? (
                <Text style={styles.noDataText}>No Donation found</Text>
              ) : (
                filteredDonations.map(donor => (
                  <View key={donor._id} style={styles.listItem}>
                    <View style={styles.avatar}>
                      <Icon name="charity" size={40} color="#6E11B0" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>
                        {donor?.donor?.name ?? 'N/A'}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {formatDate(donor.date)}
                      </Text>
                      <Text style={styles.itemRole}>Rs. {donor.amount}</Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          setModalVisible('View');
                          setSelectedDon([donor]);
                        }}>
                        <Icon name="eye" size={20} color="#4ECDC4" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          navigation.navigate('UpdateDonation', {
                            donationData: donor,
                          })
                        }>
                        <Icon name="pencil" size={20} color="#6E11B0" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          setModalVisible('Delete');
                          setSelectedDon([donor]);
                        }}>
                        <Icon name="delete" size={20} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {selectedTab === 'Receive Donations' && (
        <View
          style={{
            padding: 20,
          }}>
          <Text style={styles.sectionTitle}>Receive Donations</Text>

          <View style={styles.receiveDonContainer}>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 16,
                  marginBottom: 6,
                  color: '#6E11B0',
                }}>
                Search Donor
              </Text>
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Contact | Name"
                  placeholderTextColor="#888"
                  style={styles.textInput}
                  value={searchDonors}
                  onChangeText={text => {
                    setSearchDonors(text);
                    setShowDonorSearch(true);
                    if (text === '') {
                      setSelectedDonor([]);
                    }
                  }}
                  onFocus={() => setShowDonorSearch(true)}
                  onBlur={() =>
                    setTimeout(() => setShowDonorSearch(false), 200)
                  }
                />
                <TouchableOpacity style={styles.searchBtn}>
                  <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible('Donor')}>
                  <Text>
                    <Icon name="plus" size={40} color={'#6E11B0'} />
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Donor Search Modal-like Dropdown */}
              {showDonorSearch && searchDonors.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 75,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 8,
                    zIndex: 9999,
                    maxHeight: 200,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                  }}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {donors
                      .filter(
                        (d: Donors) =>
                          d.name
                            .toLowerCase()
                            .includes(searchDonors.toLowerCase()) ||
                          d.contact
                            .toLowerCase()
                            .includes(searchDonors.toLowerCase()),
                      )
                      .map((d: Donors) => (
                        <TouchableOpacity
                          key={d._id}
                          style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F0F0F0',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setSearchDonors(d.name);
                            setSelectedDonor([d]);
                            setShowDonorSearch(false);
                          }}>
                          <Icon name="account" size={22} color="#6E11B0" />
                          <View style={{marginLeft: 10}}>
                            <Text style={{fontWeight: '600', color: '#222'}}>
                              {d.name}
                            </Text>
                            <Text style={{color: '#888', fontSize: 13}}>
                              {d.contact}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    {donors.filter(
                      (d: Donors) =>
                        d.name
                          .toLowerCase()
                          .includes(searchDonors.toLowerCase()) ||
                        d.contact
                          .toLowerCase()
                          .includes(searchDonors.toLowerCase()),
                    ).length === 0 && (
                      <Text
                        style={{
                          padding: 12,
                          color: '#888',
                          textAlign: 'center',
                        }}>
                        No donor found
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Inputs */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.name || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
              <TextInput
                placeholder="Contact"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.contact || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Address"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.address || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
              <TextInput
                placeholder="District"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.districtId?.district || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Zone"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.zoneId?.zname || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
              <TextInput
                placeholder="Union Concil"
                placeholderTextColor="#666"
                editable={false}
                value={selectedDonor[0]?.ucId?.uname || ''}
                style={[
                  styles.textInput,
                  {width: '48%', backgroundColor: '#D1D5DC'},
                ]}
              />
            </View>

            {/* Inside Receive Donations tab */}
            <View style={styles.inputContainer}>
              <View style={styles.dropDownContainer}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Select Type"
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

              <TouchableOpacity>
                <Icon name="plus" size={35} color={'#6E11B0'} />
              </TouchableOpacity>

              <TextInput
                placeholder="Amount"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                value={donForm.amount}
                onChangeText={t => donFormOnChange('amount', t)}
                style={[styles.textInput, {width: '48%'}]}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Cash | Bank | Jazzcash etc"
                placeholderTextColor="#666"
                value={donForm.paymentMode}
                onChangeText={t => donFormOnChange('paymentMode', t)}
                style={[styles.textInput, {width: '100%'}]}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                  marginTop: 8,
                },
              ]}
              onPress={() => setDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {donForm.date
                  ? donForm.date.toLocaleDateString()
                  : 'Select Date'}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={dateOpen}
                mode="date"
                date={donForm.date}
                onConfirm={date => {
                  setDateOpen(false);
                  donFormOnChange('date', date);
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
            </TouchableOpacity>

            <TextInput
              placeholder="Remarks"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={donForm.remarks}
              onChangeText={t => donFormOnChange('remarks', t)}
              style={[
                styles.textInput,
                {
                  width: '100%',
                  height: 90,
                  textAlignVertical: 'top',
                  marginTop: 8,
                },
              ]}
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#6E11B0',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                marginTop: 15,
              }}
              onPress={() => {
                receiveDonation();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                Submit Donation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* View Modal */}
      <Modal
        transparent
        visible={modalVisible === 'View'}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible('');
          setSelectedDon([]);
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
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
                padding: 6,
              }}
              onPress={() => {
                setModalVisible('');
                setSelectedDon([]);
              }}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>

            {/* Modal Body */}
            <View style={styles.modalTop}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../assets/logo-black.png')}
                  resizeMode="contain"
                  style={styles.modalLogo}
                />
                <Text style={{fontSize: 12, fontWeight: '900', marginLeft: 12}}>
                  Receipt NO:{' '}
                  <Text
                    style={{
                      fontWeight: '300',
                      textDecorationLine: 'underline',
                    }}>
                    {selectedDon[0]?.receiptNumber ?? 'N/A'}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Name:</Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.donor?.name ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Contact:</Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.donor?.contact ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Address:</Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.donor?.address ?? 'N/a'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Donation Type: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.donationType?.dontype ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>District: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.districtId?.district ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Zone/ Tehsil: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.zoneId?.zname ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Union Council: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.ucId?.uname ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Remarks: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.remarks ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Payment Mode: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.paymentMode ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>
                Amount:{' '}
                <Text style={styles.modalSimpText}>
                  Rs. {selectedDon[0]?.amount ?? 'N/A'}/-
                </Text>
              </Text>
              <Text style={styles.modalBoldText}>
                Date:{' '}
                <Text style={styles.modalSimpText}>
                  {formatDate(selectedDon[0]?.date ?? 'N/A')}
                </Text>
              </Text>
            </View>
            <View
              style={[
                styles.modalRow,
                {flexDirection: 'column', alignItems: 'flex-start'},
              ]}>
              <Text style={styles.modalBoldText}>Amount In Words: </Text>
              <Text style={styles.modalSimpText}>
                {selectedDon[0]?.amount
                  ? `${numberToWords(
                      parseInt(selectedDon[0]?.amount, 10),
                    )} Rupees Only`
                  : 'Zero Rupees Only'}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.modalRow}>
              <Text style={styles.modalBoldText}>Received By:</Text>
              <Text style={styles.modalSimpText}>Admin</Text>
            </View>
            <View style={styles.stampContainer}>
              <Text style={[styles.modalSimpText, {fontSize: 12}]}>
                Office Stamp
              </Text>
            </View>

            <View style={styles.separator} />
            <Text
              style={[
                styles.modalSimpText,
                {fontSize: 12, fontWeight: '900', color: '#888'},
              ]}>
              Thank you for your generous contribution.
            </Text>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.modalPrintBtn}>
              <Icon name="printer" size={18} color={'#fff'} />
              <Text style={styles.modalPrintBtnText}>Print</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        transparent
        visible={modalVisible === 'Delete'}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible('');
          setSelectedDon([]);
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
              This donation will be permanently deleted.
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
                  deleteDonation();
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
                onPress={() => {
                  setModalVisible('');
                  setSelectedDon([]);
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

      {/* Add Donor */}
      <Modal
        transparent
        visible={modalVisible === 'Donor'}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible('');
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
                setModalVisible('');
                setAddDonorForm(initialAddDonorForm);
                setDistValue(null);
                setUCValue(null);
                setZoneValue(null);
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
              Add New Donor
            </Text>
            <View style={{marginBottom: 40}}>
              <TextInput
                placeholder={'Enter Name'}
                value={addDonorForm.name}
                onChangeText={t => donorOnChange('name', t)}
                placeholderTextColor={'#888'}
                style={[
                  styles.textInput,
                  {
                    width: '100%',
                    marginBottom: 15,
                  },
                ]}
              />
              <TextInput
                placeholder={'Enter Contact'}
                value={addDonorForm.contact}
                onChangeText={t => donorOnChange('contact', t)}
                placeholderTextColor={'#888'}
                style={[
                  styles.textInput,
                  {
                    width: '100%',
                    marginBottom: 15,
                  },
                ]}
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
                    marginBottom: 15,
                    width: '100%',
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
                      zIndex: 1001,
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
                      fontSize: 16,
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
                      fontSize: 16,
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
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={() => {
                  addDonor();
                }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                  Add Donor
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
                onPress={() => {
                  setModalVisible('');
                  setAddDonorForm(initialAddDonorForm);
                  setDistValue(null);
                  setUCValue(null);
                  setZoneValue(null);
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
                fontSize: 18,
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
                addDist();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
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
                fontSize: 18,
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
                addUC();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
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
                fontSize: 18,
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
                addZone();
              }}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
                Add Zone
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Donations;

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
    fontSize: 18,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 10,
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
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#F8F9FC',
    borderRadius: 8,
  },
  itemRole: {
    fontSize: 12,
    color: '#219653',
    fontWeight: '600',
    marginTop: 4,
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  receiveDonContainer: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    width: '58%',
    height: 45,
  },
  searchBtn: {
    width: '25%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#6E11B0',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dropDownContainer: {
    width: '40%',
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
  },

  //Modal
  modalTop: {
    width: '100%',
    paddingHorizontal: '3%',
    paddingVertical: 10,
  },
  modalLogo: {
    height: 100,
    width: 100,
  },
  modalRow: {
    width: '100%',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modalBoldText: {
    fontSize: 14,
    fontWeight: '900',
  },
  modalSimpText: {
    fontWeight: '400',
  },
  separator: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    backgroundColor: '#666',
    width: '100%',
  },
  stampContainer: {
    height: 80,
    width: 120,
    marginTop: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrintBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  modalPrintBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '900',
    marginLeft: 5,
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  filterHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6E11B0',
  },
  listContainer: {
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
});
