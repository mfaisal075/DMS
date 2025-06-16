import {
  Animated,
  Easing,
  Image,
  Platform,
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
import {ScrollView} from 'react-native';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';

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

interface ReportsData {
  _id: string;
  donor: {
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
  };
  amount: string;
  donationType: {
    _id: string;
    dontype: string;
  };
  remarks: string;
  date: string;
  paymentMode: string;
}

const Reports = () => {
  const [open, setOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [ucOpen, setUCOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [distValue, setDistValue] = useState(null);
  const [zoneValue, setZoneValue] = useState(null);
  const [ucValue, setUCValue] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [repData, setRepData] = useState<ReportsData[]>([]);
  const [loading, setLoading] = useState(false);

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

  // District Dropdown
  const [districts, setDistricts] = useState<Districts[]>([]);
  const transformedDist = districts.map(dist => ({
    label: dist.district,
    value: dist._id,
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

  // Get Districts
  const getAllDist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/District/getAllDist`);
      setDistricts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Reports Data
  const reportsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/Report/donations?startDate=${fromDate
          .toISOString()
          .slice(0, 10)}&endDate=${toDate
          .toISOString()
          .slice(0, 10)}&donationType=${
          value ?? ''
        }&donorName=${encodeURIComponent(searchName)}&districtId=${
          distValue ?? ''
        }&zoneId=${zoneValue ?? ''}&ucId=${ucValue ?? ''}`,
      );
      setRepData(res.data);
      console.log('Data: ', res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDonType();
    getAllUC();
    getAllZone();
    getAllDist();
    reportsData();
  }, [fromDate, toDate, value, distValue, zoneValue, ucValue]);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

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
        <Text style={styles.heading}>Reports</Text>
        <TouchableOpacity>
          <Icon name="account-circle" size={45} color="#fff" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <View style={styles.receiveDonContainer}>
          {/* Filters */}
          <Text style={styles.sectionTitle}>Donation Reports</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.textInput}
              placeholder="Donor Name"
              value={searchName}
              onChangeText={t => setSearchName(t)}
              placeholderTextColor={'#666'}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '48%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                  marginTop: 8,
                },
              ]}
              onPress={() => setFromDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {fromDate ? fromDate.toLocaleDateString() : 'From Date'}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={fromDateOpen}
                mode="date"
                date={fromDate}
                onConfirm={date => {
                  setFromDateOpen(false);
                  setFromDate(date);
                }}
                onCancel={() => {
                  setFromDateOpen(false);
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '48%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                  marginTop: 8,
                },
              ]}
              onPress={() => setFromDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {toDate ? toDate.toLocaleDateString() : 'To Date'}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={toDateOpen}
                mode="date"
                date={toDate}
                onConfirm={date => {
                  setToDateOpen(false);
                  setToDate(date);
                }}
                onCancel={() => {
                  setToDateOpen(false);
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={open}
                value={value}
                items={transformedDonType}
                setOpen={setOpen}
                setValue={setValue}
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
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={zoneOpen}
                value={zoneValue}
                items={transformedZone}
                setOpen={setZoneOpen}
                setValue={setZoneValue}
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
            <View style={styles.dropDownContainer}>
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
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Generate Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          <View style={styles.headingContainer}>
            <Text style={[styles.heading, {color: '#6E11B0'}]}>Report</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{maxHeight: 350}}
            contentContainerStyle={{paddingBottom: 50}}>
            {loading ? (
              <LoadingSpinner />
            ) : repData.length === 0 ? (
              <Text style={styles.noDataText}>No Data found</Text>
            ) : (
              repData.map(report => (
                <TouchableOpacity
                  key={report._id}
                  style={{
                    backgroundColor: '#F3F6FB',
                    borderRadius: 14,
                    marginHorizontal: 15,
                    marginBottom: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    shadowColor: '#6E11B0',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    elevation: 2,
                    minHeight: 60,
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    // Handle card click (e.g., show details)
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '700',
                          color: '#6E11B0',
                          marginBottom: 2,
                        }}>
                        {report.donor.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#444',
                          fontWeight: '400',
                          marginBottom: 1,
                        }}>
                        {formatDate(report.date)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: '400',
                        }}>
                        {report?.donationType?.dontype}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#6E11B0',
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                      {report.amount}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Reports;

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
  row: {
    marginTop: 15,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  dropDownContainer: {
    width: '48%',
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
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
    width: '100%',
    height: 45,
  },
  separator: {
    marginTop: 15,
    marginBottom: 10,
    height: 1,
    backgroundColor: '#666',
    width: '90%',
    alignSelf: 'center',
  },
  receiveDonContainer: {
    paddingVertical: '5%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6E11B0',
    marginLeft: 15,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#6E11B0',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
  headingContainer: {
    width: '100%',
    height: 35,
    marginVertical: 5,
    paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
