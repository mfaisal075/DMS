import {
  Animated,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import {BackHandler} from 'react-native';
import {Modal} from 'react-native';
import Sidebar from '../components/Sidebar';

interface Balance {
  monthlyTotal: number;
  yearlyTotal: number;
  overallTotal: number;
}

interface Donation {
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
  receiptNumber: string;
  amount: string;
  date: string;
  remarks: string;
  paymentMode: string;
  donationType: {
    _id: string;
    dontype: string;
  };
}

const Dashboard = ({navigation}: any) => {
  const [balData, setBalData] = useState<Balance>();
  const [showSignOut, setShowSignOut] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [sortedDonations, setSortedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<[]>([]);
  const [ucItems, setUCItems] = useState<[]>([]);
  const [zoneItems, setZoneItems] = useState<[]>([]);
  const [districts, setDistricts] = useState<[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Action buttons data
  const actionButtons = [
    {id: 'Users', icon: 'account-group', color: '#FF6B6B'},
    {id: 'Donations', icon: 'hand-heart', color: '#4ECDC4'},
    {id: 'Reports', icon: 'chart-bar', color: '#FFD166'},
    {id: 'Configurations', icon: 'cog', color: '#6A0572'},
  ];

  // Get Donation Totals
  const getDonationTotals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Donation/donationTotals`);

      setBalData(res.data);
    } catch (error) {
      console.log(error);
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

  //Get Districts
  const getAllDist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/District/getAllDist`);
      setDistricts(res.data);
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

  const fetchAllData = async () => {
    try {
      await Promise.all([
        getDonationTotals(),
        getReceivedDonations(),
        getAllDist(),
        getAllUC(),
        getAllZone(),
        getDonors(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const backAction = () => {
      setExitModalVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (donations.length > 0) {
      const sorted = [...donations].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setSortedDonations(sorted.slice(0, 5)); // only keep 5 latest
    }
  }, [donations]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
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
          style={{width: 120, height: 120}}
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

      {loading ? (
        <View style={styles.fullScreenLoading}>
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView>
          {/* Balance Cards - Now vertical layout */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Financial Overview</Text>

            <View style={styles.cardsContainer}>
              {/* Total Donations Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardText}>Total Donations</Text>
                  <Icon name="cash" size={24} color="#6E11B0" />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardBalText}>
                    Rs. {balData?.monthlyTotal ?? 0}/-
                  </Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.cardMetaItem}>
                      <Icon name="calendar" size={16} color="#8E8E93" />
                      <Text style={styles.cardMonthText}>
                        {new Date().toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Yearly Donations Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardText}>Yearly Donations</Text>
                  <Icon name="calendar" size={24} color="#6E11B0" />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardBalText}>
                    Rs. {balData?.yearlyTotal ?? 0}/-
                  </Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.cardMetaItem}>
                      <Icon name="calendar-range" size={16} color="#8E8E93" />
                      <Text style={styles.cardMonthText}>
                        {`Jan - ${new Date().toLocaleString('default', {
                          month: 'short',
                        })} ${new Date().getFullYear()}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons Section */}
          <Text
            style={[
              styles.sectionTitle,
              {paddingHorizontal: '5%', marginTop: 5},
            ]}>
            Quick Actions
          </Text>
          <View style={styles.actionsContainer}>
            {actionButtons.map(button => (
              <TouchableOpacity
                key={button.id}
                style={[styles.actionButton, {backgroundColor: button.color}]}
                onPress={() => {
                  button.id === 'Users' && navigation.navigate('Users');
                  button.id === 'Donations' && navigation.navigate('Donations');
                  button.id === 'Configurations' &&
                    navigation.navigate('Configurations');
                  button.id === 'Reports' && navigation.navigate('Reports');
                }}>
                <Icon name={button.icon} size={32} color="#FFF" />
                <Text style={styles.actionButtonText}>{button.id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Latest Donations</Text>

            <View style={styles.donContainer}>
              {sortedDonations.length === 0 ? (
                <Text style={styles.noDataText}>No Donation found</Text>
              ) : (
                sortedDonations.map(don => (
                  <View key={don._id} style={styles.listItem}>
                    <View style={styles.avatar}>
                      <Icon name="charity" size={40} color="#6E11B0" />
                    </View>
                    <View style={styles.itemInfo}>
                      <View>
                        <Text style={styles.itemTitle}>
                          {don?.donor?.name ?? 'N/A'}
                        </Text>
                        <Text style={styles.itemSubtitle}>
                          {formatDate(don.date)}
                        </Text>
                      </View>
                      <Text style={styles.itemRole}>Rs. {don.amount}/-</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Stats Cards Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Icon name="account-group-outline" size={28} color="#6E11B0" />
                <Text style={styles.statsLabel}>Donors</Text>
                <Text style={styles.statsValue}>{donors.length}</Text>
              </View>

              <View style={styles.statsCard}>
                <Icon name="map-outline" size={28} color="#6E11B0" />
                <Text style={styles.statsLabel}>Zones</Text>
                <Text style={styles.statsValue}>{zoneItems.length}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Icon name="map-marker" size={28} color="#6E11B0" />
                <Text style={styles.statsLabel}>Union Councils</Text>
                <Text style={styles.statsValue}>{ucItems.length}</Text>
              </View>

              <View style={styles.statsCard}>
                <Icon name="city-variant-outline" size={28} color="#6E11B0" />
                <Text style={styles.statsLabel}>Districts</Text>
                <Text style={styles.statsValue}>{districts.length}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={exitModalVisible}
        onRequestClose={() => setExitModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              padding: 28,
              borderRadius: 18,
              alignItems: 'center',
              elevation: 10,
              shadowColor: '#6E11B0',
              shadowOffset: {width: 0, height: 6},
              shadowOpacity: 0.18,
              shadowRadius: 16,
            }}>
            <View
              style={{
                backgroundColor: '#F3E8FF',
                borderRadius: 50,
                padding: 18,
                marginBottom: 16,
              }}>
              <Icon name="alert-circle" size={48} color="#6E11B0" />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: '#6E11B0',
                marginBottom: 8,
                textAlign: 'center',
              }}>
              Exit Application
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#444',
                marginBottom: 22,
                textAlign: 'center',
              }}>
              Are you sure you want to exit the app?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => setExitModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#F3E8FF',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginRight: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="close-circle"
                  size={20}
                  color="#6E11B0"
                  style={{marginRight: 6}}
                />
                <Text style={{color: '#6E11B0', fontWeight: '700'}}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  BackHandler.exitApp();
                  setExitModalVisible(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6E11B0',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="exit-to-app"
                  size={20}
                  color="#fff"
                  style={{marginRight: 6}}
                />
                <Text style={{color: '#fff', fontWeight: '700'}}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    paddingBottom: 20,
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
  cardIcon: {
    justifyContent: 'center',
    paddingRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 15,
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#6E11B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  cardText: {
    color: '#6E11B0',
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalText: {
    fontWeight: '900',
    color: '#000',
    fontSize: 18,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardMonthText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },

  // Latest Donation Section
  donContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    color: '#219653',
    backgroundColor: 'transparent',
    marginTop: 0,
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

  statsContainer: {
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: '48%',
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statsLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6E11B0',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginTop: 4,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F6FB',
  },
});
