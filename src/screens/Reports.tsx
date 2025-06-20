import {
  Animated,
  BackHandler,
  Easing,
  Image,
  Platform,
  Pressable,
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
import {Modal} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {PermissionsAndroid} from 'react-native';
import {Alert} from 'react-native';
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
  receiptNumber: string;
  paymentMode: string;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Reports = ({navigation}: any) => {
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
  const [repData, setRepData] = useState<ReportsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ReportsData[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  const [showSignOut, setShowSignOut] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
        }&donorName=${encodeURIComponent(debouncedSearchTerm)}&districtId=${
          distValue ?? ''
        }&zoneId=${zoneValue ?? ''}&ucId=${ucValue ?? ''}`,
      );
      setRepData(res.data);
      console.log(repData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setFromDate(new Date());
    setToDate(new Date());
    setValue(null);
    setDistValue(null);
    setZoneValue(null);
    setUCValue(null);
  };

  useEffect(() => {
    getAllDonType();
    getAllUC();
    getAllZone();
    getAllDist();
    reportsData();

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
  }, [
    fromDate,
    toDate,
    value,
    distValue,
    zoneValue,
    ucValue,
    debouncedSearchTerm,
  ]);

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

  const generateDonationReportPDF = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Cannot save PDF without storage permission.',
          );
          return;
        }
      }

      const totalAmount = repData.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );
      const now = new Date().toLocaleString();

      // Create table rows
      const tableRows = repData
        .map((d, index) => {
          return `
            <tr>
            <td style="min-width: 120px;">${d.receiptNumber}</td>
            <td>${d.donor.name}</td>
            <td>${d.donor.contact}</td>
            <td>${d.donationType?.dontype}</td>
            <td>${d.amount}</td>
            <td>${formatDate(d.date)}</td>
            <td>${d.donor?.districtId?.district}</td>
            <td>${d.donor?.zoneId?.zname}</td>
            <td>${d.donor?.ucId?.uname}</td>
            </tr>
          `;
        })
        .join('');

      const htmlContent = `
      <html>
        <head>
          <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2, p { text-align: center; }
        .table-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 6px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
        }
        .footer {
          margin-top: 20px;
          font-weight: bold;
          text-align: center;
        }
          </style>
        </head>
        <body>
          <h2>Donation Report</h2>
          <p>Report Generated: ${now}</p>
          <p>From: ${fromDate.toISOString().split('T')[0]} To: ${
        toDate.toISOString().split('T')[0]
      }</p>

          <div class="table-container">
        <table>
          <tr>
            <th>Receipt No.</th>
            <th>Donor</th>
            <th>Contact</th>
            <th>Donation Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>District</th>
            <th>Zone</th>
            <th>UC</th>
          </tr>
          ${tableRows}
        </table>
          </div>

          <div class="footer">Total Donations (in PKR): ${totalAmount.toLocaleString()}</div>
        </body>
      </html>
        `;

      const pdfOptions = {
        html: htmlContent,
        fileName: 'Donation_Report',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(pdfOptions);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `PDF Generated. Saved to: ${file.filePath}`,
        visibilityTime: 1500,
      });
      return file.filePath;
    } catch (error) {
      console.error('PDF generation error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate PDF report.',
        visibilityTime: 2000,
      });
    }
  };

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
              value={searchInput}
              onChangeText={setSearchInput}
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
              <Text style={{color: '#222', fontSize: 14}}>
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
              onPress={() => setToDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 14}}>
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
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => clearFilters()}>
              <Text style={styles.btnText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          <View style={styles.headingContainer}>
            <Text style={[styles.sectionTitle, {color: '#6E11B0'}]}>
              Report
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={generateDonationReportPDF}>
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
                    setSelectedRecord([report]);
                    setModalVisible('View');
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
                          fontSize: 14,
                          fontWeight: '700',
                          color: '#6E11B0',
                          marginBottom: 2,
                        }}>
                        {report.donor.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#444',
                          fontWeight: '400',
                          marginBottom: 1,
                        }}>
                        {formatDate(report.date)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#888',
                          fontWeight: '400',
                        }}>
                        {report?.donationType?.dontype}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#6E11B0',
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                      Rs. {report.amount}/-
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* View Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible === 'View'}
        onRequestClose={() => {
          setModalVisible('');
          setSelectedRecord([]);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donation Details</Text>
              <Pressable
                onPress={() => {
                  setModalVisible('');
                  setSelectedRecord([]);
                }}
                style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </Pressable>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Receipt. No</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.receiptNumber || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Donor</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donor.name || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donor.contact || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Donation Type</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donationType?.dontype || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={[styles.detailValue, styles.amountValue]}>
                  Rs. {selectedRecord[0]?.amount || '0'}/-
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedRecord[0]?.date) || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>District</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donor?.districtId?.district || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Zone</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donor?.zoneId?.zname || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>UC</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.donor?.ucId?.uname || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Mode</Text>
                <Text style={styles.detailValue}>
                  {selectedRecord[0]?.paymentMode || 'N/A'}
                </Text>
              </View>

              <View style={[styles.detailRow, {borderBottomWidth: 0}]}>
                <Text style={styles.detailLabel}>Remarks</Text>
                <Text style={[styles.detailValue, styles.remarks]}>
                  {selectedRecord[0]?.remarks || 'No remarks'}
                </Text>
              </View>
            </ScrollView>
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
    fontSize: 18,
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
    fontSize: 14,
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
    fontSize: 18,
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
    fontSize: 12,
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#6E11B0',
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6E11B0',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: '55%',
    textAlign: 'right',
  },
  amountValue: {
    fontWeight: 'bold',
    color: '#6E11B0',
  },
  remarks: {
    fontStyle: 'italic',
    color: '#666',
  },

  // Report Card
  reportCard: {
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
  },
});
