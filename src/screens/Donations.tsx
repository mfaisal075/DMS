import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

const Donations = () => {
  const [selectedTab, setSelectedTab] = useState('All Donations');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  const [items, setItems] = useState([
    {label: 'Donation type 1', value: 1},
    {label: 'Donation type 22', value: 2},
    {label: 'Donation type 3', value: 3},
    {label: 'Education fund', value: 4},
    {label: 'Donation type 5', value: 5},
    {label: 'Health Fund', value: 6},
    {label: 'New type', value: 7},
  ]);

  const donationsData = [
    {
      id: '1',
      receipt: 'DON-0021',
      donor: 'Rashid',
      contact: '030048556230',
      amount: '3500',
      type: 'Health Fund',
      date: '6/14/2025',
    },
    {
      id: '2',
      receipt: 'DON-0022',
      donor: 'M Adan Hunjra',
      contact: '030048956230',
      amount: '50000',
      type: 'Welfare donation',
      date: '6/3/2025',
    },
    {
      id: '3',
      receipt: 'DON-0023',
      donor: 'Danish Miza',
      contact: '030048956230',
      amount: '1000',
      type: 'Library Fund',
      date: '6/22/2025',
    },
    {
      id: '4',
      receipt: 'DON-0024',
      donor: 'Bilal Yousuf',
      contact: '030048956230',
      amount: '15000',
      type: 'Health Fund',
      date: '6/23/2025',
    },
    {
      id: '5',
      receipt: 'DON-0025',
      donor: 'Asghar Ali',
      contact: '030048956230',
      amount: '800',
      type: 'Welfare donation',
      date: '6/4/2025',
    },
  ];

  // Tab buttons
  const tabs = [
    {id: 'All Donations', icon: 'charity', color: '#4ECDC4'},
    {id: 'Receive Donations', icon: 'hand-heart', color: '#FFD166'},
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
        <ScrollView style={styles.contentContainer}>
          <>
            <Text style={styles.sectionTitle}>All Users</Text>
            {donationsData.map(donor => (
              <View key={donor.id} style={styles.listItem}>
                <View style={styles.avatar}>
                  <Icon name="charity" size={40} color="#6E11B0" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{donor.donor}</Text>
                  <Text style={styles.itemSubtitle}>{donor.date}</Text>
                  <Text style={styles.itemRole}>Rs. {donor.amount}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="eye" size={20} color="#4ECDC4" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="pencil" size={20} color="#6E11B0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        </ScrollView>
      )}

      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        {selectedTab === 'Receive Donations' && (
          <>
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
                  />
                  <TouchableOpacity style={styles.searchBtn}>
                    <Text style={styles.searchBtnText}>Search</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text>
                      <Icon name="plus" size={40} color={'#6E11B0'} />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Inputs */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#666"
                  editable={false}
                  style={[
                    styles.textInput,
                    {width: '48%', backgroundColor: '#D1D5DC'},
                  ]}
                />
                <TextInput
                  placeholder="Contact"
                  placeholderTextColor="#666"
                  editable={false}
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
                  style={[
                    styles.textInput,
                    {width: '48%', backgroundColor: '#D1D5DC'},
                  ]}
                />
                <TextInput
                  placeholder="District"
                  placeholderTextColor="#666"
                  editable={false}
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
                  style={[
                    styles.textInput,
                    {width: '48%', backgroundColor: '#D1D5DC'},
                  ]}
                />
                <TextInput
                  placeholder="Union Concil"
                  placeholderTextColor="#666"
                  editable={false}
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
                      fontSize: 16,
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
                  style={[styles.textInput, {width: '48%'}]}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Cash | Bank | Jazzcash etc"
                  placeholderTextColor="#666"
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
                  {date ? date.toLocaleDateString() : 'Select Date'}
                </Text>
                <Icon name="calendar" size={22} color="#6E11B0" />
                <DatePicker
                  modal
                  open={dateOpen}
                  mode="date"
                  date={date}
                  onConfirm={date => {
                    setDateOpen(false);
                    setDate(date);
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
                  // Submit donation logic here
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                  Submit Donation
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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
});
