import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';

type UpdateDonationRouteParams = {
  donationData: any;
};

interface DonTypes {
  _id: string;
  dontype: string;
}

const UpdateDonation = () => {
  const route =
    useRoute<RouteProp<{params: UpdateDonationRouteParams}, 'params'>>();
  const {donationData} = route.params;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  const [allDonType, setAllDonType] = useState<DonTypes[]>([]);
  const transformedDonType = allDonType.map(type => ({
    label: type.dontype,
    value: type._id,
  }));

  // Get Donations Type
  const getAllDonType = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donType/getAllDonType`);
      setAllDonType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDonType();
    console.log(
      'Date: ',
      new Date(donationData.date).toISOString().slice(0, 10),
    );
  }, []);

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

      <ScrollView>
        <View
          style={{
            flex: 1,
            padding: 20,
          }}>
          <View style={styles.receiveDonContainer}>
            <Text style={styles.sectionTitle}>Receive Donations</Text>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Donor Name"
                placeholderTextColor={'#666'}
                value={donationData.donor.name}
                onChangeText={t => {
                  /* handle donor name change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Contact"
                placeholderTextColor={'#666'}
                value={donationData.donor.contact}
                onChangeText={t => {
                  /* handle contact change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Address"
                placeholderTextColor={'#666'}
                value={donationData.donor.address}
                onChangeText={t => {
                  /* handle address change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Union Council"
                placeholderTextColor={'#666'}
                value={donationData?.ucId?.uname}
                onChangeText={t => {
                  /* handle union council change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="District"
                placeholderTextColor={'#666'}
                value={donationData?.districtId?.district}
                onChangeText={t => {
                  /* handle district change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Zone"
                placeholderTextColor={'#666'}
                value={donationData?.zoneId?.zname}
                onChangeText={t => {
                  /* handle zone change */
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Account"
                value={donationData.amount?.toString() || ''}
                onChangeText={t => {
                  /* handle amount change */
                }}
                placeholderTextColor={'#666'}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Payment Mode"
                placeholderTextColor={'#666'}
                value={donationData.paymentMode}
                onChangeText={t => {
                  /* handle payment mode change */
                }}
              />
            </View>

            {/* DropDown */}
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={open}
                value={donationData?.donationType._id}
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

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Remarks"
                placeholderTextColor={'#666'}
                value={donationData.remarks}
              />
            </View>

            {/* Date Picker */}
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '95%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                },
              ]}
              onPress={() => setDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 16}}>
                {date
                  ? date.toLocaleDateString()
                  : donationData?.date
                  ? new Date(donationData.date).toLocaleDateString()
                  : 'Select Date'}
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

            {/* Update Button */}
            <TouchableOpacity style={styles.updateBtn}>
              <Text style={styles.updateBtnText}>Update Donation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateDonation;

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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 20,
  },
  receiveDonContainer: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    borderRadius: 16,
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
    width: '95%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
  },
  dropDownContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
  },
  updateBtn: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#6E11B0',
    marginBottom: 15,
    alignItems: 'center',
  },
  updateBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
